var idle = false;
var game_level = 0;
var level_timer = 0;
var in_game = false;

/* ==========================================================================
   Initialize functions.
   ========================================================================== */

$(document).ready(function(){
    $('body').bind('mousedown', function(event) {
      if(idle) {
        switch (event.which) {
          case 1:
              idle=false;
        }
      }
    });

    $('.play_again').on('click', function(){
      start_game();
    });

    $('.toolbar__exit').on('click', function(){
      game_over();
    });

    $('.back').on('click', function(){
      window.history.back();
    });
});

function start_game() {
  reset_toolbar();
	hide_overlays();
	initialize_game(1);
  score = 0;
  insert_score_html(score);
}

function hide_overlays() {
    $('.instruction-overlay').hide();
    $('.result-overlay').hide();
}

/* ==========================================================================
   In game instruction
   ========================================================================== */

function check_inactivity() {
  cancel_instruction_timer = 
    setInterval(function(){
      show_instruction();
    }, 500);
}

function display_instruction(timeout) {
    idle = true;
    setTimeout(function(){
        check_inactivity()
    }, timeout);
}

function show_instruction() {
  if(idle) {
    $('.in-game-instruction').show();
  }
  else {
    $('.in-game-instruction').hide();
    clearInterval(cancel_instruction_timer);
  }
}

/* ==========================================================================
   Initialize Game Level
   ========================================================================== */

function initialize_game(level) {
    game_level = level;
    if(level < 4) {
        in_game = true;
        play_level(level);
    }
    else {
      game_winner();  
    }
}

function play_level(level) {
    clean_slate();
    reset_timer();
    set_game_level();
    setup_level(level);
}


/* ==========================================================================
   Toolbar Functions.
   ========================================================================== */

function reset_toolbar() {
	$('.toolbar').show();
    $('.toolbar__exit').show();
    $('.toolbar__score').find('.toolbar__value__score').text(0);
}

function set_toolbar_timer(time) {
    $('.toolbar__timer').find('.toolbar__value').text(get_timer_value(time));
}

function set_game_level() {
  $('.game_level').text(game_level+" ");
}

function set_game_level_score(points) {
  $('.toolbar__value__game-score').text(points);
}

function update_score_html(points) {
  current_score = parseInt($('.toolbar__score').find('.toolbar__value').text());
  new_score = current_score + points;
  $('.toolbar__score').find('.toolbar__value').text(new_score);
}

function insert_score_html(points) {
  $('.toolbar__score__value').text(points);
}

function remove_toolbar_exit() {
    $('.toolbar__exit').hide();
}

/* ==========================================================================
   Timer functions
   ========================================================================== */

function reset_timer() {
  clearInterval(timer_id);
  level_timer = game_level_timer;
  start_timer();
}

function start_timer() {
  timer_id = setInterval(function(){
                if(level_timer > 0) {
                  level_timer = level_timer - 1;
                  set_toolbar_timer(level_timer);
                } else {
                  game_over();
                  clean_slate();
                  clearInterval(timer_id);
                }
              }, 1000);
}

function get_timer_value(time) {
  if(time < 10) {
    return "0 : 0"+time.toString();
  } 
  else {
    return "0 : "+time.toString();
  }
}

/* ==========================================================================
    Utility Functions
   ========================================================================== */

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/* ==========================================================================
    Results Overlay
   ========================================================================== */

function update_result_message(message) {
    $('.result-overlay').find('.result').text(message);
}

function show_winner() {
    $('.result-overlay').find('.loser').hide();
    $('.result-overlay').find('.winner').show(); 
}

function show_loser() {
    $('.result-overlay').find('.winner').hide();
    $('.result-overlay').find('.loser').show(); 
}

function game_winner() {
  update_result_message("Congratulations!");
  show_winner();
  show_results();
}

function game_over() {
  in_game = false;
  update_result_message("Game Over");
  show_loser();
  show_results();
  clean_slate();
}

/* ==========================================================================
    Level Up Overlay
   ========================================================================== */

var announce_messages = ["Good Job!", "Keep Going!", "Awesome!", "Almost there!"]
function announce_level_up(level) {
    if(level < 4) {
      $('.level-overlay').addClass('level-overlay--open').removeClass('level-overlay--close');
       setTimeout(function(){
         $('.level-overlay__message .title').text("Level "+level);
         $('.level-overlay__message .message').text(random_announce(announce_messages));
         $('.level-overlay__message').show();
       }, 300);
    
      setTimeout(function(){
        initialize_game(game_level + 1);
        $('.level-overlay').addClass('level-overlay--close').removeClass('level-overlay--open');
        setTimeout(function(){
         $('.level-overlay__message').hide();
        }, 400);
      }, 1800);
    }
    else {
      initialize_game(game_level + 1);
    }
}

function random_announce(messages) {
  shuffled = shuffle(messages);
  return shuffled[0];
}