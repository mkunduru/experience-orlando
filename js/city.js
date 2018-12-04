var bright_windows = [];
var dull_windows = [];

$(document).ready(function() {
    animate_downtown_lights();
    start_fireworks();
    show_play_icons();
    buzz_icons_hover();

    $('#logo').on('click', function(){
       window.open('http://www.meenakunduru.com');
       return false;
    });

    $(window).resize(function() {
        show_play_icons();
        buzz_icons_hover();
        start_fireworks();

    });
});

function buzz_icons_hover(){
  $('.info-img').hover(function(){
    $(this).removeClass('buzz').addClass('hover');
  }, function(){
    $(this).removeClass('hover').addClass('buzz');
  });
}

function animate_downtown_lights() {
    $('#building3windows, #building1windows, #building2windows, #building4windows, #building5windows')
        .children('line').each(function(index, value){
            dull_windows.push($(this));
    })
        animate_city_lights();
    setInterval(function(){
        animate_city_lights();
    }, 3000);
}

function animate_city_lights() {
    if(bright_windows.length > 20) {
        for(i=0; i< 10; i++) {
            random_window = Math.floor(Math.random() * bright_windows.length);
            dull_windows.push(bright_windows[random_window].removeClass('lights-on'));
            bright_windows.splice(random_window, 1);
        }
    }

    if (bright_windows.length < 30) {
        for(i=0; i< 15; i++) {
            random_window = Math.floor(Math.random() * dull_windows.length);
            bright_windows.push(dull_windows[random_window].addClass('lights-on'));
            dull_windows.splice(random_window, 1);
        }
    }
}

function start_fireworks() {
    scrollX = window.scrollX;
    scrollY = window.scrollY;

    position = $('#disneycastle')[0].getBoundingClientRect();
    positionleft = position.left + scrollX + (20 * position.left/100);
    positiontop = position.top + scrollY + (1 * position.top/100);
    $('.firework-1').offset({left: positionleft, top: positiontop}).show();

    positionleft = position.left + scrollX + (50 * position.left/100);
    positiontop = position.top + scrollY;
    $('.firework-2').offset({left: positionleft, top: positiontop}).show();

    positionleft = position.left + scrollX + (25 * position.left/100);
    positiontop = position.top + scrollY - (2 * position.top/100);
    $('.firework-3').offset({left: positionleft, top: positiontop}).show();

    positionleft = position.left + scrollX + (40 * position.left/100);
    positiontop = position.top + scrollY + (5 * position.top/100);
    $('.firework-4').offset({left: positionleft, top: positiontop}).show();

    positionleft = position.left + scrollX + (5 * position.left/100);
    positiontop = position.top + scrollY;
    $('.firework-5').offset({left: positionleft, top: positiontop}).show();

    positionleft = position.left + scrollX + (40 * position.left/100);
    positiontop = position.top + scrollY + (2 * position.top/100);
    $('.firework-6').offset({left: positionleft, top: positiontop}).show();
}

function stop_fireworks() {
    $('.fireworks').hide();
}

