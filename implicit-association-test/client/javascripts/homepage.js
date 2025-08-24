//#################################################################################################################################
// IMPORTS DES FONCTIONS ANNEXES
//#################################################################################################################################

import 
{ 
    displayHomePage,
    buildTurnText,
    replaceContent,
    replaceContentText,
    updateHtmlCategories,
    displayBias, 
} from './updateHtml.js'; 

import { getCategories, fetchFormulaire } from './utils.js';

import { UserAnswer } from './class.js';

import { lowDict } from './constante/debug.js'


//#################################################################################################################################
// JAVASCRIPT DOC TYPEDEF 
//#################################################################################################################################

/**
 * @typedef {Object} Answer 
 * @property {number} questionIndex - Index of the word in the current sequence. 
 * @property {boolean} firstTime - Whether the answer was correct on the first try. 
 * @property {number|null} deltaTime - Response time in milliseconds (or null at creation). 
 * @property {boolean} truncated - Whether the response time was capped due to being too fast or too slow.
 */

/**
 * @typedef {Object} AnswersDict 
 * @property {{ index : number, lastQuestionTime : number}} data - Metadata about the current progress of the test.
 * @property {Object.<string, Answer>} answers - Dictionary of user answers keyed by word
 */

/**
 * @typedef {Object.<string, AnswersDict>} FinalDict 
 * Dictionary containing categorized blocks of user answers (e.g., by cluster name).
 */

/**
 * @typedef {Object} Word 
 * @property {string} mot The actual word to be displayed 
 * @property {string} categorie The actual word category 
 */

//#################################################################################################################################
// STATIC VARIABLES
//#################################################################################################################################

/**
 * The current turn of the test 
 * 
 * @type {number}
 * @global 
 */
let currentTurn = 0; 


/**
 * @type {FinalDict} 
 * @global
*/
let finalDict = {
    firstCluster: null, // e.g., Science vs Litterarture
    secondCluster: null, // e.g., Masculine vs Feminine
    thirdCluster: null, // e.g., Masculine + Science vs Feminine + Litterature
    fourthCluster: null, // same 
    fifthCluster: null, // firstCluster reversed
    sixthCluster: null, // third reversed
    seventhCluster: null // same
}; 

/**
 * Used when adding user's answers dictionary to {@link finalDict}
 * @type {string[]}
 * @global
 */
const clusterKeys = ["firstCluster", "secondCluster", "thirdCluster", "fourthCluster", "fifthCluster", "sixthCluster", "seventhCluster"];


/**
 * Reference to the event "keydownHandler" 
 * 
 * Used to cleanup the event if not null 
 * 
 * @type {Function|null}
 * @global
 */
let keydownHandler = null; 


/**
 * Control whether spacebar input is allowed 
 * 
 * Used to prevent multiple call to play function 
 * @type {boolean}
 * @global 
 */
let authorizeSpacebar = true; 

/**
 * Control whether keydown input ("e" or "i") is allowed 
 * 
 * Used to prevent multiple call to handleAnswer 
 * @type {boolean}
 * @global
 */
let authorizeKeydown = true; // used to lock event listeners. if this's false, pressing a key (e or i) won't try to handle the answer 

/**
 * Singleton instance of the {@link UserAnswer} class 
 * 
 * Used to store and manage the user's state through the test : filteredWords, currentCategory, answersDict
 * @type {UserAnswer} 
 * @global 
 */
const user = new UserAnswer();


/**
 * Time penalty added to response time when user makes a mistake
 * 
 * Based on Greenwald study  
 * @constant
 * @global
 */
const deltaError = 600; 

var formulaire = null;

//#################################################################################################################################
// AUX FUNCTIONS 
//#################################################################################################################################
/**
 * Setup all event listeners with cleanup 
 * 
 * Removes existing keydownHandler if present, then creates a new one that:    
 * - Spacebar launches {@link play}   
 * - "e" or "i" launches {@link handleAnswer}   
 * 
 * Each function has a boolean which has to be true for the function to launch (i.e. authorizeSpacebar & authorizeKeydown).    

 * @returns {void}
 */
const setupEventListeners = 
    () => {

        if (keydownHandler) document.removeEventListener("keydown", keydownHandler)

        keydownHandler = async function (event) {
            if ((event.code === "Space" || event.key === " ") && authorizeSpacebar){
                authorizeSpacebar = false;
                authorizeKeydown = true; 
                await play();
            } 
            if ((event.code === "KeyE" || event.key === "e" || event.code === "KeyI" || event.key === "i") && authorizeKeydown){
                authorizeKeydown = false; 
                await handleAnswer(event.key);
            }
        }

        document.addEventListener("keydown", keydownHandler);

        const quitButton = document.getElementById("quit-button");
        if (quitButton) {
            quitButton.addEventListener("click", () => {
            const confirmed = confirm("Voulez-vous vraiment quitter le test ? Vos réponses ne seront pas enregistrées.");
            if (confirmed) {
                window.location.href = "http://localhost:3000/selectTest.html";
            }
            });
        }
    }   


const testID = ()=>{
    const params = new URLSearchParams(window.location.search);
    const testId = params.get('testId');
    if (testId) {
      sessionStorage.setItem('testId', testId);
      console.log('testId enregistré:', testId);
    }
    return testId;
}

/**
 * 
 */


