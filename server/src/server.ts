import * as express from 'express'
import * as http from 'http'
import * as WebSocket from 'ws'

const app = express()

// init the server

const server = http.createServer(app)

// init the WS server

const wss = new WebSocket.Server({ server })

wss.on('connection', (ws: WebSocket) => {
  // connection is up.
  ws.on('message', (message: string) => {
    // log the message, pass it back to the client

    console.log('received: %s', message)
    ws.send('Hello, you sent -> ' + message)
  })

  //send immediatly a feedback to the incoming connection    
  ws.send('Hi there, I am a WebSocket server');
})

server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${process.env.PORT || 8999} :)`);
});
