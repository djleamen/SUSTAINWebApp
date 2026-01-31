/**
 * MathOptimizer Module
 * Provides functionalities to recognize, parse, and solve mathematical expressions
 * given in natural language or symbolic form.
 * 
 * Author: SUSTAIN Development Team
 * Last Modified: Jan 2026
 */

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
  
    cleanInput(userInput) {
      /**
       * Cleans the user input by removing polite phrases and unwanted characters.
       * 
       * @param {string} userInput - The raw user input string.
       * @returns {string} The cleaned user input string.
       */
      userInput = userInput.replace(/^(what is|what's|whats|please|can you|please tell me)\s*/i, '');
      userInput = userInput.replace(/[^\w\s+\-*/^()]/g, '');
      userInput = userInput.replace(/\s+/g, ' ').trim();
      return userInput;
    }
  
  recognizeMath(userInput) {
    // Recognizes if the user input contains a mathematical expression
    const mathPattern = /(?:\d+|\w+)[ \t]{0,10}(?:\+|-|\*|\/|\bplus\b|\bminus\b|\btimes\b|\bdivided\b|\bto\s+the\s+power\s+of\b|\^)[ \t]{0,10}(?:\d+|\w+)/i;
    return mathPattern.test(userInput);
  }

  convertWordsToNumbers(userInput) {
      /**
       * Converts word-based numbers in the user input to their numeric equivalents.
       * 
       * @param {string} userInput - The user input string with word-based numbers.
       * @returns {string} The user input string with numeric values.
       */
      for (const [word, number] of Object.entries(this.wordToNumber)) {
        userInput = userInput.replaceAll(new RegExp(String.raw`\b${word}\b`, 'gi'), number);
      }
      return userInput;
    }
  
    convertOps(userInput) {
      /**
       * Converts word-based operators in the user input to their symbolic equivalents.
       * 
       * @param {string} userInput - The user input string with word-based operators.
       * @returns {string} The user input string with symbolic operators.
       */
      for (const [word, operator] of Object.entries(this.wordToOperator)) {
        if (word !== 'to the power of' && word !== '^') {
          userInput = userInput.replaceAll(new RegExp(String.raw`\b${word}\b`, 'gi'), operator);
        }
      }
      // Convert power operators last
      userInput = userInput.replaceAll(/\bto the power of\b/gi, '**');
      userInput = userInput.replaceAll('^', '**');
      return userInput;
    }
  
    solveMath(userInput) {
      /**
       * Solves the mathematical expression contained in the user input.
       * 
       * @param {string} userInput - The user input string containing a math expression.
       * @returns {number|string} The result of the computation or an error message.
       */
      userInput = this.cleanInput(userInput);
      userInput = this.convertWordsToNumbers(userInput);
      userInput = this.convertOps(userInput);
  
      try {
        const result = this.safeMathEval(userInput);
        return result;
      } catch (error) {
        return `Error: ${error.message}`;
      }
    }

    safeMathEval(expression) {
      /**
       * Safely evaluates a mathematical expression.
       * 
       * @param {string} expression - The mathematical expression to evaluate.
       * @returns {number} The result of the evaluated expression.
       * @throws Will throw an error if the expression contains invalid characters or patterns.
       */
      // Remove all spaces and validate the expression contains only allowed characters
      const cleanExpression = expression.replace(/\s/g, '');
      
      // Strict validation: only allow digits, operators, parentheses, and decimal points
      // Ensure no consecutive operators (except for negative numbers)
      if (!/^[\d+\-*/().]+$/.test(cleanExpression)) {
        throw new Error("Invalid characters in expression");
      }

      // Additional security checks to prevent code injection attempts
      const dangerousPatterns = [
        /constructor/i,
        /__proto__/i,
        /prototype/i,
        /function/i,
        /=>/,
        /\[/,
        /\]/,
        /\{/,
        /\}/,
        /;/,
        /,/,
        /\\x/,
        /\\u/
      ];

      for (const pattern of dangerousPatterns) {
        if (pattern.test(cleanExpression)) {
          throw new Error("Expression contains potentially dangerous patterns");
        }
      }

      // Validate balanced parentheses
      let parenCount = 0;
      for (const char of cleanExpression) {
        if (char === '(') parenCount++;
        if (char === ')') parenCount--;
        if (parenCount < 0) {
          throw new Error("Unbalanced parentheses");
        }
      }
      if (parenCount !== 0) {
        throw new Error("Unbalanced parentheses");
      }

      // Parse and evaluate the expression safely
      try {
        // Create a sandboxed function with no access to global scope
        // Use strict mode and immediately invoked function to limit scope
        const func = new Function('"use strict"; return (' + cleanExpression + ')');
        const result = func();
        
        // Validate the result is a finite number
        if (!Number.isFinite(result)) {
          throw new TypeError("Result is not a valid number");
        }
        
        return result;
      } catch (evaluationError) {
        // Re-throw with a more specific error message
        throw new Error(`Invalid mathematical expression: ${evaluationError.message}`);
      }
    }
  }
  
  export default MathOptimizer;
  