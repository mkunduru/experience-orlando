$(document).ready(function(){

    $('.minigame-section').click(function(e){
        window.location.href = $(this).find('.minigame').attr("game");
    });

    $('.minigame-section').hover(function(){
    	$(this).children('h5').toggleClass("hover");
    	$(this).children('.minigame').toggleClass("hover");
    });
});