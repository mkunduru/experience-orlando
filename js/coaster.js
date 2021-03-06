var fired = false;
var idle = true;
var game_level_timer = 30;
var game_level_score = 0;
var interval_flag;
var timer_id;
var started_keys = [];
var keys_in_zone = [];
var key_hit_rate = 0;
var score = 0;
var key_height = 0;
var key_offsets = {
  left: {top: 0, bottom: 0},
  right: {top: 0, bottom: 0},
  up: {top: 0, bottom: 0},
  down: {top: 0, bottom: 0}
};
var traintween = {stop: function(){return true;}};
var coaster_speed = 'medium';

$(document).ready(function(){
   $("#play").on('click', function(){
     start_game();
     display_instruction(10000);
   });

   setInterval(check_key_progress, 50);   
  $('html').keydown(function(e){
      if(!fired) {
          if (e.which == 37) {
              idle = false;
              fired = true;
              check_key("left");
          }
          else if (e.which == 38) {
              idle = false;
              fired = true;
              check_key("up");
          }
          else if (e.which == 39) {
              idle = false;
              fired = true;
              check_key("right");
          }
          else if (e.which == 40) {
              idle = false;
              fired = true;
              check_key("down");
          }
      }
  });

  $('html').keyup(function(e) {
      fired = false;
  });
});

/* ==========================================================================
   Initialize Game Level
   ========================================================================== */

function setup_level(level) {
  switch (level) {
    case 1:
      game_level_score = level1.score;
      set_game_level_score(game_level_score);
      $('.keyboard').show();
      store_key_offsets();
      start_level(level1.keys());
      start_coaster();
      break;
    case 2:
      game_level_score = level2.score;
      set_game_level_score(game_level_score);
      store_key_offsets();
      start_level(level2.keys());
      start_coaster();
      break;
    case 3:
      game_level_score = level3.score;
      set_game_level_score(game_level_score);
      store_key_offsets();
      start_level(level3.keys());
      start_coaster();
      break;
    default:
      console.log("Levels exhausted. Sorry!");
  }
}

/* ==========================================================================
   Pre-Game Helper functions
   ========================================================================== */

var key_up = {
  width: "9vw",
  target: "up",
  class: "",
  html: function(){
          return $('<div class="key key--up '+this.class+'"><svg x="0px" y="0px" viewBox="0 0 75 75" style="enable-background:new 0 0 75 75;" xml:space="preserve"><g><circle style="fill:#FFFFFF;" cx="37.5" cy="37.5" r="37.5"/><path d="M36.3,54.8c0,0.7,0.5,1.2,1.2,1.2l0,0c0.7,0,1.2-0.5,1.2-1.2V23l9.6,9.6c0.5,0.4,1.2,0.4,1.7,0l0,0c0.4-0.5,0.4-1.2,0-1.7L38.3,19.3c-0.5-0.4-1.2-0.4-1.7,0L25.1,30.9c-0.4,0.5-0.4,1.2,0,1.7l0,0c0.5,0.4,1.2,0.4,1.7,0l9.6-9.6V54.8z"/></g></svg></div>');
        }
};

var key_down = {
  width: "16vw",
  target: "down",
  class: "",
  html: function(){
          return $('<div class="key key--down '+this.class+'"><svg x="0px" y="0px" viewBox="0 0 75 75" style="enable-background:new 0 0 75 75;" xml:space="preserve"><g><circle style="fill:#FFFFFF;" cx="37.5" cy="37.5" r="37.5"/><path d="M38.7,20.2c0-0.7-0.5-1.2-1.2-1.2l0,0c-0.7,0-1.2,0.5-1.2,1.2V52l-9.6-9.6c-0.5-0.4-1.2-0.4-1.7,0l0,0c-0.4,0.5-0.4,1.2,0,1.7l11.6,11.6c0.5,0.4,1.2,0.4,1.7,0l11.6-11.6c0.4-0.5,0.4-1.2,0-1.7l0,0c-0.5-0.4-1.2-0.4-1.7,0L38.7,52V20.2z"/></g></svg></div>');
        }
};

