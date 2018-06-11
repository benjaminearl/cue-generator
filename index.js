const twitchStream = require('twitch-stream');
 
twitchStream.connect({
    user: 'bnjmnearl',
    pass: '####',
    channel: ['#nickmercs'],
    data: onRecieveMessage,
    error: console.log,
});

const repeated = {}; 

function onRecieveMessage(msg){
    const id = msg.message;
    if(repeated[id] === undefined) {
        repeated[id] = 0;
    }
    
    repeated[id] = repeated[id] + 1;

    if(msg.user === 'nightbot'){
       return;
    } else if(repeated[id] > 0) {
        var choosenActor = Math.floor(Math.random() * 5) + 1 
        document.getElementById(`${choosenActor}`).innerHTML = `${msg.message}`;
    };
};