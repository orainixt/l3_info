import { calculateDScore  } from "./mathematics.js";

//#################################################################################################################################
// JAVASCRIPT DOC TYPEDEF 
//#################################################################################################################################
/**
 * @typedef {Object} Word 
 * @property {string} mot The actual word to be displayed 
 * @property {string} categorie The actual word category 
 */

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

//#################################################################################################################################
// FUNCTIONS 
//#################################################################################################################################
 /**
 * Fetch and filter words for the given categories.
 * 
 * @param {[string[], string[]]} categories The given categories 
 * @returns {Word[]} The filtered list of words 
 */
export const filterWords = 
    async (categories) => {

        const allWords = await fetchWords();
        const flattenCategories = categories.flat();

        const filteredWords = allWords.filter(word => 
            flattenCategories.includes(word.categorie) 
        );

        return shuffle(filteredWords);
    }

/**
 * Create the answersDict object used to store user answers
 * 
 * @returns {AnswersDict} The freshly created answersDict 
 */
export const createAnswerDict = 
    () => ({
        data: {
            index:0, 
            lastQuestionTime: Date.now() 
        }, 
        answers: {}
    });  

/**
 * Shuffle the list by using Fisher-Yates algorithm 
 * 
 * Complexity : O(n) 
 * 
 * @param {Object[]} list The list to shuffle
 * @returns {Object[]} The shuffled list
 * @see filterWords
 */
const shuffle = 
    (list) => {
        for (let i = list.length - 1 ; i > 0 ; i--){
            const j = Math.floor(Math.random() * (i+1)); 
            [list[i], list[j]] = [list[j], list[i]]; 
        }
        return list;
    }

/**
 * Fetches the database and returns all the words in it 

 * @returns {Promise<Object[]>} The list of Word object 
 * @see filterWords 
 */
const fetchWords = 
    async () => {
        try{
            const response = await fetch('/word', {method:"GET"}); 
            const allWords = await response.json();
            return allWords;
        } catch (error) {
            console.error(`error while fetching words`); 
            return null; 
        }
    }

/**
 * Used instead of "includes()" 
 * 
 * @param {string[]} firstList The first list you want to compare  
 * @param {string[]} secondList The second list 
 * @returns {boolean} True if the two lists are identical, false otherwise 
 */
const sameLists = 
    (firstList, secondList) => {
        return Array.isArray(firstList) && Array.isArray(secondList) &&
            firstList.length === secondList.length &&
            firstList.every(category => secondList.includes(category));
};


/**
 * Fetches the database and return the formulaire with id in parameters
 * 
 * @param {string} testId The id of the formulaire in the database 
 * @returns {Promise<Object>} The formulaire with id given 
 */
export const fetchFormulaire =     
    async (testId) => {
        try {
            const response = await fetch(`/tests/${testId}` , {method:"GET"}); 
            const formulaire = await response.json(); 
            return formulaire; 
        } catch (error) {
            console.error(`error while fetching formulaire with id ${testId}`); 
            return null;
        }
    }


/** TODOOOOOOOOOOOOO
 * Return the pair of categories to be used for the given turn. 
 * 
 * @param {number} currentTurn The current test index. 
 * @returns {[string[],string[]]|null} List of categories.
 * @see Main.play
 */
export const getCategories =
    (formulaire, currentTurn) => {

        const conceptPair = formulaire.pair[0]; 
        const attributePair = formulaire.pair[1]; 

        //I used anonymous function so categorySet won't load before formulaire has been fetched
        const categorySet = {
            0: () => [[attributePair.left], [attributePair.right]],
            1: () => [[conceptPair.left], [conceptPair.right]], 
            2: () => [
                [attributePair.right, conceptPair.left],
                [attributePair.left, conceptPair.right] 
            ],
            3: () => [
                [attributePair.right, conceptPair.right], 
                [attributePair.left, conceptPair.left]
            ]

        };

        const categoryMap = {
            0: {set:0, reverse:false},
            1: {set:1, reverse:false},
            2: {set:2, reverse:false},
            3: {set:2, reverse:false}, 
            4: {set:0, reverse:true}, 
            5: {set:3, reverse:false}, 
            6: {set:3, reverse:false}, 
            7: {set:3, reverse:false}
        };

        const mapping = categoryMap[currentTurn]; 

        const categories = categorySet[mapping.set]();  

        return mapping.reverse ? [categories[1], categories[0]] : categories; 

    }


/**
 * 
 * @param {number} testId The id used to fetch the formulaire 
 * @returns {boolean} True if the 
 */
export const isFirstTestLogic =
    (formulaire) => {

        const leftCongruence =  formulaire.congruence[0]; //e.g. ["Féminin","Lettres"]
        const rightCongruence = formulaire.congruence[1];

        const conceptPair = formulaire.pair[0]; 
        const attributePair = formulaire.pair[1]; 

        /**
         * Cluster indicates a “game” round. 
         * firstMixedCluster therefore refers to the first round where categories are mixed.
         * If 
         */
        const leftSide = [attributePair.right, conceptPair.left];
        const rightSide = [attributePair.left, conceptPair.right]; 

        const isDirectMatch = sameLists(leftSide, leftCongruence) && sameLists(rightSide, rightCongruence);
        const isInverseMatch = sameLists(leftSide, rightCongruence) && sameLists(rightSide, leftCongruence);

        return isDirectMatch || isInverseMatch;
    }


/**
 * Determines which sentence to send based on the user's result (i.e. the dScore)
 * 
 * @param {FinalDict} finalDict Dictionnary used to store user data while he's taking the test (i.e. the dictionnary with all the answersDict)
 * @returns {string|null} The result to display to user at the end of the test
 */
export const returnFinalString = 
    async (finalDict, formulaire) => {
        

        const dScoreDict = await calculateDScore(finalDict,formulaire); 

        const categories =  dScoreDict.isLogicFirst 
            ? getCategories(formulaire,3) 
            : getCategories(formulaire,6);

        const [[attr1, concept1], [attr2, concept2]] = categories;

        let finalString = `Vos données suggèrent<br>`

        const formatMessage = 
            (intensity) => {
            const common = `${intensity} association automatique entre `; 
            return `${common}${attr1} et ${concept1} et entre ${attr2} et ${concept2}`; 
        }

        switch (dScoreDict.bias) {
            case 0: 
                finalString += formatMessage("Aucune");
                return finalString; 
            case 1: 
                finalString += formatMessage("Faible");
                return finalString; 
            case 2: 
                finalString += `Association automatique moyenne entre ${attr1} et ${concept1} et entre ${attr2} et ${concept2}`;
                return finalString; 
            case 3:
                finalString += formatMessage("Forte");
                return finalString; 
            case 4: 
                finalString += `Les erreurs étaient trop nombreuses pour que votre résultat puisse être déterminé.`; 
                return finalString; 
            default: 
                console.error("problem while calculating dScore"); 
                return null;
        }
    }