var key_left = {
  width: "2vw",
  target: "left",
  class: "",
  html: function(){
          return $('<div class="key key--left '+this.class+'"><svg x="0px" y="0px" viewBox="0 0 75 75" style="enable-background:new 0 0 75 75;" xml:space="preserve"><g><circle style="fill:#FFFFFF;" cx="37.5" cy="37.5" r="37.5"/><path d="M23,36.3l9.6-9.6c0.4-0.4,0.4-1.2,0-1.7l0,0c-0.4-0.4-1.2-0.4-1.7,0L19.3,36.7c-0.4,0.4-0.4,1.2,0,1.7l11.6,11.6c0.4,0.4,1.2,0.4,1.7,0l0,0c0.4-0.4,0.4-1.2,0-1.7L23,38.7h31.8c0.7,0,1.2-0.5,1.2-1.2l0,0c0-0.7-0.5-1.2-1.2-1.2H23z"/></g></svg></div>');
        }
};

var key_right = {
  width: "23vw",
  target: "right",
  class: "",
  html: function(){
          return $('<div class="key key--right '+this.class+'"><svg x="0px" y="0px" viewBox="0 0 75 75" style="enable-background:new 0 0 75 75;" xml:space="preserve"><g><circle style="fill:#FFFFFF;" cx="37.5" cy="37.5" r="37.5"/><path d="M20.2,36.3c-0.7,0-1.2,0.5-1.2,1.2l0,0c0,0.7,0.5,1.2,1.2,1.2H52l-9.6,9.6c-0.4,0.5-0.4,1.2,0,1.7l0,0c0.5,0.4,1.2,0.4,1.7,0l11.6-11.6c0.4-0.5,0.4-1.2,0-1.7L44.1,25.1c-0.5-0.4-1.2-0.4-1.7,0l0,0c-0.4,0.5-0.4,1.2,0,1.7l9.6,9.6H20.2z"/></g></svg></div');
        }
};

var level1 = {
  count: 18,
  score: 1000,
  keys: function() {
             return get_keys(this.count);
           }
};

var level2 = { 
  count: 24,
  score: 2500,
  keys: function() {
            return get_keys(this.count);
         }
}

var level3 = {
  count: 30,
  score: 4000,
  keys: function() {
           return get_keys(this.count);
         }
}

/* ==========================================================================
   Reset functions
   ========================================================================== */

function clean_slate() {
  clear_keys();
  game_level_score = 0;
  if(traintween) {
    traintween.stop();
  }
  clearInterval(interval_flag);
  started_keys = [];
  keys_in_zone = [];
  stop_coaster();
  key_hit_rate = 0;
  coaster_speed = 'medium';
  $('.arrow-guide').removeClass('glow');
  $('#coaster').removeClass('coaster-slow').removeClass('paused');
  $('#coaster').removeClass('coaster-medium').removeClass('paused');
  $('#coaster').removeClass('coaster-fast').removeClass('paused');
  document.getElementById("coaster").style.animationDelay = "0s";  
  var cabin = $('#js-train-cabin2').children('use');
  cabin.attr('xlink:href', '#coasterforward');
  cabin.css({'transform': 'translate(0, 0)'});
}

function clear_keys() {
  $('.key').remove();
}

function get_keys(count) {
    var level_keys = [];
    for(i=0; i< count/3; i++) {
      level_keys.push(Object.create(key_up));
      level_keys.push(Object.create(key_down));
      level_keys.push(Object.create(key_left));
      level_keys.push(Object.create(key_right));
    }
    return shuffle(level_keys).slice(0, count); 
};

function start_level(keys) {
  var key_set = shuffle(keys);
  var interval = game_level_timer / key_set.length;
  interval_flag = setInterval(function(){
    if(key_set.length == 0) {
      clearInterval(interval_flag);
    }
    else {
      item = key_set.shift();
      item.class = "key_"+key_set.length;
      item.html().insertAfter('.first-key');
      
      started_keys.push(item);
    }
  }, interval * 1000);
}

function show_results() {
  idle=false;
  remove_toolbar_exit();
  $('.result-overlay').find('.final_points').text($('.toolbar__score__value').text());
  $('.result-overlay').show();
}

function check_key(direction) {
    if(keys_in_zone.length) {
      item = keys_in_zone.shift();
      if(item.target == direction){
        success_key(item);
        update_score();   
      }
      else {
        failure_key(item);
      }
    }
    else if(started_keys.length) {
      item = started_keys.shift();
      failure_key(item);
    }
    $('.arrow-guide').removeClass('glow');
}

function update_score() {
    score = score + 100;
    insert_score_html(score.toString());
    if(score >= game_level_score) {
      setTimeout(function(){
        clear_keys();
      }, 500);
      setTimeout(function(){
        if(in_game){
          announce_level_up(game_level + 1);
        }
      }, 750);
    }   
}

