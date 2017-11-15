import express from 'express';
import logger from 'morgan';
import http from 'http';
import WebSocket from 'ws';
import Mopidy from 'mopidy';
import StrToFunction from './lib/str-to-function';
import Broadcaster from './lib/broadcaster';

const app = express();
app.disable('x-powered-by');
app.use(function (req, res) { res.send({ msg: "WebSocket Only!" }); });
app.use(logger('dev', { skip: () => app.get('env') === 'test' }));

const { PORT = 8000 } = process.env;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const mopidy = new Mopidy({
  webSocketUrl: `ws://${process.env.WS_MOPIDY}/mopidy/ws/`,
  callingConvention: 'by-position-or-by-name'
});
const broadcast = new Broadcaster(data => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
});

mopidy.on('state:online', () => {
  console.log('mopidy online...');

  wss.on('connection', ws => {
    ws.on('message', payload => {
      const { key, params } = JSON.parse(payload);
      const apiCall = StrToFunction(mopidy, key);

      (params ? apiCall(params) : apiCall())
        .then(data => broadcast.all(key, data))
        .catch(console.error.bind(console))
        .done();
    });
  });

  broadcast.eventList.forEach(key => {
    mopidy.on(key, event => {
      broadcast.all(key, event);
    });
  });
});

export default server;
