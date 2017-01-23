var socket = io();
$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});
socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
});
socket.on('mouse coords', function(x,y){
  paint(canvas,x,y);
})

var paint = function(canvas,x,y){
  var dot = new fabric.Circle({
    radius: 2, fill: 'green', left: x, top: y
  });
  canvas.add(dot);
}




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


// Event Handling

var handleCoords = function(x,y){
  //socket.emit("mouse coords",x,y);
}

// make a move handler
var toMouseMoveHandler = function(canvas,func){
  return (
    function(options){
      // var x = canvas.getPointer(event.e).posX;
      // var y = canvas.getPointer(event.e).posY;
      var x = options.e.clientX;
      var y = options.e.clientY;
      func(x,y);
    }
  );
}

// create movement event handler
var moveHandler = toMouseMoveHandler(canvas,handleCoords);
// bind it to movement
canvas.on('mouse:move',moveHandler);

canvas.isDrawingMode=true;


canvas.on('path:created',function(event){
  console.log("object added event");
  console.log(event);
  var obj = event.path;
  var serialized = JSON.stringify(obj);
  socket.emit("object added",serialized);
});
socket.on('object added', function(serialized){
  console.log("deserializing " + serialized);
  //deserialize
  fabric.util.enlivenObjects([JSON.parse(serialized)],function(objects){
    var origRenderOnAddRemove = canvas.renderOnAddRemove;
    canvas.renderOnAddRemove = false;

    objects.forEach(function(o) {
      canvas.add(o);
    });

    canvas.renderOnAddRemove = origRenderOnAddRemove;
    canvas.renderAll();
  });
})

// canvas.on('mouse:down',function(event){canvas.isDrawingMode=true;});
// canvas.on('mouse:up',function(event){canvas.isDrawingMode=false;});