function store_key_offsets() {
  key_height = $('.arrow-guide--left').height();

  offset = $('.arrow-guide--left').offset();
  key_offsets.left.top = offset.top;
  key_offsets.left.bottom = offset.top + key_height;

  offset = $('.arrow-guide--right').offset();
  key_offsets.right.top = offset.top;
  key_offsets.right.bottom = offset.top + key_height;

  offset = $('.arrow-guide--up').offset();
  key_offsets.up.top = offset.top;
  key_offsets.up.bottom = offset.top + key_height;
  
  offset = $('.arrow-guide--down').offset();
  key_offsets.down.top = offset.top;
  key_offsets.down.bottom = offset.top + key_height;
}

function check_key_progress() {
  if(started_keys.length > 0) {
    //Check if a highlighted circle needs to be calmed down
    if(keys_in_zone.length) {
      offset = key_offsets[keys_in_zone[0].target];
      if(!check_vicinity(offset, keys_in_zone[0])){
        item = keys_in_zone.shift();
        remove_vicinity_glow(item.target);
      }
    }
    
    //Check if the next key in line is in the vicinity
    offset = key_offsets[started_keys[0].target];
    if(check_vicinity(offset, started_keys[0])){
      item = started_keys.shift();
      add_vicinity_glow(item.target);
      keys_in_zone.push(item);
    }
  }
}

function check_vicinity(target, key) {
  offset = $('.'+key.class).offset();
  if(target.bottom > offset.top && target.top < (offset.top + key_height)) {
    return true;
  }
  return false;
}

function add_vicinity_glow(direction) {
  switch (direction) {
    case "left":
      $('.arrow-guide--left').addClass('glow');
      break;
    case "right":
      $('.arrow-guide--right').addClass('glow');
      break;
    case "up":
      $('.arrow-guide--up').addClass('glow');
      break;
    case "down":
      $('.arrow-guide--down').addClass('glow');
      break;
    default:
      console.log("direction do not match");
  }
}

function remove_vicinity_glow(direction) {
  switch (direction) {
    case "left":
      $('.arrow-guide--left').removeClass('glow');
      break;
    case "right":
      $('.arrow-guide--right').removeClass('glow');
      break;
    case "up":
      $('.arrow-guide--up').removeClass('glow');
      break;
    case "down":
      $('.arrow-guide--down').removeClass('glow');
      break;
    default:
      console.log("direction do not match");
  }
}

function success_key(item) {  
    $('.'+item.class).addClass('success');
    if(key_hit_rate == -2) {
      $('.coaster-slow').removeClass('paused');
      var cabin = $('#js-train-cabin2').children('use');
      if(cabin.attr('xlink:href') == '#coasterforwardblast') {
        cabin.attr('xlink:href', '#coasterforward');
        cabin.css({'transform': 'translate(0, 0)'});
      }
      else if(cabin.attr('xlink:href') == '#coasterreverseblast') {
        cabin.attr('xlink:href', '#coasterreverse');
        cabin.css({'transform': 'translate(0, 0)'});
      }
      traintween.start();
    }
    key_hit_rate = 0;
}

function failure_key(item) {  
    $('.'+item.class).addClass('failure');
    if(key_hit_rate == -2) {
      if(!$('.coaster-slow').hasClass('paused')) {
        // $("#crash-sound").trigger("play");
        // $("#crash-sound").prop("volume", ".5");
        // $('.coaster-slow').addClass('paused');
        setTimeout(function(){
          traintween.stop();
          var cabin = $('#js-train-cabin2').children('use');
          if(cabin.attr('xlink:href') == '#coasterforward') {
            cabin.attr('xlink:href', '#coasterforwardblast');
            cabin.css({'transform': 'translate(-45px, -55px)'});
          }
          else if(cabin.attr('xlink:href') == '#coasterreverse') {
            cabin.attr('xlink:href', '#coasterreverseblast');
            cabin.css({'transform': 'translate(-45px, -55px)'});
          }
        }, 1000);
      }
    }
    else {
      key_hit_rate = key_hit_rate - 1;
    }
}

/* ==========================================================================
   Roller Coaster 
   ========================================================================== */

function start_coaster() {
    Main();
    setTimeout(function(){
      $('#coaster').addClass('coaster-slow');
    }, 4500);
}

function stop_coaster() {
    traintween.stop();
}

function Main() {
    vars();
    launchTrains();
    animate();
}

