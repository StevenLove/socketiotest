var socket = io();
$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});
socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
});




// fabric
var canvas = new fabric.Canvas('c');
// canvas.isDrawingMode=true;

var circle = new fabric.Circle({
  radius: 20, fill: 'green', left: 100, top: 100
});
var triangle = new fabric.Triangle({
  width: 20, height: 30, fill: 'blue', left: 50, top: 50
});

canvas.add(circle, triangle);
