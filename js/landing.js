$(document).ready(function(){

    $('.minigame-section').click(function(e){
        window.location.href = $(this).find('.minigame').attr("game");
    });
});