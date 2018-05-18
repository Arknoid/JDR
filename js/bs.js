var bs = {

    init : function () {

    //starting carousel
    $('.carousel').carousel()

    //enable tooltip
    $('[data-toggle="tooltip"]').tooltip()

    //starting game on btn click
    $('#btnEnter').on('click', function() {
      app.start();
      $(this).remove();;
    });
  },

}
$(bs.init);