function show_play_icons() {
    scrollX = window.scrollX;
    scrollY = window.scrollY;

    position = $('#stadium')[0].getBoundingClientRect();
    positionleft = position.left + scrollX + (18 * (position.left+scrollX))/100;
    positiontop = position.top + scrollY - (14 * (position.top+scrollY))/100;
    $('#stadiuminfo').offset({left: positionleft, top: positiontop}).show();

    height = $('#stadiuminfo').find('.landmark-info').height();
    positionleft = positionleft - (10 * positionleft/100);
    positiontop = positiontop - height;
    $('#stadiuminfo').find('.landmark-info').offset({left: positionleft, top: positiontop});


    position = $('#b2')[0].getBoundingClientRect();;
    positionleft = position.left + scrollX - (5 * (position.left+scrollX))/100;
    positiontop = position.top + scrollY - (7 * (position.top+scrollY))/100;
    $('#downtowninfo').offset({left: positionleft, top: positiontop}).show();

    height = $('#downtowninfo').find('.landmark-info').height();
    positionleft = positionleft - (5 * positionleft/100);
    positiontop = positiontop - height;
    $('#downtowninfo').find('.landmark-info').offset({left: positionleft, top: positiontop});


    position = $('#bigballoonarea')[0].getBoundingClientRect();;
    positionleft = position.left + scrollX - (5 * (position.left+scrollX))/100;
    positiontop = position.top + scrollY - (6 * (position.top+scrollY))/100;
    $('#balloonplay').offset({left: positionleft, top: positiontop}).show();

    position = $('#rollercoasterpath')[0].getBoundingClientRect();;
    positionleft = position.left + scrollX - (15 * (position.left+scrollX))/100;
    positiontop = position.top + scrollY - (5 * (position.top+scrollY))/100;
    $('#coasterplay').offset({left: positionleft, top: positiontop}).show();

    position = $('#disneycastle')[0].getBoundingClientRect();;
    positionleft = position.left + scrollX - (25 * (position.left+scrollX))/100;
    positiontop = position.top + scrollY + (8 * (position.top+scrollY))/100;
    $('#disneyplay').offset({left: positionleft, top: positiontop}).show();

    position = $('#orlandoeyebackground')[0].getBoundingClientRect();;
    positionleft = position.left + scrollX + (15 * (position.left+scrollX))/100;
    positiontop = position.top + scrollY - (1 * (position.top+scrollY))/100;
    $('#orlandoeyeinfo').offset({left: positionleft, top: positiontop}).show();

    height = $('#orlandoeyeinfo').find('.landmark-info').height();
    positionleft = positionleft - (positionleft/20);
    positiontop = positiontop - height;
    $('#orlandoeyeinfo').find('.landmark-info').offset({left: positionleft, top: positiontop});

    position = $('#kayakbackground')[0].getBoundingClientRect();;
    positionleft = position.left + scrollX + (30 * (position.left+scrollX))/100;
    positiontop = position.top + scrollY + (3 * (position.top+scrollY))/100;
    $('#kayakinfo').offset({left: positionleft, top: positiontop}).show();

    height = $('#kayakinfo').find('.landmark-info').height();
    positionleft = positionleft - (5 * positionleft/100);
    positiontop = positiontop - height;
    $('#kayakinfo').find('.landmark-info').offset({left: positionleft, top: positiontop});

    $('.info-img').on('click', function(e){
        e.stopPropagation();
        $('.landmark-info').css({opacity: 0});
        $('.info-img').show();
        $(this).hide();
        $(this).siblings().css({opacity: 1});
    })

    $(window).on('click', function(){
        $('.info-img').show();
        $('.landmark-info').css({opacity: 0});
    }) 
}

/***************************************************************

Roller Coaster 

****************************************************************/

(function() {
  var Main;

  Main = (function() {
    function Main() {
        this.vars();
        this.launchTrains();
        this.animate();
    }

    Main.prototype.vars = function() {
      var cabin, i, _i, _j;
      this.train1 = {
        cabins: [],
        path: document.getElementById('rollercoasterpath')
      };
      for (i = _i = 1; _i <= 3; i = ++_i) {
        if (cabin = document.getElementById("js-train-cabin" + i)) {
          this.train1.cabins.push(cabin);
        }
      }
      this.cabinWidth = 0.9 * this.train1.cabins[0].getBoundingClientRect().width;
      this.childNode = 0;
      this.childMethod = 'children';
      return this.animate = this.bind(this.animate, this);
    };
    
    Main.prototype.launchTrains = function() {
      var it;
      it = this;
      this.train1Tween = new TWEEN.Tween({
        length: this.train1.path.getTotalLength()
      }).to({
        length: 0
      /*}, 8000).onUpdate(function() {*/
      }, 12000).onUpdate(function() {
          var angle, attr, cabin, cabinChild, i, point, prevPoint, shift, x, x1, x2, y, _i, _len, _ref, _results;
          _ref = it.train1.cabins;
          _results = [];

          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            cabin = _ref[i];
            shift = i * it.cabinWidth;
            if ((this.length - shift) < 0.25) {
              cabin.style.display = 'none';
              _results.push(cabin);
            }
            else {
              cabin.style.display = 'block';
              point = it.train1.path.getPointAtLength(this.length - shift);
              prevPoint = it.train1.path.getPointAtLength(this.length - shift - 1);
              x1 = point.y - prevPoint.y;
              x2 = point.x - prevPoint.x;
              angle = Math.atan(x1 / x2) * (180 / Math.PI);
              x = point.x - 40;
              y = point.y - 40;
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
          }
          return _results;
      }).delay(3000).repeat(999999999999).start();
    };
  
    Main.prototype.animate = function() {
      requestAnimationFrame(this.animate);
      return TWEEN.update();
    };

    Main.prototype.bind = function(func, context) {
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

    return Main;

  })();

  new Main;

}).call(this);
