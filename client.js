// State
// list of transactions
var state = [];
var addTransaction = function(transaction){
  state.push(transaction);
  // maintain all transactions in time order
  // todo: just insert this one in the right place
  // instead of sorting the whole list.
  state.sort(function(a,b){
    if(a.timestamp < b.timestamp){
      return -1;
    }
    else if(a.timestamp > b.timestamp){
      return 1;
    }
    else{
      return 0;
    }
  })
}
var getSids = function(time){
  var joins = state.filter(function(t){
    return t.timestamp <= time && t.action === "join";
  })
  console.log(joins);
  return joins.map(function(t){
    return t.sid;
  })
}
var getPlayerPosition = function(sid,time){
 // filter out other players
 var myMovements = state.filter(function(t){
 return t.sid === sid && t.timestamp <= time && (t.action === "start" || t.action === "stop");
 });

 var coords = {x:0,y:0};
 coords = myMovements.reduce(function(curCoords,curTransaction){
   var x = curCoords.x;
   var y = curCoords.y;
   var deltaX = 0;
   var deltaY = 0;
   if((curTransaction.direction === "right" && curTransaction.action === "start") || 
      (curTransaction.direction === "left"  && curTransaction.action === "stop")){
        deltaX = time - curTransaction.timestamp;
   }
   else if((curTransaction.direction === "left" && curTransaction.action === "start") || 
      (curTransaction.direction === "right"  && curTransaction.action === "stop")){
        deltaX = curTransaction.timestamp - time;
   }
   else if((curTransaction.direction === "up" && curTransaction.action === "start") || 
      (curTransaction.direction === "down"  && curTransaction.action === "stop")){
        deltaY = curTransaction.timestamp - time;
   }
   else if((curTransaction.direction === "down" && curTransaction.action === "start") || 
      (curTransaction.direction === "up"  && curTransaction.action === "stop")){
        deltaY = time - curTransaction.timestamp;
   }
   else{
     console.log(curTransaction);
     assert(false,"transaction not moving in any direction");
   }
   curCoords.x += deltaX/10;
   curCoords.y += deltaY/10;
   return curCoords;
 },coords);

  return coords;
}



// fabric
var canvas = new fabric.Canvas('c');
var maxPlayers = 10;
var colors = ["red","green","blue","black","yellow","purple","orange","pink","gray","teal"]
var circles = colors.map(function(v){
  return new fabric.Circle({
    radius: 2, fill: v, left: 0, top: 0
  })
})
circles.forEach(function(c){
  canvas.add(c);
});

console.log(canvas);

var refresh = function(){
  // console.log(state);
  var now = Date.now();
  var text = "";
  var sids = getSids(now);
  console.log(sids);
  sids.forEach(function(sid,index){
    var coords = getPlayerPosition(sid,now);
    console.log("index: " + index);
    canvas.item(index).set({left:coords.x});
    canvas.item(index).set({top:coords.y});
    text += "player: " + sid + ".  is at " + coords.x.toFixed(2) + "," + coords.y.toFixed(2) + "\r\n";
  })
    $("#out").text(text);
    $("#out").css("white-space","pre-line");
  canvas.renderAll();
}


var refreshRate = 50; //ms
setInterval(refresh,refreshRate);


















var socket = io();
var playerID = -1;
console.log(socket);
$('form').submit(function(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});
socket.on('playerIDAssignment',function(id){
  playerID = id;
});
socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
});
socket.on('transaction', function(t){
  // setTimeout(function(){addTransaction(t);},200);
  addTransaction(t);
})
socket.on('ready',function(){
  var myJoin = createJoinTransaction(Date.now());
  console.log(myJoin);
  socket.emit("transaction", myJoin);
})


// COMMANDS
// start moving left
// stop moving left
// start moving right
// stop moving right
// start moving up
// stop moving up
// start moving down
// start moving down
// add player
// remove player

// capture a keypress anywhere
// 37 = left
// 38 = up
// 39 = right
// 40 = down


// Capture input from keyboard
var heldKeys = Array(256).fill(false);
var validKeyIDs = [37,38,39,40];

var processKeyEvent = function(event){
  var keyID = event.which;
  if(validKeyIDs.includes(keyID)){
    var timestamp = Date.now();
    var type = event.type;
    var action;
    var direction;
    if(type === "keyup"){
      action = "stop";
    }
    else if(type === "keydown"){
      action = "start";
    }
    else{
      assert(false,"unsupported event trying to be converted to transaction");
    }
    if(keyID === 37) direction = "left";
    else if(keyID === 38) direction = "up";
    else if(keyID === 39) direction = "right";
    else if(keyID === 40) direction = "down";
    else{
      assert(false,"unsupported key ID trying to be converted to a transaction");
    }

    var transaction = createMovementTransaction(action,direction,timestamp);
    socket.emit("transaction",transaction);
  }
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
var createJoinTransaction = function(timestamp){
  return{
    action: "join",
    timestamp: timestamp,
    sid:socket.id
  }
}
var createMovementTransaction = function(action,direction,timestamp){
  return {
    action: action,
    direction:direction,
    timestamp: timestamp,
    sid: socket.id,
    pid: playerID
  }
}

