$(loadFB(getPhotos));

function getPhotos() {
    var limit = 5;
    FB.api(
        "/" + fbgroupid+"/photos?type=uploaded&fields=images,name",
        {
            "limit": limit,
            "access_token": accesstoken
            
        },
        function (response) {
            if (response && !response.error) {
                var $slidescontainer = $(".slideshow-container");
                var $slideshowcontrolls = $(".slideshow-controlls");
                var template_img = $("#imageTemplate").html();
                var template_dot = $("#dotTemplate").html();
                Mustache.parse(template_img);
                Mustache.parse(template_dot);
                $slideshowcontrolls.empty();
                response.data.forEach(function (photo, index) {
                    var source = photo.images[0].source;
                   
                    var rendered = Mustache.render(template_img, { link: source });
                    $slidescontainer.append(rendered);


                    var rendered = Mustache.render(template_dot, { slide_nr: index + 1 });
                    $slideshowcontrolls.append(rendered);
                });
                showSlides(1);

                $slidescontainer.swipe({
                    //Generic swipe handler for all directions
                    swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
                        if (direction == "left") {
                            showPrevSlide();
                        } else if (direction == "right") {
                            showNextSlide();
                        }
                    }
                });
                
            } else {
                var $slidescontainer = $(".slideshow-container");
                $slidescontainer.empty();

                var template_error=$("#errorTemplate").html();
                var rendered=Mustache.render(template_error,{message:" "});
                $slidescontainer.append(rendered);
            }
        }
    );
}

function showNextSlide() {
    plusSlides(1);
}

function showPrevSlide() {
    plusSlides(-1);
}