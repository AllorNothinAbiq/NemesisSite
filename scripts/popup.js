function showPopup(url,event_data){
    $.get( url, function( data ) {
        $( ".popupDataContent" ).html( data);

        $(".popup").show();
        $("body").addClass("unscrollable");
        $(".popup .close").on("click",function () {
            $(".popup").hide();
            $("body").removeClass("unscrollable");

        })


        var event = jQuery.Event( "popupOpened" );
        event.test="lol";

        $(document).trigger("popupOpened",event_data);
    });
}
