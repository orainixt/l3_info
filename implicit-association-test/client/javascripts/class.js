import { 
    getCategories,
    filterWords,
    createAnswerDict
} from './utils.js';

export class UserAnswer {

    #filteredWords = []; 
    #answersDict = {}; 
    #categories = []; 
    #formId = "";

    constructor(filteredWords = [], answersDict = {}, categories = [], formId = "") {
        this.#filteredWords = filteredWords;
        this.#answersDict = answersDict;
        this.#categories = categories;
        this.#formId = formId;
    }

    // GETTERS AND SETTERS
    set filteredWords(words) {
        this.#filteredWords = words;
    }

    get filteredWords() {
        return this.#filteredWords;
    }

    set answersDict(dict) {
        this.#answersDict = dict;
    }

    get answersDict() {
        return this.#answersDict;
    }

    set categories(categories) {
        this.#categories = categories;
    }

    get categories() {
        return this.#categories;
    }

    // set formId(formId) {
    //     this.#formId = formId; 
    // }

    // get formId() {
    //     return this.#formId;
    // }

    /**
     * create a new dictionnaire to store user answers 
     * uses {@link createAnswerDict} 
     */
    createDict() {
        this.#answersDict = createAnswerDict();
    }

    /**
     * create a random list of word belongig to categories 
     * uses {@link filterWords}
     */
    async filterWords() {
        this.#filteredWords = await filterWords(this.#categories);
    }

    /**
     * fetch categories for a specific turn 
     * uses {@link getCategories}
     * @param {number} currentTurn the current turn of the test  
     */
    updateCategories(formulaire,currentTurn) {
        try {
            this.#categories = getCategories(formulaire,currentTurn); 
        } catch (error) {
            console.error("error while updating categories in user class");
        }
        
    }
}