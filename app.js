const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const MongoClient = require('mongodb').MongoClient;

var db;

MongoClient.connect('mongodb://127.0.0.1:27017/terreno', function (err, database) {
  if (err) return console.log(err)
  db = database;
  server.listen(3000, function() {
    console.log('Server in ascolto sulla porta 3000 ...');
  });
});

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/html/index.html');
});


// abbiamo usato una GET ma sarebbe più opportuno usare il metodo POST. la scelta del GET
// perchè risulta più comodo nel caso non si disponga di dispositivi fisici e si voglia
// testare l'applicativo da browser
app.get('/acquisisci/:node/:dato', function (req, res) {
  res.end();

  var temperature = {
    t: new Date(),
    temperature: req.params.dato,
    pianta: req.params.node,
  };
  db.collection('temperatures').insert(temperature);

  io.emit('newTemperature', temperature);
});

io.on('connection', function (socket) {
  console.log('richiesta di connessione dal client');
  console.log('invio tutte le temperature');
  db.collection('temperatures').find().limit(50).toArray( function (err, result) {
    io.emit('temperatures', result);
  });
});
