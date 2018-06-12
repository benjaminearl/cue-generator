const twitchStream = require('twitch-stream');
const server = require('http').createServer();
const io = require('socket.io')(server);
var express = require('express');
var path = require('path');
var fs = require('fs');
var ip = require('ip');
var config = require('./config.json');

if (config.pass === '####') {
  throw('Add your password to config.json');
}

var html = fs.readFileSync(path.join(__dirname, 'www/index.html'), 'utf8')
  .replace('localhost', ip.address());

var app = express();
app.get('/', function(req, res){
  res.send(html);
});
app.listen(8080, function () {
  console.log(`Tell people to open the following url in their browser: http://${ip.address()}:8080`);
});

const connected = [];

io.on('connection', socket => {
  console.log(`Client connected: ${socket.id}`)
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});
server.listen(3000);

twitchStream.connect({
  user: config.user,
  pass: config.pass,
  channel: config.channels,
  data: onRecieveMessage,
  error: console.log,
});

const repeated = {}; 

function onRecieveMessage(msg){
  const id = msg.message;
  if (!repeated[id]) {
    repeated[id] = 0;
  }

  repeated[id]++;

  if (msg.user === 'nightbot')
     return;
  
  // A message needs to be repeated at least twice in order
  // to be broadcast:
  if (repeated[id] < 2) return;

  io.clients((error, clients) => {
    if (!clients.length) return;
    const randomClient = clients[Math.floor(Math.random() * clients.length)];
    console.log(`Sending to client ${randomClient}: ${msg.message}`)
    io.to(randomClient).emit('message', msg.message);
  });

};