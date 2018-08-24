var database = firebase.database();
var ref = database.ref('quizzes');

function newQuiz() {
    console.log("ran");
    ref.on('value', gotDataNewQuiz, errDataNewQuiz);

}

function gotDataNewQuiz(data) {
    data = data.val();
    var inputQuiz = $("#quizName").val();
    var inputAuthor = $("#authorName").val();
    if (inputQuiz in data) {
        console.log("Quiz name already exists");
        document.getElementById("errorNewQuiz").innerHTML = "This quiz name has already been used! Try another one!";
    }   else {
        console.log("Quiz name available");
        document.getElementById("errorNewQuiz").innerHTML = "Great!";
        ref.child($("#quizName").val()).child("author").set($("#authorName").val());
        localStorage.setItem("quizName", inputQuiz);
        window.location.href = './input.html';
    }
}

function errDataNewQuiz(err) {
    console.log("error!");
    console.log(err);
}

function inputOnload() {
    var quizName = localStorage.getItem("quizName");
    document.getElementById("quizNameDisplay").innerHTML = quizName;
}

function newQuestion() {
    var questionSet = {
        answer: $("#answer").val(),
        A: $("#optionA").val(),
        B: $("#optionB").val(),
        C: $("#optionC").val(),
        D: $("#optionD").val(),
        E: $("#optionE").val()
    };
    var currentQuiz = $("#quizNameDisplay").text();
    ref.child(currentQuiz).child("questions").child($("#question").val()).set(questionSet);

    // Reset form for new entry
    $("#question").val('');
    $("#answer").val('');
    $("#optionA").val('');
    $("#optionB").val('');
    $("#optionC").val('');
    $("#optionD").val('');
    $("#optionE").val('');
}

function completeQuiz() {
    var questionSet = {
        answer: $("#answer").val(),
        A: $("#optionA").val(),
        B: $("#optionB").val(),
        C: $("#optionC").val(),
        D: $("#optionD").val(),
        E: $("#optionE").val()
    };
    var currentQuiz = $("#quizNameDisplay").text();
    ref.child(currentQuiz).child("questions").child($("#question").val()).set(questionSet);
    window.location.href = './quizDone.html';
}

function goHome() {
    window.location.href = './index.html';
}

function buildQuiz() {
    window.location.href = './newQuiz.html';
}


function displayQuizzes() {
    ref.on('value', gotDataDisplayQuizzes, errDataDisplayQuizzes);
}

function gotDataDisplayQuizzes(data) {
    var table = document.getElementById("quizDisplay");
    var data = data.val();


    for (var i in data) {

        var buttonnode= document.createElement('input');
        buttonnode.setAttribute('type','button');
        buttonnode.setAttribute('class', 'btn btn-dark btn-sm')
        buttonnode.setAttribute('value','GO');
        buttonnode.setAttribute('onClick', "initializeQuiz(this.parentNode)");

        var row = table.insertRow(1);
        row.insertCell(0).innerHTML = i;
        row.insertCell(1).innerHTML = data[i].author;
        row.appendChild(buttonnode);
    }

}

function errDataDisplayQuizzes(err) {
    console.log("error!");
    console.log(err);
}





function initializeQuiz(rowOfButtonClicked) {
    var table = document.getElementById("quizDisplay");
    var currentQuiz = table.rows[rowOfButtonClicked.rowIndex].cells[0].innerHTML;
    alert(currentQuiz);

    localStorage.setItem("currentQuiz", currentQuiz);
    localStorage.setItem("currentQuestionNum", 0);
    localStorage.setItem("score", 0);
    console.log(localStorage.getItem("currentQuiz"), localStorage.getItem("currentQuestionNum"), localStorage.getItem("score"));
    window.location.href = './quizMode.html';
}








$(document).ready(function() {
  $(".search").keyup(function () {
    var searchTerm = $(".search").val();
    var listItem = $('.results tbody').children('tr');
    var searchSplit = searchTerm.replace(/ /g, "'):containsi('")

  $.extend($.expr[':'], {'containsi': function(elem, i, match, array){
        return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
    }
  });

  $(".results tbody tr").not(":containsi('" + searchSplit + "')").each(function(e){
    $(this).attr('visible','false');
  });

  $(".results tbody tr:containsi('" + searchSplit + "')").each(function(e){
    $(this).attr('visible','true');
  });

  var jobCount = $('.results tbody tr[visible="true"]').length;
    $('.counter').text(jobCount + ' item');

  if(jobCount == '0') {$('.no-result').show();}
    else {$('.no-result').hide();}
          });
});




