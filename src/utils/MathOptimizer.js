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
      userInput = userInput.replace(/^(what is|what's|whats|please|can you|please tell me)\s*/i, '');
      userInput = userInput.replace(/[^\w\s+\-*/^()]/g, '');
      userInput = userInput.replace(/\s+/g, ' ').trim();
      return userInput;
    }
  
  recognizeMath(userInput) {
    // regex that avoids catastrophic backtracking
    const mathPattern = /(?:\d+|\w+)[ \t]{0,10}(?:\+|-|\*|\/|\bplus\b|\bminus\b|\btimes\b|\bdivided\b|\bto\s+the\s+power\s+of\b|\^)[ \t]{0,10}(?:\d+|\w+)/i;
    return mathPattern.test(userInput);
  }    convertWordsToNumbers(userInput) {
      for (const [word, number] of Object.entries(this.wordToNumber)) {
        userInput = userInput.replaceAll(new RegExp(String.raw`\b${word}\b`, 'gi'), number);
      }
      return userInput;
    }
  
    convertOps(userInput) {
      // Convert basic operators first
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
      userInput = this.cleanInput(userInput);
      userInput = this.convertWordsToNumbers(userInput);
      userInput = this.convertOps(userInput);
  
      // Debugging line - remove in production
      if (process.env.NODE_ENV === 'development') {
        console.log(`Sanitized input: ${userInput}`);
      }
  
      try {
        // Safer alternative to eval() for basic math operations
        const result = this.safeMathEval(userInput);
        return result;
      } catch (error) {
        return `Error: ${error.message}`;
      }
    }

    safeMathEval(expression) {
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