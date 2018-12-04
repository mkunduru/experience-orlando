var card_set = ['card-1', 'card-2', 'card-3', 'card-4', 'card-5', 'card-6'];
var open_window_timeout = 0;

var cancel_instruction_timer = false;
var game_level_timer = 30;
var timer_id;
var score = 0;

$(document).ready(function(){
    $('#play').on('click', function() {
        start_game();
        display_instruction(8000);
    }); 
    
    $('.window').on('click', function() {
        if(!$(this).hasClass('window--locked')) {
            clearTimeout(open_window_timeout);
            check_open_windows();
            click_window($(this));
            check_matching_cards();
            open_window_timeout = setTimeout(check_open_windows, 800);
        }
    });    
});

function clean_slate() {
	$('.window').removeClass('clicked');
    $('.window').removeClass('matched');
    $('.window').addClass('window--locked');
    $('.cards').removeClass('clicked');
    $('.window__shutter--left').removeClass('clicked').css({"-webkit-transform": ""});
    $('.window__shutter--right').removeClass('clicked').css({"-webkit-transform": ""});
    $('.card').removeClass('visible');
}

function setup_level(level) {
  switch (level) {
    case 1:
      open_windows(4);
      break;
    case 2:
      open_windows(8);
      break;
    case 3:
      open_windows(12);
      break;
    default:
      console.log("Levels exhausted. Sorry!");
  }
}

/* ==========================================================================
   Pre-Game Helper functions
   ========================================================================== */

function place_cards(card_count) {
    deck = shuffle(card_set).slice(0, card_count);
    playing_deck = deck.concat(deck);
    
    shuffle_deck = shuffle(playing_deck);
    for(i=0; i<shuffle_deck.length; i++) {
        $('.window:not(.window--locked)').eq(i).find('.cards').find('.'+shuffle_deck[i]).addClass('visible');
     }
     reset_timer();
}

function open_windows(windows) {
    switch (windows) {
        case 4:
            $('.window:nth-child(6n+3)').removeClass('window--locked');
            $('.window:nth-child(6n+4)').removeClass('window--locked');
            place_cards(windows/2);
            break;
        case 6:
            $('.window:nth-child(6n+2)').removeClass('window--locked');
            $('.window:nth-child(6n+3)').removeClass('window--locked');
            $('.window:nth-child(6n+4)').removeClass('window--locked');
            place_cards(windows/2);
            break;
        case 8:
            $('.window:nth-child(6n+2)').removeClass('window--locked');
            $('.window:nth-child(6n+3)').removeClass('window--locked');
            $('.window:nth-child(6n+4)').removeClass('window--locked');
            $('.window:nth-child(6n+5)').removeClass('window--locked');
            place_cards(windows/2);
            break;
        case 10:
            $('.window:nth-child(6n+1)').removeClass('window--locked');
            $('.window:nth-child(6n+2)').removeClass('window--locked');
            $('.window:nth-child(6n+3)').removeClass('window--locked');
            $('.window:nth-child(6n+4)').removeClass('window--locked');
            $('.window:nth-child(6n+5)').removeClass('window--locked');
            place_cards(windows/2);
            break;
        case 12:
            $('.window').removeClass('window--locked');
            place_cards(windows/2);
            break;
        default:
            console.log("No game designed for the number of windows requested");
    }
}

/* ==========================================================================
   Game Helper functions
   ========================================================================== */

function click_window($this) {
    if(!$this.hasClass('matched')) {
        if($this.hasClass('clicked')){
            $this.toggleClass('clicked');
            $this.find('.cards').toggleClass('clicked');
            $this.find('.window__shutter--left').toggleClass('clicked').css({"-webkit-transform": "translate(0, 0)"});
            $this.find('.window__shutter--right').toggleClass('clicked').css({"-webkit-transform": "translate(0, 0)"});
        }
        else {
            $this.toggleClass('clicked');
            $this.find('.cards').toggleClass('clicked');
            $this.find('.window__shutter--left').toggleClass('clicked').css({"-webkit-transform": "translate(-100px, 0)"});;
            $this.find('.window__shutter--right').toggleClass('clicked').css({"-webkit-transform": "translate(100px, 0)"});;
        }
    }
}

function check_open_windows() {
    if($('.window.clicked').length == 2) {
        click_window($('.window.clicked'));
    }
    check_game_progress();
}


function check_game_progress() {
    if($('.window:not(.window--locked):not(.matched)').length == 0) {
        setTimeout(function(){
          if(in_game){
            announce_level_up(game_level+1);
            update_score_level();
          }
        }, 750);
    }
}

function match_cards($window1, $window2) {
    if($window1.find('.card.visible').attr('class') == 
       $window2.find('.card.visible').attr('class')) {
        $window1.removeClass('clicked').addClass('matched');
        $window2.removeClass('clicked').addClass('matched');
        add_points($window1);
        add_points($window2);
        update_match_score();
    }
}

function add_points($window) {
  var point_class = $window.attr('id');
  position = $window.find('.card.visible').offset();
  positionleft = get_left_offset(point_class, position.left);
  positiontop = position.top;
  console.log("left: "+positionleft+" top: "+positiontop);
  
  $('.'+point_class).offset({left: positionleft, top: positiontop});
  $('.'+point_class).addClass('trigger');
  console.log("point class adds trigger: "+point_class);
  setTimeout(function(){
    $('.'+point_class).removeClass('trigger');
    console.log("point class removes trigger: "+point_class);
  },3000);
}

function get_left_offset(window, left) {
  switch (window) {
    case "w1":
      return left + (8 * left)/100;
      break;
    case "w2":
      return left + (5 * left)/100;
      break;
    case "w3":
      return left + (4 * left)/100;
      break;
    case "w4":
      return left + (3 * left)/100;
      break;
    case "w5":
      return left + (2.5 * left)/100;
      break;
    case "w6":
      return left + (2 * left)/100;
      break;
    case "w7":
      return left + (8 * left)/100;
      break;
    case "w8":
      return left + (5 * left)/100;
      break;
    case "w9":
      return left + (4 * left)/100;
      break;
    case "w10":
      return left + (3 * left)/100;
      break;
    case "w11":
      return left + (2.5 * left)/100;
      break;
    case "w12":
      return left + (2 * left)/100;
      break;
    default:
      console.log("Levels exhausted. Sorry!");
  }
}

function check_matching_cards() {
    if($('.window.clicked').length == 2) {
        $window1 = $('.window.clicked').eq(0);
        $window2 = $('.window.clicked').eq(1);
        match_cards($window1, $window2);
    }
}

function update_match_score() {
  points = game_level * 100;
  update_score_html(points);
}

function update_score_level() {
  points = (game_level + 1) * 500 + level_timer * 50;
  update_score_html(points);
}

function show_results() {
  clearInterval(timer_id);
  clearTimeout(open_window_timeout);
  idle=false;
  remove_toolbar_exit();
  $('.result-overlay').find('.final-points').text($('.toolbar__score').find('.toolbar__value').text());
  $('.result-overlay').show();
  clean_slate();
}