function increment(elem_id){
    var $elem=$("#"+elem_id);
    var current_value=parseInt($elem.val());
    var max=parseInt($elem.attr('max'));
    var min=parseInt($elem.attr('min'));
    var step=1;

    var str_step=$elem.attr('step');
    if(str_step!=undefined&&str_step!=""){
        step=parseInt(str_step);
    }
    if(step)
    if(current_value+step<=max){
        $elem.val(current_value+step);
        $elem.next(".ctrl__counter-num").text($elem.val());
    }
}

function decrement(elem_id){
    var $elem=$("#"+elem_id);
    var current_value=parseInt($elem.val());
    var max=parseInt($elem.attr('max'));
    var min=parseInt($elem.attr('min'))
    var step=1;

    var str_step=$elem.attr('step');
    if(str_step!=undefined&&str_step!=""){
        step=parseInt(str_step);
    }

    if(current_value-step>=min){
        $elem.val(current_value-step);
        $elem.next(".ctrl__counter-num").text($elem.val());
    }
}