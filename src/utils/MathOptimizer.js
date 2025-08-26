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
      const mathPattern = /(\d+|\w+)\s*(\+|-|\*|\/|\bplus\b|\bminus\b|\btimes\b|\bdivided\b|\bto\s+the\s+power\s+of\b|\^)\s*(\d+|\w+)/i;
      return mathPattern.test(userInput);
    }
  
    convertWordsToNumbers(userInput) {
      for (const [word, number] of Object.entries(this.wordToNumber)) {
        userInput = userInput.replace(new RegExp(`\\b${word}\\b`, 'gi'), number);
      }
      return userInput;
    }
  
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
      
      // Only allow numbers, basic operators, parentheses, and decimal points
      if (!/^[\d+\-*/().]+$/.test(cleanExpression)) {
        throw new Error("Invalid characters in expression");
      }

      // Parse and evaluate the expression safely
      try {
        // Use Function constructor instead of eval for better security
        const func = new Function('return (' + cleanExpression + ')');
        const result = func();
        
        // Validate the result is a finite number
        if (!Number.isFinite(result)) {
          throw new Error("Result is not a valid number");
        }
        
        return result;
      } catch (evaluationError) {
        // Re-throw with a more specific error message
        throw new Error(`Invalid mathematical expression: ${evaluationError.message}`);
      }
    }
  }
  
  export default MathOptimizer;