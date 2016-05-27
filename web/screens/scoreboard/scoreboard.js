var locked = false;
var cardOpacity = 0.75;

var teamArray = [
    {name: 'red', color: '#952323'},
    {name: 'blue', color: '#235695'},
    {name: 'green', color: '#4e6e07'},
    {name: 'orange', color: '#d68400'},
    {name: 'purple', color: '#4a3187'},
    {name: 'gold', color: '#c9a71a'},   
    {name: 'brown', color: '#492907'}, 
    {name: 'pink', color: '#ff84b5'}, 
    {name: 'white', color: '#e8e8e8'}, 
    {name: 'black', color: '#232323'}           
];

$(window).load(function(){
    $(document).keydown(function(e) {
        if((locked && e.keyCode == 9)||(locked && e.keyCode == 27))
            dew.hide();
    });
});

dew.on("scoreboard", function(e){
    dew.getScoreboard().then(function (e) { 
        $('#header').empty();
        if(e.gameType=="slayer"){
            $('#header').append(
                '<th></th><th>Players</th><th>Kills</th><th>Deaths</th><th>Assists</th><th>Score</th>'
            );
        }
        buildScoreboard(e.players, e.hasTeams, e.teamScores);
    });
    dew.command("Server.NameClient", { internal: true }).then(function (name) {
        $("#serverName").text(name);
    });
});

dew.on("show", function(e){
    locked = e.data.locked;
    dew.captureInput(locked);
    if(locked){
        $('#closeButton').show();
    }else{
        $('#closeButton').hide();
    } 
    dew.getScoreboard().then(function (e) { 
        $('#header').empty();
        //if(e.gameType=="slayer"){
            $('#header').append(
                '<th></th><th>Players</th><th>Kills</th><th>Deaths</th><th>Assists</th><th>Score</th>'
            );
        //}
        buildScoreboard(e.players, e.hasTeams, e.teamScores);
    });
    dew.command("Server.NameClient", { internal: true }).then(function (name) {
        $("#serverName").text(name);
    });
});

function buildScoreboard(lobby, teamGame, scoreArray){
    var tempArray = [];
    for(var i=0; i < scoreArray.length; i++) {
        tempArray.push({name: teamArray[i].name, score: 0});
    }
    var where = '#scoreboard';
    if(lobby.length > 0) {
        $('#scoreboard').empty();
        $('#window tbody').slice(1).remove();
        for(var i=0; i < lobby.length; i++) {
            var bgColor = lobby[i].color;
            if(teamGame){
                bgColor = teamArray[lobby[i].team].color;
                where = '#'+teamArray[lobby[i].team].name;
                if($(where).length == 0) {
                    $('#window table').append('<tbody id="'+teamArray[lobby[i].team].name+'"><tr class="player teamHeader" style="background-color:'+hexToRgb(teamArray[lobby[i].team].color, cardOpacity)+';"><td></td><td>'+teamArray[lobby[i].team].name.toUpperCase()+' TEAM</td><td></td><td></td><td></td><td></td></tr></tbody>');    
                }        
                $(where+' td:eq(2)').text(parseInt($(where+' td:eq(2)').text() || 0)+lobby[i].kills); //kills
                $(where+' td:eq(3)').text(parseInt($(where+' td:eq(3)').text() || 0)+lobby[i].deaths); //deaths
                $(where+' td:eq(4)').text(parseInt($(where+' td:eq(4)').text() || 0)+lobby[i].assists); //assists  
                $(where+' td:eq(5)').text(parseInt($(where+' td:eq(5)').text() || 0)+lobby[i].score); //score                  
                tempArray[tempArray.findIndex(x => x.name == teamArray[lobby[i].team].name)].score = $(where+' td:eq(5)').text();              
                orderTeams(tempArray);
            }
            $(where).append(
                $('<tr>', {
                    css: {
                        backgroundColor: hexToRgb(bgColor,cardOpacity)
                    },
                    class: 'player',
                    'data-uid': lobby[i].UID
                })
                .append($('<td>'))
                .append($('<td>').text(lobby[i].name)) //name
                .append($('<td>').text(lobby[i].kills)) //kills
                .append($('<td>').text(lobby[i].deaths)) //deaths
                .append($('<td>').text(lobby[i].assists)) //assists
                .append($('<td>').text(lobby[i].score)) //score
            );            
        }
        sortTable(where, 5);   
        if(!teamGame){ //add rank numbers
            for (i = 0; i< $(where+' tr').length; i++){
                $(where+' tr:eq('+i+') td:eq(0)').text(i+1);  
            }
        }  
    }  
}

function hexToRgb(hex, opacity) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return "rgba(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + "," + opacity + ")";
}

function orderTeams(list){
    list.sort(function(b, a) {
        return parseFloat(a.score) - parseFloat(b.score);
    });
    for (i = 0; i < list.length; i++) { 
        $('#'+list[i].name+' td:eq(0)').text(parseInt(i) + 1);
        $('#window table').append($('#'+list[i].name));
    }
}

function sortTable(where, score){
    var rows = $(where+' tr:not(.teamHeader)').get();
    rows.sort(function(b, a) {
        return parseInt($(a).children('td').eq(score).text(),10) - parseInt($(b).children('td').eq(score).text(),10);
    });
    $.each(rows, function(index, row) {
        $(where).append(row);
    });
}