function getstate(callback,id){
    $.post('main/state',{id: id},function(data,status,xhr){
        callback(data);
    });
}
function turn(value,id)
{
    switch(value){
        case 'on':
            $.post('main/start',{id: id},function(data,status,xhr){
                if( data == "started" ){
                    getstate(function (state){
                        $("#"+id).text(state)
                    },id);
                }
            });
            break;
        case 'off':
            $.post('main/stop',{id: id},function(data,status,xhr){
                if( data == "stoped" ){
                    getstate(function (state){
                        $("#"+id).text(state)
                    },id);
                }
            });
            break
    }
};
function btnclick(id){
    getstate(function (state){
        switch(state){
            case 'running':
                turn('off',id)
                break
            default:
                turn('on',id)
                break
        }
    },id);
};
$(function(){
    var docker=$("#docker")
    $.getJSON("main/containers", function(j){
        var u ='';
        u+='<table>';
        u+='<tr><th>';
        u+='Name';
        u+='</th><th>';
        u+='Id';
        u+='</th><th>';
        u+='Image';
        u+='</th><th>';
        // u+='Ports';
        // u+='</th><th>';
        u+='Command';
        u+='</th><th>';
        u+='State';
        u+='</th><th>';
        u+='Icon';
        u+='</th></tr>';
        for(x in j.id){
            var a ='';
            a+='<tr><td>';
            a+=j.names[x].substring(1);
            a+='</td><td>';
            a+=j.id[x].substring(0,10);
            a+='</td><td>';
            a+=j.image[x];
            // a+='</td><td>';
            // a+=j.ports[x]
            // console.log(j.ports[x])
            a+='</td><td>';
            a+=j.command[x];
            a+='</td><td id="'+j.id[x]+'">';
            a+=j.state[x];
            a+='</td><td>';
            a+='<button class="' + j.id[x] + '">Toggle</button>';
            a+='</td></tr>';
            u+=a;
        }
        u+='</table>';
        docker.html(u);
        // docker.append('<p> Name :' + j.names[a] + ' | State : ' + j.state[a] + ' | Image : ' + j.image[a] + '</p>');
        // docker.append('<p>Name : ' + json.name[a] + '</p>')
        $("button").click(function() {
            btnclick($(this).attr("class"))
        });
    });
});
