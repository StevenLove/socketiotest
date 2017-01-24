DESCRIPTION
This is a test project working with socket.io
This is based off of the tutorial chat program from http://socket.io/get-started/chat/ with some refactoring

USAGE
build the project
run the server
visit the page with your browser, with multiple tabs if you want
chatting on one tab will update other tabs!

BUILDING
>>npm install

RUNNING
>>node server.js
point browser to localhost:3000/

behind the scenes
for moving a square around
the client presses a key which sends a message through the socket
the message consists of the key, whether it was up or down, and the time it happened
the server broadcasts this to all clients
each client calculates the new state of the object that moved
by doing math, figuring out how much time has passed since they started pressing the key
then draw the square at that location
every couple of ms, the clients should update their idea of where everything is