// TAKING A QUIZ

function beginQuiz() {
    ref.on('value', gotDataBeginQuiz, errDataBeginQuiz);
}

function gotDataBeginQuiz(data) {
    document.getElementById("quizTitle").innerHTML = localStorage.getItem("currentQuiz");
    document.getElementById("questionNum").innerHTML = localStorage.getItem("currentQuestionNum");

    var currentQuiz = $("#quizTitle").text();

    var questions = data.val()[currentQuiz]["questions"];

    var currentQuestion = Object.keys(questions)[parseInt($("#questionNum").text())];

    // Retrieve and display question
    document.getElementById("question").innerHTML = currentQuestion;

    // Retrieve and display each option
    document.getElementById("optionA").innerHTML = questions[currentQuestion]["A"];
    document.getElementById("optionB").innerHTML = questions[currentQuestion]["B"];
    document.getElementById("optionC").innerHTML = questions[currentQuestion]["C"];
    document.getElementById("optionD").innerHTML = questions[currentQuestion]["D"];
    document.getElementById("optionE").innerHTML = questions[currentQuestion]["E"];

    localStorage.setItem("score", 0);

}







function errDataBeginQuiz(err) {
    console.log("error!");
    console.log(err);
}

function submitAnswer() {
    ref.on('value', gotDataSubmitAnswer, errDataSubmitAnswer);
}

function gotDataSubmitAnswer(data) {
    var currentQuiz = $("#quizTitle").text();
    var questions = data.val()[currentQuiz]["questions"];
    var currentQuestion = Object.keys(questions)[parseInt($("#questionNum").text())];

    localStorage.setItem("quizTitle", parseInt($("#quizTitle").text()));
    localStorage.setItem("questionNum", parseInt($("#questionNum").text()));

    var formInputStates = {
        "A": document.getElementById("inputA").checked,
        "B": document.getElementById("inputB").checked,
        "C": document.getElementById("inputC").checked,
        "D": document.getElementById("inputD").checked,
        "E": document.getElementById("inputE").checked
    }

    var retrievedAnswer = String(questions[currentQuestion]["answer"]);

    if (formInputStates[retrievedAnswer] == true) {
        // ADD TO SCORE
        var newScore = parseInt(localStorage.getItem("score")) + 1;
        localStorage.setItem("score", newScore);

        document.getElementById("response").innerHTML = "Correct!";
    } else {
        document.getElementById("response").innerHTML = "Oh no! That's incorrect!";
    }

    // ADD TO QUESTION NUMBER
    var currentQuestionNum = parseInt($("#questionNum").text()) + 1;
    var numOfQuestionsInQuiz = Object.keys(questions).length;
    localStorage.setItem("numOfQuestionsInQuiz", numOfQuestionsInQuiz);

    if (currentQuestionNum == numOfQuestionsInQuiz) {
        window.location.href = './quizzingDone.html';
    } else {
        console.log("continue to next question");
    }
    localStorage.setItem("currentQuestionNum", currentQuestionNum);

    nextQuestions(data);
}

function errDataSubmitAnswer(err) {
    console.log("error!");
    console.log(err);
}



function nextQuestions(data) {
    document.getElementById("questionNum").innerHTML = localStorage.getItem("currentQuestionNum");

    var currentQuiz = $("#quizTitle").text();
    var questions = data.val()[currentQuiz]["questions"];
    var currentQuestion = Object.keys(questions)[parseInt(localStorage.getItem("currentQuestionNum"))];

    // Retrieve and display question
    document.getElementById("question").innerHTML = currentQuestion;

    // Retrieve and display each option
    document.getElementById("optionA").innerHTML = questions[currentQuestion]["A"];
    document.getElementById("optionB").innerHTML = questions[currentQuestion]["B"];
    document.getElementById("optionC").innerHTML = questions[currentQuestion]["C"];
    document.getElementById("optionD").innerHTML = questions[currentQuestion]["D"];
    document.getElementById("optionE").innerHTML = questions[currentQuestion]["E"];

}


function finishedQuiz() {
    console.log(String(localStorage.getItem("score")));
    document.getElementById("score").innerHTML = "Your Score: " +  String(localStorage.getItem("score")) + "/" + String(localStorage.getItem("numOfQuestionsInQuiz"));
}
