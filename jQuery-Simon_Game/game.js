var buttonColours = ["red", "blue", "green", "yellow"];

var gamePattern = [];
var userClickedPattern = [];

var flag = false;
var level = 0;

$(document).on("keypress", function() {
    if(!flag)
    {
        $("#level-title").text("Level " + level);
        nextSequence();
        flag = true;
    }
});


$(".btn").click(function() {
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    playSound(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
    console.log(userClickedPattern);    
});

function nextSequence() {

    userClickedPattern = [];

    level++;
    $("#level-title").text("Level " + level);

    var randomNumber = Math.floor(Math.random() * 4);

    var randomChosenColour = buttonColours[randomNumber];

    gamePattern.push(randomChosenColour);

    var buttonSelected = $("#" + randomChosenColour);
    buttonSelected.fadeOut(100).fadeIn(100);

    playSound(randomChosenColour);


}

function playSound(name) {
    var sound = new Audio("sounds/" + name + ".mp3");
    sound.play();
}

function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColour).removeClass("pressed");
      }, 100);
}

function checkAnswer(currentLevel) {
    if(userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        if(gamePattern.length === userClickedPattern.length)
        {
            setTimeout(nextSequence, 1000);
        }
    }
    else{
            var wrongSound = new Audio("sounds/wrong.mp3");
            wrongSound.play();
            $("body").addClass("game-over");
            setTimeout(function() {
                $("body").removeClass("game-over", 500);
            });
            $("#level-title").text("Game Over, Press Any Key to Restart");
            startOver();
        }
}

function startOver() {
    level = 0;
    gamePattern = [];
    flag = false;
}

