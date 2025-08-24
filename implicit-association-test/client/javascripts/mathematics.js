import { isFirstTestLogic } from "./utils.js";
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

//#############################################################################################################################################################################
// MATHEMATICS USED IN THE MAIN PROGRAM
// CALCULATE DSCORE
//#############################################################################################################################################################################
/**
 * Returns the list, extracting the times 
 * 
 * @param {Object} cluster Each cluster has the test round data (i.e each cluster's an answersDict) 
 * @returns {number[]} The list with all the times of a round
 */ 
const getTimeList =
    (cluster) => {
        return Object.values(cluster.answers)
            .filter(data => data && data.deltaTime !== null)
            .map(mot => mot.deltaTime); 
    }

/**
 * Return the concatened lists from clusters 3 & 4 and clusters 6 & 7 (i.e. The rounds where user have all 4 categories)
 * 
 * @param {Object} finalDict Dictionnary used to store user data while he's taking the test (i.e. the dictionnary with all the answersDict)
 * @returns {[number[],number[]]} 2 lists : One for each test with 2 categories (basically one's about pleasent categories & the other's unpleasant)
 */
const getNeededTimeList = 
    (finalDict) => {
        const firstTimeList = [
            ...getTimeList(finalDict.thirdCluster), 
            ...getTimeList(finalDict.fourthCluster)
        ]; 
        const secondTimeList = [
            ...getTimeList(finalDict.sixthCluster), 
            ...getTimeList(finalDict.seventhCluster)
        ]; 

        return [firstTimeList,secondTimeList];
    }
/**
 * Calculates the average of a number list.
 * 
 * @param {number[]} list The list whose average is to be calculated
 * @returns {int} The average of the list 
 * @see pooledStandardDeviation
 */ 
export const average =
    (list) => {
        let sum = 0 
        list.forEach(value => {
            sum += value; 
        })
        return (sum / list.length);
    }

/**
 * Calculate pooled standard deviation for 2 time sets.   
 * 
 * Formula : sqrt(E(y - y(average)²)/n-1)
 * 
 * @param {Object} finalDict - Dictionnary used to store user data while he's taking the test (i.e the dictionnary with all the answersDict)
 * @returns {Object} Dictionnary with 3 fields :   
 * - pooledStandardDeviation : The pooled standard deviation   
 * - pleasantAverage : The average time for pleasant congruences    
 * - unpleasantAverage : The average time for unpleasant congruences   
 */

const pooledStandardDeviation = 
    (finalDict) => {

        const [firstSet,secondSet] = getNeededTimeList(finalDict); 
        const [firstLength,secondLength] = [firstSet.length, secondSet.length];

        if (!checkIfAnswerAreValids(firstSet) || !checkIfAnswerAreValids(secondSet)) {
            return null;
        }

        //firstLength should be equal to secondLength but it's preferable to check it, isnt it??

        const firstAverage = average(firstSet); 
        const secondAverage = average(secondSet);  

        const firstVariance = firstSet.reduce( (acc,time) => acc + (time - firstAverage) ** 2, 0) / (firstLength - 1); 
        const secondVariance = secondSet.reduce( (acc, time) => acc + (time - secondAverage) ** 2, 0) / (secondLength - 1);
        
        //we use the full pooled standard deviation formula because pleasantLength and unpleasantLength may differ.  
        //if the sample sizes are equal, the (n-1) terms will naturally cancel out tho

        if (firstLength + secondLength - 2 === 0){
            console.error(`division by 0 :\nfirst set length = ${firstLength}\nsecond set length = ${secondAverage}`); 
        }

        const pooledVariance = ((firstLength - 1) * firstVariance + (secondLength - 1) * secondVariance) / (firstLength + secondLength - 2); 

        return {
            pooledStandardDeviation: Math.sqrt(pooledVariance),
            firstAverage: firstAverage,
            secondAverage: secondAverage
        };
    }

/** 
 * dScore is used in IAT to calculate bias intensity  
 * 
 * dScore > .65 => higly biased  
 * .65 > dScore > .35 => moderately biased  
 * .35 > dScore > .15 => slightly biased
 * .15 > dScore > -.15 => no bias  
 * 
 * We use the absolute value, because if the user associates illogical congruences better, the dScore becomes negative
 * 
 * @param {Object} finalDict - the dictionary containing the user's results
 * @returns {number} Number based on bias intensity: 0 for no bias and 3 for highly biased 
 */
export const calculateDScore =
    async (finalDict,formulaire) => {

        const pooled = pooledStandardDeviation(finalDict);
        const isLogicFirst = await isFirstTestLogic(formulaire); 

        const dScoreDict = {
            bias: null, 
            isLogicFirst: isLogicFirst
        }; 

        if (!pooled) {
            dScoreDict.bias = 4; 
            dScoreDict.valid = false; 
            return dScoreDict;
        }

        const [logicAverage, illogicAverage] = isLogicFirst 
            ? [pooled.firstAverage,pooled.secondAverage] 
            : [pooled.secondAverage,pooled.firstAverage];

        const dScore = (illogicAverage - logicAverage) / pooled.pooledStandardDeviation; 

        dScoreDict.bias = getBiasScore(dScore);
        return dScoreDict;
    }
/**
 * Return an integer according to the dScore
 * 
 * @param {number} dScore - the dScore of the user 
 * @returns {number} Number between 0 and 3 included : 0 if no bias, 3 if highly bias 
 */
const getBiasScore = 
    (dScore) => {
        const abs = Math.abs(dScore);
        if (abs <= 0.15) return 0; 
        else if (abs <= 0.35) return 1; 
        else if (abs <= 0.65) return 2; 
        return 3; 
    }

/**
 * After taking the test, if the user has 10% of his answer equals to 300 ms, his answers aren't usable  
 * 
 * Word time's already rounded to 300, that's why it checks if times equals to 300 instead of <= 300 
 * 
 * @param {number[]} timeList List of congruence tenses
 * @returns {boolean} True if the list is valid, false otherwise
 */
const checkIfAnswerAreValids =
    (timeList) => {
        const tooFast = timeList.filter(time => time === 300); 
        if ((tooFast.length / timeList.length) > 0.1) {
            return false; 
        } 
        return true; 
    }
