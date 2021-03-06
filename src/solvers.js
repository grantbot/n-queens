/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n) {
  //We can represent the placement of N rooks on a board with a single array
  //of length N, where i refers to the column index and array[i] refers to the
  //row index of each placed rook. So [0,0,0] corresponds to a 3x3 board with 3
  //rooks all in the first row. Notice how this inherently handles column conflicts;
  //We can't have two numbers at the same spot in an array. Row conflicts are handled by checking if row
  //indices already exist anywhere in the array. Thus, the set of all possible placements of N rooks on
  //an NxN board such that none attack each other can be expressed as the set of all permutations
  //of the numbers 0 through N in an array of length N. We've just made a permutation generator.
  var board = new Board({n: n});
  var solutions = undefined;

  var findSolution = function(solutionArray) {
    if (solutionArray.length === n) {
      solutions = solutionArray;
      return;
      //We only want to keep looking if we haven't already found a solution
    } else if (solutions === undefined) {
      //For all numbers in range n
      for (var i = 0; i < n; i ++) {
        //If our solution array doesn't have i, that means no rooks
        //have been place in the ith row. So put a rook there and
        //make the recursive call
        if (solutionArray.indexOf(i) === -1) {
           findSolution(solutionArray.concat(i));
        }
      }
    }
  };

  findSolution([]);

  for (var i = 0; i < solutions.length; i++) {
    board.togglePiece(solutions[i], i);
  }

  return board.rows();


};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
//Basically a permutation generator
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;

  var findSolution = function(solutionArray) {
    if (solutionArray.length === n) {
      solutionCount ++;
    }
    for (var i = 0; i < n; i ++) {
      if (solutionArray.indexOf(i) === -1) {
         findSolution(solutionArray.concat(i));
      }
    }
  };

  findSolution([]);

  return solutionCount;
};


// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({n: n});
  var solutions = undefined;

  var findSolution = function(solutionArray) {
    if (solutionArray.length === n) {
      solutions = solutionArray;
    }  else if (solutions === undefined) {
      for (var i = 0; i < n; i ++) {
        if (solutionArray.indexOf(i) === -1) {
          if(solutionArray.length > 0){
            var passed = 0;

            for (var j = 0; j < solutionArray.length; j++) {
              if ((solutionArray[j] - j !== i - solutionArray.length) &&
                  (solutionArray[j] + j !== i + solutionArray.length)) {
                  passed++;
              }
            }

            if(passed === solutionArray.length) {
                findSolution(solutionArray.concat(i));
            }
          } else {
              findSolution(solutionArray.concat(i));
          }
        }
      }
    }
  };

  findSolution([]);

  if (solutions !== undefined) {
    for (var i = 0; i < solutions.length; i++) {
      board.togglePiece(solutions[i], i);
    }
  }

  return board.rows();
};


// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  //Checks row/col conflicts in the same way that NRooks does it; refer there
  var solutionCount = 0;

  var findSolution = function(solutionArray) {
    //If we successfully place n queens in the solution array, then increment counter
    if (solutionArray.length === n) {
      solutionCount ++;
    }
    //For all possible row indices...
    for (var i = 0; i < n; i ++) {
      //Check if we've place a queen at that row. If not...
      if (solutionArray.indexOf(i) === -1) {

        //Handle case where we're placing the first queen. Otherwise solutionArray.length
        //below would be 0 and we'd never enter that block.
        if(solutionArray.length > 0){
          var passed = 0;

          //For every queen we've already placed, check to see if our new potential placement
          //creates diagonal conflicts.
          //We use a 'passed' iterator to make sure we check diag conflicts with ALL
          //queens in the current solutionArray, not just the first queen.
          for (var j = 0; j < solutionArray.length; j++) {
            if ((solutionArray[j] - j !== i - solutionArray.length) &&
                (solutionArray[j] + j !== i + solutionArray.length)) {
                passed++;
            }
          }

          //If all diagonal checks passed for all currently placed queens, then
          //add one at the ith row in the next column and make the recursive call
          if(passed === solutionArray.length) {
              findSolution(solutionArray.concat(i));
          }
          //If we haven't placed a queen yet, then put one down
        } else {
            findSolution(solutionArray.concat(i));
        }

      }
    }
  };

  findSolution([]);

  return solutionCount;
};

window.bitNQueens = function(n) {
  //Start from the bottom row, places a queen, and uses bitstrings to represent
  //all the attacked squares on the above row to narrow down legal moves, places another
  //queen, and so forth until it places n queens at which point it counts that solution.
  var solution_count = 0;
  //Same as doing limit = Math.pow(2,n) - 1. Represents a bit string of length
  //n with all 1's
  var limit = (1<<n) - 1;

  var findSolutions = function (colThreat, majDiagThreat, minDiagThreat) {
    //refer to http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.51.7113&rep=rep1&type=pdf
    //DiagThreats represent cells on a row that are attacked from maj and min diags. Colthreat
    //represents cells attacked from columns (below), or columns that already contain queens.
    //
    //Combine attacked cells together per row into one bitstring
    var attackedCells = colThreat | majDiagThreat | minDiagThreat;
    //Invert it to find all legal moves in the row
    var openCells = ~(attackedCells) & limit;

    //If we have as many queens as the limit (just represented in bitstrings), iterate count
    if (colThreat === limit) {
      solution_count ++;
    }

    //Otherwise, as long as we still have legal moves in this row...
    while (openCells > 0) {
      //Extract right-most bit
      var rightMostLegalMove = openCells & (-openCells);

      //Take that bit off of openCells
      openCells = openCells & (openCells - 1);

      //Use that legal move to update attacked cells
      //Note we had to declare new variables here; modifying the old ones
      //as new versions of themselves didn't work for some reason.
      var newColThreat = (colThreat | rightMostLegalMove);
      var newMajDiagThreat = ((majDiagThreat | rightMostLegalMove) << 1);
      var newMinDiagThreat = ((minDiagThreat | rightMostLegalMove) >> 1);

      //And pass that new info to the recursive call
      findSolutions(newColThreat, newMajDiagThreat, newMinDiagThreat);
    }


  }

  //Call it with 0 queens and no threatened squares.
  findSolutions(0,0,0);
  return solution_count;

};
