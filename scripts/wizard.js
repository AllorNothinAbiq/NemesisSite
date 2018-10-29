var current_tab=0;
function showTab(n){
    var $tabs=$(".wizard .tab");

    $tabs.hide()
    current_tab=n;
    var $current_tab=$tabs.eq(current_tab);
    var $current_tab=$tabs.eq(current_tab);
    $current_tab.show();


    if(n==$tabs.length-1){
        $(".wizard .prev").show();
        $(".wizard .next").hide();
        $(".wizard .submit").show();
    }else if(n==0){
        $(".wizard .prev").hide();
        $(".wizard .next").show();
        $(".wizard .submit").hide();
    }else{
        $(".wizard .prev").show();
        $(".wizard .next").show();
        $(".wizard .submit").hide();
    }
}

function navigate(step){
    var $tabs=$(".wizard .tab");
    showTab(current_tab+step);
}