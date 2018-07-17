
import Game from 'src/js/class/Game';
// import $ from 'jquery';

const app = {
    game : new Game(),
    init : function () {
        
        console.log("App init");
        app.game.init();
        //starting carousel
        $('.carousel').carousel()
        
        //enable tooltip
        $('[data-toggle="tooltip"]').tooltip()

        //starting game on btn click
        $('#btnEnter').on('click', function() {
            app.game.start();
        $(this).remove();;
        });

   
    }
}
$(app.init);

export default app;