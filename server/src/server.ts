import * as express from 'express'
import * as http from 'http'
import * as WebSocket from 'ws'

const app = express()

// init the server

const server = http.createServer(app)

// init the WS server

const wss = new WebSocket.Server({ server })

interface ExtWebSocket extends WebSocket {
  isAlive?: boolean;
}


wss.on('connection', (ws: ExtWebSocket) => {
  // connection is up.

  ws.isAlive = true;

  ws.on('pong', () => {
    console.log('pinged')
    ws.isAlive = true;
  });

  ws.on('message', (message: string) => {

    //log the received message and send it back to the client
    console.log('received: %s', message);

    const broadcastRegex = /^broadcast\:/;

    if (broadcastRegex.test(message)) {
      message = message.replace(broadcastRegex, '');

      //send back the message to the other clients
      wss.clients
        .forEach(client => {
          if (client != ws) {
            client.send(`Hello, broadcast message -> ${message}`);
          }    
        });
        
    } else {
      ws.send(`Hello, you sent -> ${message}`);
    }
});

  //send immediatly a feedback to the incoming connection    
  ws.send('Hi there, I am a WebSocket server');
})

setInterval(() => {
  wss.clients.forEach((ws: ExtWebSocket) => {
    
    if (!ws.isAlive) return ws.terminate();
    
    ws.isAlive = false;
    ws.ping(null, false);

  });
}, 10000);

server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${process.env.PORT || 8999} :)`);
});
