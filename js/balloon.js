var score = 0;
var hit = false;
var blast = false;
var game_level_score = 0;
var game_level_timer = 45;
var timer_id = null;
var gift_timeouts = [];
var keys = {};

$(document).ready(function(){
  bind_instruction_text();

  $('#play').on('click', function() {
      start_game();
      display_instruction(6000);
      setInterval(moveBalloon, 20);
      setInterval(checkCollision, 30);
      bind_game_functions();
  });

  $(window).resize(function(){
    bind_instruction_text();
  });
});

function bind_instruction_text() {
  position = $('.instruction-collect svg g')[0].getBoundingClientRect();;
  positionleft = position.left + 40;
  positiontop = position.top + 15;
  $('.instruction-collect .instruction-title').offset({left: positionleft, top: positiontop}).show();

  position = $('.instruction-avoid svg g')[0].getBoundingClientRect();;
  positionleft = position.left + 45;
  positiontop = position.top + 15;
  $('.instruction-avoid .instruction-title').offset({left: positionleft, top: positiontop}).show();
}

/* ==========================================================================
   Initialize Game Level
   ========================================================================== */

function setup_level(level) {
  switch (level) {
    case 1:
        game_level_score = level1.score;
        set_game_level_score(game_level_score);
        drop_gifts(level1.items());
        break;
    case 2:
        game_level_score = level2.score;
        set_game_level_score(game_level_score);
        drop_gifts(level2.items());
        break;
    case 3:
        game_level_score = level3.score;
        set_game_level_score(game_level_score);
        drop_gifts(level3.items());
        break;
    default:
        console.log("Levels exhausted. Sorry!");
  }
}

/* ==========================================================================
   Pre-Game Helper functions
   ========================================================================== */

var lollipop = {
  name: "lollipop",
  category: "good",
  points: 100,
  speed: 7,
  options: ["orange", "pink", "purple", "green"],
  image: function() {
            var color = this.options[Math.floor(Math.random() * this.options.length)];
            return color + "lollipop.svg";
          },
  html: function(){
          return $("<div class='lollipop gift' category='"+this.category+"' points='"+this.points+"'><img src='img/games/balloon/items/"+this.image()+"'></div");
        }
};

var candy = {
  name: "candy",
  category: "good",
  points: 100,
  speed: 5,
  options: ["orange", "pink", "purple", "green"],
  image: function() {
            var color = this.options[Math.floor(Math.random() * this.options.length)];
            return color + "candy.svg";
          },
  html: function(){
          return $("<div class='candy gift' category='"+this.category+"' points='"+this.points+"'><img src='img/games/balloon/items/"+this.image()+"'></div");
        }
};

var hourglass = {
  name: "hourglass",
  category: "good",
  points: "0:05",
  speed: 7,
  html: function(){
          return $("<div class='hourglass gift' category='"+this.category+"' points='"+this.points+"' time='"+this.time+"'><img src='img/games/balloon/items/time.svg'></div");
        } 
};

var rock = {
  name: "rock",
  category: "bad",
  points: -100,
  speed: 3,
  html: function(){
          return $("<div class='rock gift' category='"+this.category+"' points='"+this.points+"'><img src='img/games/balloon/items/rock.svg'></div");
        } 
};

var bomb = {
  name: "bomb",
  category: "bad",
  points: -200,
  speed: 5,
  html: function(){
          return $("<div class='bomb gift' category='"+this.category+"' points='"+this.points+"'><img src='img/games/balloon/items/bomb.svg'></div");
        } 
};

var bird = {
  name: "bird",
  category: "bad",
  points: -100,
  options: ["bird--low", "bird--high", "bird--out"],
  speed: 12,
  path: function() {
          return this.options[Math.floor(Math.random() * this.options.length)];
        },
  html: function(){
          return $("<div class='bird gift "+this.path()+"' category='"+this.category+"' points='"+this.points+"'><img src='img/games/balloon/items/bird.svg'></div");
        } 
};

var level1 = {
  score: 1200,
  items: function() {
             return shuffle(get_level_items(18,18,4,11,11,6));
           }
};

var level2 = { 
  score: 2900,
  items: function() {
            return shuffle(get_level_items(20,20,4,13,16,6));
         }
}

var level3 = {
  score: 5000,
  items: function() {
            return shuffle(get_level_items(26,25,4,16,16,7));
         }
}

function get_level_items(num_candy, num_lollipop, num_hourglass, num_rock, num_bomb, num_bird) {
    return Array(num_candy).fill(candy).concat(Array(num_lollipop).fill(lollipop),
                                               Array(num_hourglass).fill(hourglass),
                                               Array(num_rock).fill(rock),
                                               Array(num_bomb).fill(bomb),
                                               Array(num_bird).fill(bird)); 
};

/* ==========================================================================
   Game Helper functions
   ========================================================================== */