/**
 * Initialize the app by displaying the homepage and setting up event listeners
 * 
 * @returns {void}
 * @see displayHomePage  
 * @see setupEventListeners  
 */
const setup = 
    async () => {
        const testId = testID();
        formulaire = await fetchFormulaire(testId);
        displayHomePage();
        setupEventListeners();
    };


/**
 * Handles user input ("e" or "i") and evaluate the correctness.
 * 
 * Determines if the pressed key matches the expected category. 
 * Update the answers dictionary.
 *  
 * @param {"e"|"i"} key The user's keyboard input.
 * @see fillDictForWord
 * @see getDeltaTime
 */
const handleAnswer = 
    async (key) => {

        const currentWord = user.filteredWords[user.answersDict.data.index];  

        const [eCategories,iCategories] = user.categories;

        if(!eCategories || !iCategories) {
            console.error("categories aren't defined"); 
            return; 
        }

        const userAnswer = key === "e" ? eCategories : iCategories; 
        const realAnswer = eCategories.includes(currentWord.categorie) ? eCategories : iCategories; 
        const correct = userAnswer === realAnswer; 

        fillDictForWord(currentWord,realAnswer);

        if (correct) { 
            getDeltaTime(currentWord);
            replaceContent(""); 
            document.getElementById("cross").hidden = true; 
            setTimeout(handleWait,400);

        } else { 
            authorizeKeydown = true; 
            document.getElementById("cross").hidden = false; 
            user.answersDict.data.firstTime = false; 
        }
    }

/**
 * Handle the delay after a correct answer. 
 *  
 * Increment the index, checks for end of set, saves data to {@link finalDict}, and update categories for next turn.
 * 
 * @returns {void}
 * @see updateCategories
 * @see replaceContentText 
 * @see buildTurnText
 */
const handleWait =
    async () => {
 
        user.answersDict.data.lastQuestionTime = Date.now();
        user.answersDict.data.index++;

        if (user.answersDict.data.index < user.filteredWords.length) {
            authorizeKeydown = true; 
            replaceContent(user.filteredWords[user.answersDict.data.index].mot); 

        } else {
            finalDict[clusterKeys[currentTurn++]] = user.answersDict; 
            user.updateCategories(formulaire,currentTurn);
            updateHtmlCategories(user.categories[0],user.categories[1]);
            replaceContentText(buildTurnText(currentTurn));
            authorizeSpacebar = true; 
        }
    }

/**
 * Pepare answerDict for future associations.
 * 
 * @param {Object} currentWord MongoDB object. 
 * @param {string} currentWord.mot String of the word. 
 * @param {string} currentWord.categorie Category of the word.
 * @returns {void} 
 */
const fillDictForWord = 
    (currentWord) => {

        if (!user.answersDict.answers[currentWord.mot]){
            user.answersDict.answers[currentWord.mot] = {
                questionIndex: user.answersDict.data.index,
                firstTime : true,
                deltaTime: null,
                truncated: false // not useful
            };
        }
    }

/**
 * Get time difference between display of word and user input ("e/i" press).  
 *  
 * 
 * First it calculate raw response time    
 * Second it apply bounds (if time's below 300 ms or above 3000ms) 
 * Third it add error penalty if it wasn't the first attempt 
 * Finally it stores final deltaTime in user's answer dictionary 
 *   
 * @param {Object} currentWord MongoDB object.
 * @param {string} currentWord.mot the string of the word. 
 * @param {string} currentWord.categorie the categorie of the word.
 * @returns {void} 
 */
const getDeltaTime = 
    (currentWord) => {
        let deltaTime = Date.now() - user.answersDict.data.lastQuestionTime; 
        if (deltaTime < 300 || deltaTime > 3000) {
            deltaTime = Math.min(Math.max(deltaTime,300),3000); 
            user.answersDict.answers[currentWord.mot].truncated = true;
        }
        deltaTime = user.answersDict.answers[currentWord.mot].firstTime === true 
          ? deltaTime 
          : deltaTime + deltaError; 
        
        user.answersDict.answers[currentWord.mot].deltaTime = deltaTime;
    }

/**
 * Get (via {@link getCategories}) and change categories according to currentTurn 
 *    
 * Fetch and filter words according to categories    
 * Start the turn by displaying first word      
 * 
 * @returns {void} 
 */
const playCategories = 
    async () => {

        user.updateCategories(formulaire,currentTurn);
        user.createDict(); 
        await user.filterWords();

        updateHtmlCategories(user.categories[0],user.categories[1]);
        replaceContentText("");
        replaceContent(user.filteredWords[0].mot); 

    }

/**
 * Returns the test result based on the user's answers
 * Uses {@link displayBias}
 */
const endTest = 
    async () => {

        document.getElementById("left-screen").hidden = true; 
        document.getElementById("right-screen").hidden = true;
        await displayBias(finalDict, user.categories, formulaire); 
        document.getElementById("app-canvas").style.display = 'none';
    }
//#################################################################################################################################
// MAIN FUNCTION 
//#################################################################################################################################

/**
 * Main function   
 * Called by {@link setupEventListeners} when pressing spacebar
 */
const play = 
    async () => {

        if (currentTurn > 6) {
            await endTest();
        }
        playCategories();
    } 


//#################################################################################################################################
// SETUP ON THE PAGE LOADING 
//#################################################################################################################################

document.addEventListener("DOMContentLoaded", setup);





