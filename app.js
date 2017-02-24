
//inizializiamo le variabili relative ai moduli utili all anostra applicazione.

//il framework
var app = require('express')();

//il server
var server = require('http').Server(app);

//la gestione della comunicazione via socket
var io = require('socket.io')(server);

//la gestione delle informazioni. in questo caso è quasi fittizio, perchè non sono salvate in modo permanente.
var db = require('./gestione');

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/html/index.html');
});

// abbiamo usato una GET ma sarebbe più opportuno usare il metodo POST. la scelta del GET
// perchè risulta più comodo nel caso non si disponga di dispositivi fisici e si voglia 
// testare l'applicativo da browser
app.get('/dato/acquisisci/:dato', function (req, res) {
  var temperature = req.params.dato;
  db.gestioneDati.nuovo(temperature);
  console.log('acquisisco il dato');
  res.end();

  io.emit('newTemperature', { t: new Date(), temperature: temperature });
});

io.on('connection', function (socket) {
  console.log('richiesta di connessione dal client');
  console.log('invio tutte le temperature');
  io.emit('temperatures', db.gestioneDati.tutti());
});

server.listen(3000, function () {
  console.log('Per inviare dati tramite metodo GET: /dato/acquisisci/:dato');
  //console.log('Per visualizzare l\'elenco di tutti i dati acquisiti tramite metodo GET: /dato/tutti');
  console.log('...');
  console.log('Server in esecuzione sulla porta 3000...');
});
