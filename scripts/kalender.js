$(loadFB(loadEvents));
function loadEvents() {
    var limit = 100;
    FB.api(

        "/" + fbgroupid + "/events?fields=name,start_time,description,attending_count,place,cover&date_format=U",
    {
        "limit": limit,
        "access_token": accesstoken

    },
    function (response) {
        if (response && !response.error) {
            var data = response.data;
            var $kalenderItemContainer = $("#kalenderContainer");
            $kalenderItemContainer.empty();
            var template_kalenderitem = $("#kalenderItemTemplate").html();
            var template_kalenderTitle = $("#kalenderTitleTemplate").html();
            var template_error=$("#errorTemplate").html();
            var template_noNext = $("#noNextTemplate").html();
            Mustache.parse(template_kalenderitem);
            Mustache.parse(template_error);
            Mustache.parse(template_kalenderTitle);
            Mustache.parse(template_noNext);


            if(data.length>0){
                var current_month = "";
                var current_year = "";
                var is_first_month = true;

                var next_event;
                var next_event_date_unix=0;

                var current_date=new Date();
                var current_date_unix=moment(current_date).unix()*1000;
                response.data.forEach(function (ev) {
                    var date = ev.start_time;
                    var date_moment = moment(date);
                    var date_unix = date_moment.unix()*1000;


                    ev.start_date = formatDate(date_unix);
                    ev.start_time = formatTime(date_unix);
                    ev.isExpired = isExpired(date_unix);

                    var month = new Date(date_unix).toLocaleDateString("nl-BE", { month: "long" });
                    var year = new Date(date_unix).toLocaleDateString("nl-BE", { year: "numeric" });
                    ev.month = month;
                    ev.year = year;

                    if(((date_unix>next_event_date_unix&&next_event_date_unix==0)||(date_unix<next_event_date_unix))&&date_unix>=current_date_unix){
                        next_event_date_unix=date_unix;
                        next_event=ev;
                    }
                    if (month != current_month || year != current_year) {
                        if(current_month!=""||current_year!=""){
                            is_first_month = false;
                        }

                        current_month = month;
                        current_year = year;
                        var rendered_title = Mustache.render(template_kalenderTitle, { month: month, year: year});
                        var $rendered_title = $(rendered_title);
                        $rendered_title.click(function () { toggleCategory($rendered_title) });
                        $kalenderItemContainer.append($rendered_title);
                    }
                    ev.visible = false;
                    var rendered = Mustache.render(template_kalenderitem, ev);
                    var $rendered = $(rendered);
                    var $description = $rendered.find(".cardListDescription");
                    var $readMore=$rendered.find(".actionLink");
                    $readMore.click(function () { readMore($readMore,$description) });
                    $kalenderItemContainer.append($rendered);
                });

                if(next_event){
                    next_event.visible = true;
                    next_event.next=true;
                    var rendered = Mustache.render(template_kalenderitem, next_event);
                    var $rendered = $(rendered);
                    var $description = $rendered.find(".cardListDescription");
                    var $readMore=$rendered.find(".actionLink");
                    $readMore.click(function () { readMore($readMore,$description) });
                    $kalenderItemContainer.prepend($rendered);

                    var rendered_title = Mustache.render(template_kalenderTitle, { month: next_event.month, year: next_event.year,next:true});
                    var $rendered_title = $(rendered_title);
                    $rendered_title.click(function () { toggleCategory($rendered_title) });
                    $kalenderItemContainer.prepend($rendered_title);
                }else{
                    var rendered_noNext = Mustache.render(template_noNext, {message:"Er zijn geen nieuwe evenementen. Ps: Axel heet niet Axel maar Alex."});
                    var $rendered_noNext=$(rendered_noNext);
                    $kalenderItemContainer.prepend($rendered_noNext);
                    var rendered_title = Mustache.render(template_kalenderTitle, { month: "Volgend", year: ""});
                    var $rendered_title = $(rendered_title);
                    $rendered_title.click(function () { toggleCategory($rendered_title) });
                    $kalenderItemContainer.prepend($rendered_title);


                }
            }else{
                $kalenderItemContainer.empty();
                var rendered=Mustache.render(template_error,{message:"Er blijken geen evenementen te zijn. Misschien kan je eens Pieters midget collectie bekijken."});
                $kalenderItemContainer.append(rendered);
            }

        }else {
            var $kalenderItemContainer = $("#kalenderContainer");
            $kalenderItemContainer.empty();

            var template_error=$("#errorTemplate").html();
            var rendered=Mustache.render(template_error,{message:"Er is een probleem opgetreden tijdens het laden. Probeer dit eens op te lossen door Alex een pintje te geven."});
            $kalenderItemContainer.append(rendered);
        }
    }
);
}

function formatDate(date) {
    var date = new Date(date);
    return date.toLocaleDateString();
}

function formatTime(date) {
    var date = new Date(date);
    return addZero(date.getHours())+":"+addZero(date.getMinutes());
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function isExpired(date) {
    var date = new Date(date);
    return date < new Date();
}

function readMore($origin,$target) {
    if ($target.css('display') == 'none') {
        $origin.text("Lees minder");
        $target.slideDown();
    } else {
        $origin.text("Lees meer");
        $target.slideUp();
    }
}

function toggleCategory(sender) {
    var category = sender.data("cat-title");
    $("[data-cat='" + category + "']").slideToggle();
}