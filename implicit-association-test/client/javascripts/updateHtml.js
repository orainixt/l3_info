import { calculateDScore, average } from "./mathematics.js";
import { returnFinalString } from "./utils.js";
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

//#################################################################################################################################
// FUNCTIONS
//#################################################################################################################################


/**
 * Display the home page text 
 * 
 * @returns {void} 
 * @see buildContentText
 */
export const displayHomePage = 
    () => {
        const content = document.getElementById("content-text");
        const homeText = document.createElement("p");
        homeText.innerHTML = buildTurnText(0); 
        content.appendChild(homeText);
    }


/**
 * Return the text displayed between sets according to currentTurn value 
 * 
 * @param {number} currentTurn The current turn of the test
 * @returns {String} The string to display 
 */
export const buildTurnText = 
    (currentTurn) => {

        switch (currentTurn) {
            case 0: 
                return `
                    Mettez vos doigts sur les touches <b>E</b> et <b>I</b> de votre clavier.
                    <br>
                    Des mots appartenant aux catégories indiquées au sommet vont apparaître les uns après les autres au milieu de l'écran.
                    <br>
                    Quand le mot appartient à la partie de gauche, appuyez sur la touche <b>E</b>, et inversement.
                    <br>
                    Chaque objet appartient à <b>une seule</b> catégorie.
                    <br> 
                    Si vous faites une erreur, un ❌ apparaîtra et il vous faudra corriger votre erreur en pressant l'autre touche.
                    <br><br>
                    <b>Allez aussi vite que possible</b> tout en faisant le moins d'erreurs possible.
                    <br>
                    Si vous allez trop lentement ou faites trop d'erreurs, cela produira un score inutilisable.
                    <br><br>
                    <b>Appuyez sur la barre espace pour commencer.</b>
                    `;
            case 1: 
                return `
                    <b>Faites attention aux nouvelles catégories ci-dessus !</b> Les objets à classer ont également changés.
                    <br><br>
                    Quand le mot appartient à la partie de gauche, appuyez sur la touche <b>E</b>, et inversement.
                    <br>
                    Chaque objet appartient à <b>une seule</b> catégorie.
                    <br> 
                    Si vous faites une erreur, un ❌ apparaîtra et il vous faudra corriger votre erreur en pressant l'autre touche.
                    <br><br>
                    <b>Allez aussi vite que possible</b> tout en faisant le moins d'erreurs possible.
                    <br>
                    Si vous allez trop lentement ou faites trop d'erreurs, cela produira un score inutilisable.
                    <br>
                    <b>Appuyez sur la barre espace pour continuer.</b>
                `;
            case 2: 
                return `
                    <b>Encore une fois !</b> Les quatres catégories que vous venez de rencontrer sont maintenant affichées par paires.
                    <br><br>
                    Quand le mot appartient à la partie de gauche, appuyez sur la touche <b>E</b>, et inversement.
                    <br>
                    Chaque objet appartient à <b>une seule</b> catégorie.
                    <br> 
                    Chaque mot appartient <b>seulement à UN groupe</b>
                    <br>
                    Si vous faites une erreur, un ❌ apparaîtra et il vous faudra corriger votre erreur en pressant l'autre touche.
                    <br><br>
                    <b>Appuyez sur la barre espace pour continuer.</b>
                `;
            case 3: 
                return `
                    <b>Classez de nouveau les mots dans les 4 mêmes catégories</b> en appuyant sur <b>E</b> ou <b>I</b>.
                    <br><br>
                    Chaque objet appartient à <b>une seule</b> catégorie.
                    <br> 
                    Si vous faites une erreur, un ❌ apparaîtra et il vous faudra corriger votre erreur en pressant l'autre touche.
                    <br><br>
                    <b>Appuyez sur la barre espace pour continuer.</b>
                `;
            case 4: 
                return `
                    Regardez les catégories, <b>il n'y en a plus que 2 et leurs positions ont changé!</b>
                    <br>
                    De plus, le concept qui était à gauche au départ est maintenant à droite, et vice-versa. 
                    <br><br>
                    Quand le mot appartient à la partie de gauche, appuyez sur la touche <b>E</b>, et inversement.
                    <br>
                    Chaque objet appartient à <b>une seule</b> catégorie.
                    <br> 
                    Si vous faites une erreur, un ❌ apparaîtra et il vous faudra corriger votre erreur en pressant l'autre touche.
                    <br><br>
                    <b>Appuyez sur la barre espace pour continuer.</b>
                `;
            case 5: 
                return `
                    Regardez les catégories, <b>elles apparaissent de nouveau ensemble!</b>
                    <br><br>
                    Quand le mot appartient à la partie de gauche, appuyez sur la touche <b>E</b>, et inversement.
                    <br>
                    Chaque objet appartient à <b>une seule</b> catégorie.
                    <br> 
                    Si vous faites une erreur, un ❌ apparaîtra et il vous faudra corriger votre erreur en pressant l'autre touche.
                    <br><br>
                    <b>Appuyez sur la barre espace pour continuer.</b>
                `;
            case 6: 
                return `
                    <b>Classez à nouveau les 4 mêmes catégories</b>
                    Quand le mot appartient à la partie de gauche, appuyez sur la touche <b>E</b>, et inversement.
                    <br>
                    Chaque objet appartient à <b>une seule</b> catégorie.
                    <br> 
                    Si vous faites une erreur, un ❌ apparaîtra et il vous faudra corriger votre erreur en pressant l'autre touche.
                    <br><br>
                    <b>Appuyez sur la barre espace pour continuer.</b>
                `;
            case 7: 
                return `
                    <b>Bravo</b> vous avez terminé le test ! 
                    <br> 
                    L'intérpretation de vos résultats est disponible en appuyant sur la barre <b>espace</b>. 
                `;
        }

    }

