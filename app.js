const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
//const MongoClient = require('mongodb').MongoClient;

var db;

//MongoClient.connect('mongodb://127.0.0.1:27017/terreno', function (err, database) {
//MongoClient.connect('mongodb://172.17.0.:27017/terreno', function (err, database) {
  if (err) return console.log(err)
  //db = database;
  server.listen(3000, function() {
    console.log('Server in ascolto sulla porta 3000 ...');
  });
});


//rendo possibile il collegamento ad un broker mqtt esterno
var mqtt = require('mqtt');  
var mqttClient = mqtt.connect('mqtt://localhost:1883', {
	clean: true,
    clientId: 'nodeJS'
});  

mqttClient.on('connect', (connack) => {  
  if (connack.sessionPresent) {
    console.log('Already subbed, no subbing necessary');
  } else {
    console.log('First session! Subbing.');
    mqttClient.subscribe('sensore/valore', { qos: 2 });
  }
});



/*app.get('/', function(req, res) {
  res.sendFile(__dirname+'/html/index.html');
});

app.get('/temperatura', function(req, res) {
  res.sendFile(__dirname+'/html/temperatura.html');
});*/

// abbiamo usato una GET ma sarebbe più opportuno usare il metodo POST. la scelta del GET
// perchè risulta più comodo nel caso non si disponga di dispositivi fisici e si voglia
// testare l'applicativo da browser
app.get('/acquisisci/:node/:dato', function (req, res) {
  res.end();

  var temperature = {
    t: new Date(),
    temperature: parseInt(req.params.dato),
    pianta: parseInt(req.params.node),
  };
  /*db.collection('temperatures').insert(temperature);
  console.log('acquisisco valore');

  io.emit('newTemperature', temperature);
});*/


mqttClient.on('message', (topic, message) => {  
  console.log(`Received message: '${message}'`);
  
  	var msg = (message).toString();
  	var dati = msg.split("/");
  
  	console.log(dati[0]);
  	console.log(dati[1]);

	var temperature = {
    	t: new Date(),
    	temperature: dati[1],
    	pianta: dati[0],
  	};
  	//db.collection('temperatures').insert(temperature);
  	console.log('acquisisco valore');

  	io.emit('newTemperature', temperature);
});




io.on('connection', function (socket) {
  console.log('richiesta di connessione dal client');
  console.log('invio tutte le temperature');
 // db.collection('temperatures').find({},{sort:{t:-1}}).limit(150).toArray( function (err, result) {
    socket.emit('temperatures', result.reverse());
  });
});

