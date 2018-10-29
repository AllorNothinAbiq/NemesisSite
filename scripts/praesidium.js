var url="/data/praesidium.json";
var saved_data;
$(new function () {
    $.ajax({
        dataType: "json",
        url: url,
        success: showPraesidium,
        error:showError
    });

    $(document).bind("popupOpened",function (event,event_data) {
        showFullProfile(event_data.id);
    });

});

function showPraesidium(data) {
    var $container=$("#praesidium");
    var $container_oud_praesidium=$("#oudPraesidium");
    var template_profile = $("#profileTemplate").html();

    $container.empty();
    $container_oud_praesidium.empty();
    Mustache.parse(template_profile);
    data.forEach(function (profile, index) {
        var rendered = Mustache.render(template_profile, profile);
        if(profile.oud_praesidium.toLowerCase()==="x"){
            $container_oud_praesidium.append(rendered);
        }else{
            $container.append(rendered);
        }
    });

    saved_data=data;
}

function showError() {
    var $container=$(".profiles");
    $container.empty();

    var template_error=$("#errorTemplate").html();
    var rendered=Mustache.render(template_error,{message:"Er is een fout opgetreden tijdens het laden van de data. Sammy heeft een klein pietje."});
    $container.append(rendered);
}

function showFullProfile(id) {
    var $fullprofilecontainer=$("#fullprofilecontainer");

    var data=saved_data.filter(function (g,i){
      if(g.id===id){
          return true;
      }else{
          return false;
      }
    });

    if(data.length!=1){
        var template_error=$("#errorTemplate").html();
        var rendered=Mustache.render(template_error,{message:"Dit profiel bestaat niet. Timmmmmmueuuuh."});
        $fullprofilecontainer.append(rendered);
    }else{
        var template_profile=$("#fullProfileTemplate").html();
        var rendered=Mustache.render(template_profile,data[0]);
        $fullprofilecontainer.append(rendered);
    }
}