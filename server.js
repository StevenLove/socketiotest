// This is a test application to investigate usage of socket.io

// Express.js
// this is a library that makes it easier to set up normal web functionality
var app = require('express')();
var http = require('http').Server(app);
// Socket.io
// this is a library that allows real-time 2-way communication, like for a game
var io = require('socket.io')(http);

// using Express...
// the app.get function allows you to program what you send to a client when they visit a given URL
// the first argument is the relative URL, so '/' is the root, at "http://my-url/"
// the second argument is a function that determines what you do when someone goes there
// that function takes two arguments, objects that represent the request and the response
app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});

app.get('/client.js', function(req,res){
  res.sendFile(__dirname+'/client.js');
})

var transactions = [];
//Using Socket.io...

io.on('connection', function(socket){
  console.log('a user connected');
  transactions.forEach(function(t){
    socket.emit("transaction",t);
  })
  // io.emit("transaction",socket.id);

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
  socket.on("transaction", function(t){
    transactions.push(t);
    io.emit("transaction",t);
  })

  socket.emit("ready");
});

//State management
var numPlayers = 0;

//This actually tells your program to listen to a port
var port = 3000;
http.listen(port, function(){
  console.log('listening on *:' + port);
});