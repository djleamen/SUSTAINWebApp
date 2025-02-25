/* Description: This file contains the MathOptimizer class, which is a utility class that helps optimize math expressions. */

// MathOptimizer class definition
class MathOptimizer {
    constructor() {
      this.wordToOperator = {
        'plus': '+',
        'minus': '-',
        'times': '*',
        'multiplied by': '*',
        'x': '*',
        'X': '*',
        'divided by': '/',
        'over': '/',
        'to the power of': '**',
        '^': '**'
      };
  
      // Word to number conversion
      this.wordToNumber = {
        'zero': 0,
        'one': 1,
        'two': 2,
        'three': 3,
        'four': 4,
        'five': 5,
        'six': 6,
        'seven': 7,
        'eight': 8,
        'nine': 9,
        'ten': 10
      };
    }
  
    // Function to clean the input
    cleanInput(userInput) {
      userInput = userInput.replace(/^(what is|what's|whats|please|can you|please tell me)\s*/i, '');
      userInput = userInput.replace(/[^\w\s+\-*/^()]/g, '');
      userInput = userInput.replace(/\s+/g, ' ').trim();
      return userInput;
    }
  
    // Function to recognize math expressions
    recognizeMath(userInput) {
      const mathPattern = /(\d+|\w+)\s*(\+|\-|\*|\/|\bplus\b|\bminus\b|\btimes\b|\bdivided\b|\bto\s+the\s+power\s+of\b|\^)\s*(\d+|\w+)/i;
      return mathPattern.test(userInput);
    }
  
    // Function to convert words to numbers
    convertWordsToNumbers(userInput) {
      for (const [word, number] of Object.entries(this.wordToNumber)) {
        userInput = userInput.replace(new RegExp(`\\b${word}\\b`, 'gi'), number);
      }
      return userInput;
    }
    
    // Function to convert operators
    convertOps(userInput) {
      // Convert basic operators first
      for (const [word, operator] of Object.entries(this.wordToOperator)) {
        if (word !== 'to the power of' && word !== '^') {
          userInput = userInput.replace(new RegExp(`\\b${word}\\b`, 'gi'), operator);
        }
      }
      // Convert power operators last
      userInput = userInput.replace(/\bto the power of\b/gi, '**');
      userInput = userInput.replace(/\^/g, '**');
      return userInput;
    }
  
    // Function to optimize math expressions
    solveMath(userInput) {
      userInput = this.cleanInput(userInput);
      userInput = this.convertWordsToNumbers(userInput);
      userInput = this.convertOps(userInput);
    // debug line
      console.log(`Sanitized input: ${userInput}`); // Debugging line
  
      // Evaluate the math expression
      try {
        if (/^[\d+\-*/(). ]+$/.test(userInput)) {
          const result = eval(userInput);
          return result;
        } else {
          return "Error: Invalid math expression";
        }
      } catch (error) {
        return `Error: ${error.message}`;
      }
    }
  }
  
  export default MathOptimizer;