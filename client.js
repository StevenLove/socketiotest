var socket = io();
$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});
socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
});
socket.on('transaction', function(t){
  console.log(t);
})

// capture a keypress anywhere
// 37 = left
// 38 = up
// 39 = right
// 40 = down


// Capture input from keyboard
var heldKeys = Array(256).fill(false);

var processKeyEvent = function(event){
  var transaction = transactionFromEvent(event);
  socket.emit("transaction",transaction);
}

$(document).keyup(function(event){
  var keyID = event.which;
  // make note that we're no longer holding the key down
  heldKeys[keyID] = false;
  processKeyEvent(event);
});

$(document).keydown(function(event){
  var keyID = event.which;
  // If the key is already being pressed, don't fire another event
  if(heldKeys[keyID]){
    return;
  }
  // make note that we're holding the key down
  heldKeys[keyID] = true;
  processKeyEvent(event);
});

// transactions



var transactionFromEvent = function(event){
  var keyID = event.which;
  var timestamp = event.timeStamp;
  var type = event.type;
  return createTransaction(keyID,type,timestamp);
}
var createTransaction = function(keyID,type,timestamp){
  // assert(type === "keyup" || type === "keydown");
  return {
    key: keyID,
    type: type,
    timestamp: timestamp
  }
}