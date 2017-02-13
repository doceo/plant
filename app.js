var app = require('express')();

var server = require('http').Server(app);

var io = require('socket.io')(server);

var db = require('./gestione');

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/html/index.html');
});

app.get('/dato/acquisisci/:dato', function (req, res) {
  var temperature = req.params.dato;
  db.gestioneDati.nuovo(temperature);
  res.end();

  io.emit('newTemperature', { t: new Date(), temperature: temperature });
});

io.on('connection', function (socket) {
  console.log('connessione dal client');
  console.log('invio tutte le temperature');
  io.emit('temperatures', db.gestioneDati.tutti());
});

server.listen(3000, function () {
  console.log('Per inviare dati tramite metodo GET: /dato/acquisisci/:dato');
  //console.log('Per visualizzare l\'elenco di tutti i dati acquisiti tramite metodo GET: /dato/tutti');
  console.log('...');
  console.log('Server in esecuzione sulla porta 3000...');
});
