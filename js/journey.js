$(document).ready(function() {
  setTimeout(function(){
    show_bio();
  },4000);

  $('.button').on('click', function(){
    hide_bio();
    $('#map2').addClass('start_landing');
    $('#flightpath2').addClass('start_landing');
    $('#flight1').addClass('start_landing');
    setTimeout(function(){
      window.location.href = "landing.html";
    }, 4800);
  });

  // $('.button').hover(function(){
  //   $('.button').css("background", "#FFFFFF");
  //   $('#next-arrow').css("stroke", "#46c6e5");
  // }, function(){
  //   $('.button').css("background", "transparent");
  //   $('#next-arrow').css("stroke", "#FFFFFF");
  // });
});

function show_bio() {
  $('#bio').fadeIn(1000, "linear");
}

function hide_bio() {
  $('#bio').fadeOut(1000, "linear");
}