vars = function() {
    var cabin, i, _i, _j;
    this.train1 = {
      cabins: [],
      background: document.getElementById('coaster'),
      path: document.getElementById('cabinpath')
    };
    for (i = _i = 1; _i <= 3; i = ++_i) {
      if (cabin = document.getElementById("js-train-cabin" + i)) {
        this.train1.cabins.push(cabin);
      }
    }
    this.cabinWidth = 1 * this.train1.cabins[0].getBoundingClientRect().width;
    this.childNode = 0;
    this.childMethod = 'children';
    return this.animate = this.bind(this.animate, this);
};

launchTrains = function() {
  var it;
  it = this;
  var timeJustPrev = Date.now();
  /*var speed = 35000;*/
  var speed = 50000;
  totallength = this.train1.path.getTotalLength();
  traintween = new TWEEN.Tween({
    length: totallength
  }).to({
    length: 0
  /*}, 8000).onUpdate(function() {*/
  }, speed).onUpdate(function() { 
      keep_coaster_on_screen(it);
      var angle, attr, cabin, cabinChild, i, point, prevPoint, shift, x, x1, x2, y, _i, _len, _ref, _results;
      _ref = it.train1.cabins;
      _results = [];

      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        cabin = _ref[i];
        shift = i * it.cabinWidth;
    
          point = it.train1.path.getPointAtLength(this.length - shift);
          prevPoint = it.train1.path.getPointAtLength(this.length - shift - 1);
          x1 = point.y - prevPoint.y;
          x2 = point.x - prevPoint.x;
          angle = Math.atan(x1 / x2) * (180 / Math.PI);
          x = point.x - 35;
          y = point.y - 35;
          if (point.x - prevPoint.x > 0) {
            if (!cabin.isRotated) {
              cabinChild = cabin[it.childMethod][it.childNode];
              cabinChild.setAttribute('xlink:href', '#coasterreverse');
              cabin.isRotated = true;
            }
          } else {
            if (cabin.isRotated) {
              cabinChild = cabin[it.childMethod][it.childNode];
              cabinChild.setAttribute('xlink:href', '#coasterforward');
              cabin.isRotated = false;
            }

          }

          attr = "translate(" + x + ", " + y + ") rotate(" + (angle || 0) + ",38,23)";
          _results.push(cabin.setAttribute('transform', attr));
      }
      
      return _results;
  }).start();
};
  
animate = function() {
    requestAnimationFrame(this.animate);
    //move_track();
    return TWEEN.update();
};

bind = function(func, context) {
    var bindArgs, wrapper;
    wrapper = function() {
      var args, unshiftArgs;
      args = Array.prototype.slice.call(arguments);
      unshiftArgs = bindArgs.concat(args);
      return func.apply(context, unshiftArgs);
    };
    bindArgs = Array.prototype.slice.call(arguments, 2);
    return wrapper;
};

function keep_coaster_on_screen(it) {
  var cabin = it.train1.cabins[0];
  var rect = cabin.getBoundingClientRect();

  var winWidth = $(window).width();
  var leftWin = (30*winWidth)/100;
  lowLimit = leftWin + (30 * (winWidth - leftWin) / 100);
  midlowLimit = leftWin + (50 * (winWidth - leftWin) / 100);
  highLimit = 80 * (winWidth) / 100;

  if(lowLimit > rect.right) {
    // Increase speed
    traintween.stop();
    if(cabin.isRotated) {
      traintween.to({length: 0}, 35000);
    }
    else {
      traintween.to({length: 0}, 40000);
    }
    traintween.start();
  }
  else if(midlowLimit > rect.right) {
    // Increase speed
    traintween.stop();
    if(cabin.isRotated) {
      traintween.to({length: 0}, 40000);
    }
    else {
      traintween.to({length: 0}, 55000);
    }
    traintween.start();
  }
  else if(midlowLimit < rect.right && highLimit > rect.right) {
    if(cabin.isRotated) {
      traintween.stop();
      traintween.to({length: 0}, 45000);
      traintween.start();
    }
  }
  else if(highLimit < rect.right) {
    // Lower speed
    traintween.stop();
    traintween.to({length: 0}, 65000)
    traintween.start();
  }

}

function get_current_distance(time, speed) {
    if(speed == 'slow'){
      return time / 60000;
    }
    else if(speed == 'medium') {
      return time / 40000;
    }
    else if(speed == 'fast') {
      return time/30000;
    }
    else if(speed == 'super-slow') {
      return time/75000;
    }
}