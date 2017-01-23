// This is a test application to investigate usage of socket.io

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var indexFilename = 'index.html';
var indexAbsPath = __dirname + '/' + indexFilename;

app.get('/', function(req, res){
  res.sendFile(indexAbsPath);
});

var clientjsFilename = 'client.js';
var clientjsAbsPath = __dirname + "/" + clientjsFilename;

app.get('/client.js', function(req,res){
  res.sendFile(clientjsAbsPath);
})

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on('mouse coords', function(x,y){
    io.emit('mouse coords', x, y);
  })
  socket.on('object added', function(serialized){
    console.log("obj added");
    socket.broadcast.emit('object added', serialized);
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});