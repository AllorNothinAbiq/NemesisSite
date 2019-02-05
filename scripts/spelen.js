var url="/data/games.json";
var saved_data;
var recommended_games=[];
$(new function () {
    $.ajax({
        dataType: "json",
        url: url,
        success: showGames,
        error:showError
    });

    $(document).bind("popupOpened",function () {
        showTab(0);
        $("#gameRecommenderForm").show();
        $("#gameRecommenderResult").hide();
    });
});

function showGames(data){
    saved_data=data.sort(gameOrderer);
    var $gamescontainer=$(".gamescontainer");
    var template_game = $("#gameTemplate").html();

    $gamescontainer.empty();
    Mustache.parse(template_game);
    data.forEach(function (game, index) {
        game.naam=game.Naam.toLowerCase();
        var rendered = Mustache.render(template_game, game);
        $gamescontainer.append(rendered);
    });
}

function showError(error) {

    var $gamescontainer=$(".gamescontainer");
    $gamescontainer.empty();

    var template_error=$("#errorTemplate").html();
    var rendered=Mustache.render(template_error,{message:"Error."});
    $gamescontainer.append(rendered);
}

function search(sender){
    var $input=$("#searchSpel");
    var searchstring=$input.val().toLowerCase();
    if(searchstring==""){
        var selected=$(".gamescontainer li");
        selected.show();
    }else{
        var $not_searched=$(".gamescontainer li:not([data-name*='"+searchstring+"'])");
        $not_searched.fadeOut();
        var $searched=$(".gamescontainer li[data-name*='"+searchstring+"']");
        $searched.fadeIn();
    }

}

function recommend(){

    var $gamescontainer=$("#gameRecommenderResult .result .gamescontainer");

    $("#gameRecommenderForm").hide();
    $("#gameRecommenderResult").show();
    $("#gameRecommenderResult .busy").show();
    $("#gameRecommenderResult .result").hide();

    var n_players=parseInt($("#nrPlayers").val());
    var time=parseInt($("#time").val());

    var selected_game=selectGame(n_players,time,recommended_games);

    //if no game is selected and one has already recommended games then redo everything
    if(selected_game.length===0&&recommended_games.length>0){
        recommended_games=[];
        selected_game=selectGame(n_players,time,recommended_games);
    }

    $("#gameRecommenderResult .result").show();
    $("#gameRecommenderResult .busy").hide();

    $gamescontainer.empty();

    if(selected_game.length>0){
        selected_game.forEach(function(elem){
            recommended_games.push(elem.Id);
        });
        var template_game = $("#gameTemplate").html();
        Mustache.parse(template_game);
        selected_game.forEach(function (game, index) {
            game.naam=game.Naam.toLowerCase();
            var rendered = Mustache.render(template_game, game);
            $gamescontainer.append(rendered);
        });
    }else{
            var template_error = $("#errorTemplate").html();
            Mustache.parse(template_error);
            var rendered = Mustache.render(template_error, {message: "Er blijken geen spelen te voldoen aan je criteria"});
            $gamescontainer.append(rendered);
    }

}

function selectGame(n_players,time,recommended_games) {

    var filtered_data= saved_data.filter(function (g,i){
        var valid=true;
        if(g.Min_spelers>n_players){
            valid=false;
        }
        if(g.Max_spelers!=null&&g.Max_spelers<n_players){
            valid=false;
        }
        if(g.Min_duur>time){
            valid=false;
        }

        if(g.Max_duur!=null&&g.Max_duur<time){
            valid=false;
        }
        if(recommended_games.indexOf(g.Id)>=0){
            valid=false;
        }
        return  valid;
    });

    var number_games=filtered_data.length;
    if(number_games>0){
        var weights=[];
        filtered_data.forEach(function (value) {
           weights.push(value.Min_duur);
        });

        var selected_index=weighted_random_number(weights);
        //var selected_index=Math.floor(Math.random()*number_games);
        return [filtered_data[selected_index]];
    }else{
        return [];
    }

}

function gameOrderer(a, b){
    var a_gom = a.Game_of_month.toLowerCase();
    var b_gom = b.Game_of_month.toLowerCase();

    if(a_gom==b_gom){
        var a_name=a.Naam.toLowerCase();
        var b_name=b.Naam.toLowerCase();
        return ((a_name < b_name) ? -1 : ((a_name > b_name) ? 1 : 0));
    }else{
        return (a_gom?-1:1);
    }
}

function refresh_spelen(){
    recommend();
}

function weighted_random_number(weights){
    var sum=weights.reduce(function(a, b) { return a + b; }, 0);

    var number_weight=Math.floor(Math.random()*sum)+1;


    var smallest_weight=Infinity;
    var smallest_weight_index=0;
    for(var index=weights.length-1;index>=0;index--){
        var weight=weights[index];
        if(weight>number_weight){
            if(weight<smallest_weight){
                smallest_weight_index=index;
                smallest_weight=weight;
            }
        }
    }

    return smallest_weight_index;

}