/**
 * Display string parameter into the "content" div HTML 
 * 
 * If one more HTML text object is created, might consider to merge those functions {@link replaceContentText}
 * 
 * @param {String} newString The string to display   
 */
export const replaceContent = 
    (newString) => {
        document.getElementById("content").innerHTML = newString;
    }



/**
 * Display string parameter into the "content-text" div HTML 
 *
 * If one more HTML text object is created, might consider to merge those functions {@link replaceContent}
 * 
 * @param {String} newString The string to display   
 */
export const replaceContentText =  
    (newString) => {
        document.getElementById("content-text").innerHTML = newString;
    }


/**
 * @deprecated This function is for debugging only and should not be used in production
 * 
 * Display the answers dictionairy into "answer-dict-display" HTML div
 * 
 * @param {AnswersDict} answersDict The dictionary to display 
 * @returns {void}
 */
export const updateAnswersDictionnaireDisplay = 
    (answersDict) => {
        const display = document.getElementById("answers-dict-display"); 
        display.innerHTML = JSON.stringify(answersDict,null,2);
    }
    

/**
 * Display each category on either the left or the right.
 * 
 * @param {String[]} leftCategories 
 * @param {String[]} rightCategories 
 * @returns {void}
 */
export const updateHtmlCategories = 
    (leftCategories, rightCategories) => {

        const left = document.getElementById("left-screen");
        const right = document.getElementById("right-screen");

        left.innerHTML = ""; 
        right.innerHTML = ""; 

        // THIS IS USEFUL ONLY IF LCAT & RCAT ARE LISTS
        leftCategories.forEach(categorie => {
            const pElement = document.createElement('p');
            pElement.textContent = categorie;
            left.appendChild(pElement); 
        });

        rightCategories.forEach(categorie => {
            const pElement = document.createElement('p'); 
            pElement.textContent = categorie; 
            right.appendChild(pElement); 
        }); 
    }


/**
 * Display the test result based on the finalDict dictionary. 
 * 
 * @param {FinalDict} finalDict Dictionnary used to store user data while he's taking the test (i.e. the dictionnary with all the answersDict)
 * @param {[string[],string[]]} categories List of categories 
 * @param {string} testId The id used to fetch formulaire from database
 * @returns {void}
 * @see 'mathematics.js' For all the function used to calculate the final string
 */
export const displayBias = 
    async (finalDict,categories,formulaire) => {

    document.getElementById("app-canvas").hidden = true;
    document.getElementById("bias-canvas").hidden = false;

    document.getElementById("explain-bias").innerHTML = biasExplanation(categories);

    try {
        const biasHtml = await returnFinalString(finalDict, formulaire);
        document.getElementById("bias-display").innerHTML = biasHtml;
    } catch (e) {
        console.error("Erreur lors de l'affichage du bias :", e);
        document.getElementById("bias-display").innerHTML =
            "<p>Impossible d'afficher les résultats pour le moment.</p>";
    }

    const reactionTimes = Object.values(finalDict)
        .flatMap(clusterDict =>
            Object.values(clusterDict.answers)
                .map(answer => answer.deltaTime)
                .filter(t => t != null)
        );

    let resultString;
    try {
        const score = await calculateDScore(finalDict, formulaire);
        resultString = ParseResult(score);
    } catch (e) {
        console.error("Erreur lors du calcul du d-score :", e);
        resultString = "Erreur de calcul";
    }

    sendIatResult(resultString, Math.round(average(reactionTimes)));
    }


/**
 * Add the test result to the user's data in the database 
 * 
 * @param {number} score The result of the test (i.e. the dScore) 
 * @param {*} reactionTimes List with all the time
 * @returns {void}
 */
async function sendIatResult(score, reactionTimes) {
  try {
    const id = localStorage.getItem('formId');
    if (!id) throw new Error('Formulaire non identifié');

    const res = await fetch(`/user/iat/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, reactionTimes })
    });
    if (!res.ok) console.error('Erreur IAT:', res.status);
    else console.log('IAT enregistré');
  } catch (e) {
    console.error('sendIatResult error', e);
  }
}

/**
 * Return the wanted string to display on graphs 
 * 
 * @param {number} result The result of the test (i.e. the dScore) 
 * @returns {string} The string to use in graphics 
 */
function ParseResult(result){
    switch(result.bias){
        case 0 : return 'aucune association';
        case 1 : return 'faible association';
        case 2 : return 'moyenne association';
        case 3 : return 'forte association';
        case 4 : return "trop d'erreur";
        default : return "probleme";
    }
}


/**
 * Return an explanation text about the test results.  
 * 
 * @param {[string[],string[]]} categories 
 * @returns {string} The string to display.
 * @see displayBias
 */
const biasExplanation =    
    (categories) => {
        let preferedCategory1 = categories[0][0];
        let preferedCategory2 = categories[0][1];
        let otherCategory1 = categories[1][0];
        let otherCategory2 = categories[1][1];
        return `
            L'interprétation indique une association automatique entre ${preferedCategory1} et ${preferedCategory2} 
            si vous avez répondu plus rapidement quand les mots de ${preferedCategory1} et de ${preferedCategory2} étaient associés
            que quand les mots de ${otherCategory1} et ${otherCategory2} étaient associés. 
            <br>
            Selon l'amplitude de votre résultat, votre préférence automatique peut être décrite comme <b>légère</b>, <b>moyenne</b>, <b>forte</b> ou <b>pas de préferences</b>
            Il se peut également que vous ayez le résultat <b>Trop d'erreurs pour déterminer un résultat</b>
        `;  
    }