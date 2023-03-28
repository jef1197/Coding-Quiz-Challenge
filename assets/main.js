// All sections variables
var intro = document.getElementById('intro-section');
var questionSection = document.getElementById('question');
var leaderboardSection = document.getElementById('leaderboard');
var endScreen = document.getElementById('end-screen');
var feedbackSection = document.getElementById('feedback')
var container = document.getElementById('leaderboard-container');

// All buttons vairable
var startBtn = document.getElementById('start-btn');
var submitScoreBtn = document.getElementById('submit-score');
var viewScoreBtn = document.getElementById('view-leaderboard');
var goBackBtn = document.getElementById('go-back');
var intialsInput = document.getElementById('intials')
var clearBtn = document.getElementById('clear');

// Variables for timer and game end
var timer = document.getElementById('timer');
var count = 70;
var end = false;

// questions list. Holds the questions, option and answer in a object
var quizQuestion = [
  {
    question: 'question 1aaa',
    answer: 'Option 1',
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    picked: false
  },
  {
    question: 'question 2',
    answer: 'Option 1',
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    picked: false
  },
  {
    question: 'question 3',
    answer: 'Option 1',
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    picked: false
  },
  {
    question: 'question 4',
    answer: 'Option 1',
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    picked: false
  },
]

// Local Storage for Leaderboards
var leaderboard
var str = localStorage.getItem('leaderboard');
const parsedArray = JSON.parse(str);
// sets the local array 
if (parsedArray) {
  leaderboard = parsedArray;
} else {
  leaderboard = [];
}

// Start the game loop
function startQuiz() {
  intro.classList.add('hidden');
  resetGame();
  startTimer();
  pickQuestion();
}

// Starts the game timer and ends game if timer hits 0
function startTimer() {
  var timerCounter = setInterval(function(){
    count --;
    timer.textContent = count;
    // ends game if you run out of time
    if (count === 0) {
      endGame();
      clearInterval(timerCounter);
    }
    // Clears the timeout once all questions have been answered
    if (end) {
      clearInterval(timerCounter);
    }
  }, 1000)
}

// Renders the next Quiz question
function renderNextQuestion(question) {
  var liList = questionSection.children[1].children;
  questionSection.children[0].textContent = question.question;
  questionSection.children[1].dataset.answer = question.answer;
  for (var i = 0; i < liList.length; i++) {
    liList[i].children[0].textContent = question.options[i];
  }
  // lets quiz know the question has been picked
  question.picked = true;
}

// If questions is picked, it will pick a different question
function pickQuestion() {
  questionSection.classList.remove('hidden');
  for (var i = 0; i < quizQuestion.length; i++) {
    // renders questions if it hasnt been picked yet
    if(!quizQuestion[i].picked) {
      return renderNextQuestion(quizQuestion[i]);
    }
  }
  // If all questions have been picked end the game
  endGame();
}

// Checks if questions is correct
function checkQuestion(e) {
  // target elemts only with class name options
  var option = e.target;
  if(option.className === 'options'){
    var userPicked = option.textContent;
    var answer = option.parentNode.parentNode.dataset.answer
    if (userPicked === answer) {
      renderFeedback(true);
      pickQuestion();
    } else {
      count -= 10;
      renderFeedback(false);
      pickQuestion();
    }
  }
}

function renderFeedback(check) {
  if (check) {
    feedbackSection.children[0].textContent = 'Correct!';
  } else {
    feedbackSection.children[0].textContent = 'Wrong!';
  }
  feedbackSection.classList.remove('hidden');
  var timerCounter = setTimeout(function() {
    feedbackSection.classList.add('hidden');
    clearTimeout(timerCounter)
  }, 1000)
}

// Save Score
function saveScore() {
  var newScore = {'name': intialsInput.value, 'score': count}
  leaderboard.push(newScore);
  const jsonArray = JSON.stringify(leaderboard);
  localStorage.setItem('leaderboard', jsonArray);
  // Sort the array by score
  leaderboard.sort(function(a, b) {
    var score1 = (a.score)
    var score2 = (b.score);
    if (score1 < score2) {
      return 1;
    } else if (score1 > score2) {
      return -1;
    } else {
      return 0;
    }
  });  
  showLeaderboard()
}

// Displays leaderboards
function showLeaderboard(){
  endScreen.classList.add('hidden');
  intro.classList.add('hidden');
  questionSection.classList.add('hidden');
  leaderboardSection.classList.remove('hidden');
  end = true;
  // resets the leaderboard so it doesnt render twice
  container.replaceChildren();
  // Renders the leaderboard 
  for (var i = 0; i < leaderboard.length; i++) {
    let newLi = document.createElement('li');
    newLi.textContent = leaderboard[i].name + ': ' + leaderboard[i].score;
    container.append(newLi);
  }
}

// clears leaderboard and also clears local storage
function clearLeaderboard(){
  container.replaceChildren();
  leaderboard = [];
  localStorage.removeItem('leaderboard');
}

// Displays end game screen
function endGame() {
  questionSection.classList.add('hidden');
  endScreen.classList.remove('hidden');
  end = true;
}

// Reset game sets everything back to original state
function resetGame() {
  for (var i = 0; i < quizQuestion.length; i++) {
    quizQuestion[i].picked = false;
  }
  end = false;
  count = 70;
  intialsInput.value = '';
}


// eventListeners for all buttons
startBtn.addEventListener('click', startQuiz);
submitScoreBtn.addEventListener('click', saveScore);
viewScoreBtn.addEventListener('click', showLeaderboard);
clearBtn.addEventListener('click', clearLeaderboard);
goBackBtn.addEventListener('click', function() {
  endScreen.classList.add('hidden');
  questionSection.classList.add('hidden');
  leaderboardSection.classList.add('hidden');
  intro.classList.remove('hidden');
});
document.addEventListener('click', checkQuestion)

