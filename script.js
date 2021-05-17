// variables to reference html
var alertsEl = document.querySelector(".alerts");
var correctEl = document.querySelector(".alert-success");
var doneEl = document.querySelector(".done");
var initialInput = document.getElementById("initial-input");
var quiz = document.querySelector(".quiz");
var scoresEl = document.getElementById("highscores");
var scoreForm = document.querySelector(".form");
var start = document.getElementById("start");
var timeEl = document.getElementById("time");
var welcome = document.getElementById("welcome");
var wrongEl = document.querySelector(".alert-danger");
var yourScore = document.getElementById("your-score");

// other variables
var interval;
var questionIndex = 0;
var score = 0;
var timeLeft = 0;
var scores = [];

// list of questions
var questions = [{
        q: 'What does the terminal command \'cd\' do?',
        a: 'Change the directory',
        choices: ['Change the directory', 'Copy the directory', 'Play a CD']
    },
    {
        q: 'Which style positions elements relative to their nearest positioned ancestor?',
        a: 'Absolute',
        choices: ['Absolute', 'Relative', 'Fixed']
    },
    {
        q: 'What does the alt attribute in an <img> tag?',
        a: 'Specifies alternate text for an image if it cannot be displayed',
        choices: ['Provides an alternate image to display', 'Specifies the path to the image', 'Specifies alternate text for an image if it cannot be displayed']
    },
    {
        q: 'What is the value of x in the following line of code: var x = "Volvo" + 16 + 4;',
        a: 'Volvo164',
        choices: ['Volvo20', 'Volvo164', 'undefined']
    },
    {
        q: 'Which of these is not a valid comment in JavaScript?',
        a: '<!-- comment -->',
        choices: ['// comment', '<!-- comment -->', '/* comment */']
    },
    {
        q: 'Which line of code allows you to select an element with an id of \'apple\'?',
        a: 'document.getElementByID("apple");',
        choices: ['document.getElementByID("apple");', 'document.getElementByID("#apple");', 'document.querySelector(".apple");']
    }
];

// start the quiz when the start button is clicked
if (start) {
    start.addEventListener("click", startQuiz);
}

function startQuiz() {
    // clear start quiz info
    welcome.setAttribute("style", "display: none;");
    quiz.setAttribute("style", "display: block");

    // the timer starts
    startTimer();

    // the user is presented with a question
    displayQ();
}

// display the question
function displayQ() {
    quiz.innerHTML = '';

    if (questionIndex < questions.length) {
        // create a div for the question
        var questionEl = document.createElement("div");
        quiz.append(questionEl);

        // display the question itself
        var questionQ = document.createElement("h3");
        questionQ.textContent = questions[questionIndex].q;
        questionEl.append(questionQ);

        // display the choices as buttons
        for (var i = 0; i < questions[questionIndex].choices.length; i++) {
            var choice = document.createElement("button");
            choice.setAttribute("class", "btn btn-primary");
            choice.setAttribute("data-value", questions[questionIndex].choices[i]);
            choice.setAttribute("data-answer", questions[questionIndex].a);
            choice.setAttribute("type", "button");
            choice.setAttribute("onclick", "chooseAnswer(this)");
            choice.setAttribute("style", "display: block; margin: 5px 0px 5px 0px;");
            choice.textContent = questions[questionIndex].choices[i];
            questionEl.append(choice);
        }
    } else {
        quiz.setAttribute("style", "display: none");

        // when all questions are answered, then the game is over
        gameOver();
    }
}

// answer validation
function chooseAnswer(value) {
    // alert the user that they are correct
    if (value.dataset.value === value.dataset.answer) {
        correctEl.setAttribute("style", "display: block");
        wrongEl.setAttribute("style", "display: none");

        // the alert diappears after a second
        setTimeout(function() {
            correctEl.style.display = "none";
        }, 1000);

        // update user's score
        score += 1;
    } else {
        // alert the user that they are wrong
        wrongEl.setAttribute("style", "display: block");
        correctEl.setAttribute("style", "display: none");

        setTimeout(function() {
            wrongEl.style.display = "none";
        }, 1000);

        // when the user answers a question incorrectly, then time is subtracted from the clock
        timeLeft -= 9;

        if (timeLeft < 0) {
            timeLeft = 0;
        }
    }

    // advance to the next question
    questionIndex++;

    // when the user answers a question, then they are presented with another question
    displayQ();
}

// display the user's final score and allow them to save it
function gameOver() {
    quiz.style.display = 'none';
    doneEl.style.display = 'block';

    // stop the timer
    clearInterval(interval);

    yourScore.textContent = 'Your final score is ' + score + '/' + questions.length + '.';
}

// timer functionality
function startTimer() {
    timeLeft = 30;

    if (timeLeft > 0) {
        interval = setInterval(function() {
            timeEl.textContent = timeLeft;
            timeLeft--;

            // CRUNCH TIME! change the timer text color to red
            if (timeLeft <= 4) {
                timeEl.style.color = 'red';
            }

            // when the timer reaches 0, then the game is over
            if (timeLeft < 0) {
                gameOver();
                timeLeft = 0;
            }
        }, 1000);
    } else {
        timeEl.textContent = 0;
    }
}

// if user is on gameo over screen with the submit form...
if (scoreForm) {
    // when the game is over, the user can save their initials and score
    scoreForm.addEventListener("submit", function(event) {
        event.preventDefault();
    
        var initialText = initialInput.value.trim();
    
        // do not accept empty initials
        if (initialText === '') {
            return;
        }

        var userScore = {
            'initials': initialText,
            'score': score
        };
        
        // add the new score to the scores array
        scores.push(userScore);
        
        // reset the input field
        initialInput.value = '';
    
        // add the scores array to localStorage
        localStorage.setItem('scores', JSON.stringify(scores));

        // go to highscores page
        window.location.href = "https://maphaiyarath.github.io/code-quiz/highscores.html";
    });
    
}

// grab the previous high scores from localStorage
function init() {
    var storedScores = JSON.parse(localStorage.getItem("scores"));

    if (storedScores !== null) {
        scores = storedScores;
    }
}

// present the high scores as a table
function showScores() {
    var storedScores = JSON.parse(localStorage.getItem("scores"));

    if (storedScores !== null) {
        scores = storedScores;
    }

    // create a row for each score found
    for (var i = 0; i < scores.length; i++) {
        var scoreItem = scores[i];

        var tr = document.createElement("tr");
        scoresEl.append(tr);
        
        var tdInitial = document.createElement("td");
        tdInitial.textContent = scoreItem.initials;
        tr.append(tdInitial);

        var tdScore = document.createElement("td");
        tdScore.textContent = scoreItem.score;
        tr.append(tdScore);
    }
}

// self-explanatory
function clearScores() {
    scoresEl.innerHTML = '';
    localStorage.clear();
}

// if on high scores page, then show scores
if (scoresEl) {
    showScores();
}

init();