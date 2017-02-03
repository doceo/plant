var app = require('express')();

var server = require('http').Server(app);

var io = require('socket.io')(server);

var db = require('./gestione');

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/html/index.html');
});

app.get('/dato/acquisisci/:dato', function (req, res) {
  db.gestioneDati.nuovo(req.params.dato);
  res.end();
});

/*app.get('/dato/tutti', function (req, res) {
	res.send(db.gestioneDati.tutti());
});*/

io.on('connection', function (socket) {
  console.log('connessione dal client');
  //socket.emit('news', {hello: 'world' });
  io.emit('news', {hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

server.listen(3000, function () {
  console.log('Per inviare dati tramite metodo GET: /dato/acquisisci/:dato');
  //console.log('Per visualizzare l\'elenco di tutti i dati acquisiti tramite metodo GET: /dato/tutti');
  console.log('...');
  console.log('Server in esecuzione sulla porta 3000...');
});