function moveBalloon() {
    if(!blast) {
      for (var direction in keys) {
          if (!keys.hasOwnProperty(direction)) continue;
          if (direction == 37 && $("#balloon").offset().left > 25) {
                idle = false;
                idleSecondsCounter = 0;
                $("#balloon").animate({left: "-=5"}, {duration: 0, queue: false});               
          }
          if (direction == 38 && $("#balloon").offset().top > 25) {
              idle = false;
              idleSecondsCounter = 0;
              $("#balloon").animate({top: "-=5"}, {duration: 0, queue: false});  
          }
          if (direction == 39 && $("#balloon").offset().left < ($(window).width()-125)) {
              idle = false;
              idleSecondsCounter = 0;
              $("#balloon").animate({left: "+=5"}, {duration: 0, queue: false});  
          }
          if (direction == 40 && $("#balloon").offset().top < ($(window).height()-200)) {
              idle = false;
              idleSecondsCounter = 0;
              $("#balloon").animate({top: "+=5"}, {duration: 0, queue: false});  
          }
      }
    }
}

function bind_game_functions() {
  $(document).bind('keydown', function(e) {
    keys[e.keyCode] = true;
  });

  $(document).bind('keyup', function(e) {
      delete keys[e.keyCode];
  });
}

function drop_gifts(gift_list) {
  var gifts = shuffle(gift_list);
  var interval = 65000 / gifts.length;
  for(i=0; i<gifts.length; i++) {
    /*var rand = Math.round(Math.random() * (50000 - 1000));*/
    var rand = Math.random() * interval + interval * (i-1);
    gift = gifts[i];
    create_gift(gift, rand);
  }
}

function create_gift(gift, rand) {
  gift_timeouts.push(setTimeout(function() {
    new_gift(gift);
  }, rand));
}

function new_gift(gift) {
    if(gift.name == "bird") {
      $element = gift.html().insertBefore("#balloon");
    }
    else {
      var width = $(window).width();
      var left_margin = width/10;
      var left_offset = left_margin + Math.floor(Math.random() * (width - 2*left_margin));
      //var left_offset = 300 + Math.floor(Math.random() * 1300);
      var topValue = $(window).height();
      var random_duration = gift.speed * 1000;
      gift.html().insertBefore("#balloon")
                .offset({left: left_offset, top: -50})
                .animate({top: topValue},
                         {duration: random_duration, easing: "linear", queue: false, complete: clearGift});
    }
}

function clearGift() {
    this.remove();
}

function show_results() {
  clearInterval(timer_id);
  idle=false;
  remove_toolbar_exit();
  $('.result-overlay').find('.final_points').text($('.toolbar__score__value').text());
  $('.result-overlay').show();
}

/* ==========================================================================
   Collision Detection
   ========================================================================== */

function collision($div1, $div2) {
  var x1 = $div1.offset().left;
  var y1 = $div1.offset().top;
  var h1 = $div1.outerHeight(true);
  var w1 = $div1.outerWidth(true);
  var b1 = y1 + h1;
  var r1 = x1 + w1;
  var x2 = $div2.offset().left;
  var y2 = $div2.offset().top;
  var h2 = $div2.outerHeight(true);
  var w2 = $div2.outerWidth(true);
  var b2 = y2 + h2;
  var r2 = x2 + w2;
    
  if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
  return true;
}

function checkCollision() {
  if(hit == false) {
    for(i=0; i<$('.gift').not('.collected').length; i++) {
        
        var gift = $('.gift').not('.collected').eq(i);
        
        if(collision(gift, $('#balloon'))) {
          collisionClear(gift);
          if(gift.hasClass('hourglass')){
            level_timer = level_timer + 5;
          }
          else {
            score = score + parseInt(gift.attr("points"));
            insert_score_html(score.toString());
            if(score >= game_level_score) {
              clear_gifts();
              setTimeout(function(){
                if(in_game){
                  announce_level_up(game_level+1);
                }
              }, 750);
              
              //initialize_game(game_level + 1);
            }
          } 
        }
    }
  }
}

function collisionClear($gift) {
    $gift.addClass("collected notransition");
    $gift.html($gift.attr("points"));
    setTimeout(function() {
      $gift.remove();
    }, 2000);
    if($gift.attr("category") == "bad") {
      hit = true;
      blast = true;
      //$("#balloon").addClass('blink');
      blast_balloon();
      setTimeout(function(){
        setTimeout(function(){
          hit = false;
        }, 1000);
        blast = false;
        unblast_balloon();
        //$("#balloon").removeClass('blink');
      }, 1500);
    }
}

function blast_balloon() {
  $("#full-balloon").hide();
  $("#blast-balloon").show();
}

function unblast_balloon() {
  $("#blast-balloon").hide();
  $("#full-balloon").show();
}

/* ==========================================================================
   Reset functions
   ========================================================================== */

function clean_slate() {
    clear_gifts();
    hit = false;
    game_level_score = 0;
    game_level_timer = 45;
    clearInterval(timer_id);
    gift_timeouts = [];
    keys = {};
    unblast_balloon();
    //$("#balloon").removeClass('blink');
    $("#balloon").css('top', '70%');
    $("#balloon").css('left', '50%');
}

function clear_gifts() {
  $('.gift').remove();
  for(i=0; i<gift_timeouts.length; i++) {
    clearTimeout(gift_timeouts[i]);
  }
}