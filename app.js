const app = require('express')();
const log=require('morgan');
const path=require('path');

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


var db;

app.use(log('dev'));
//connessione del client a mongodb
MongoClient.connect('mongodb://192.168.40.55:27017/terreno', function (err, database) {

  if (err) return console.log(err)
  db = database;
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



app.get('/', function(req, res) {
  res.sendFile(
  path.resolve( __dirname,'html','index.html')
  );
});

/*app.get('/temperatura', function(req, res) {
  res.sendFile(__dirname+'/html/temperatura.html');
});*/

app.get('/report', function(req, res) {
  res.sendFile(
  path.resolve( __dirname,'html','report.html')
  );
  });
  
  app.get('/admin', function(req, res) {
  res.sendFile(
  path.resolve( __dirname,'html','admin.html')
  );
});
 

/* abbiamo usato una GET ma sarebbe più opportuno usare il metodo POST. la scelta del 
GETperchè risulta più comodo nel caso 
non si disponga di dispositivi fisici e si voglia testare l'applicativo da browser*/
app.get('/acquisisci/:sensore/:postazione/:dato', function (req, res) {
  res.end();
    if(req.params.sensore=="temp")
	{
		console.log('sensore temperatura');
	
		
  var data = {
    t: new Date(),
    valore: parseInt(req.params.dato),
    postazione: parseInt(req.params.postazione),
  };
  db.collection('temp').insert(data);
  console.log('acquisisco valore');

  io.emit('newTemperature', data);
	}
	else if(req.params.sensore=="humid")
	{
		console.log('sensore umidità aria');
	
		
  var data = {
    t: new Date(),
    valore: parseInt(req.params.dato),
    postazione: parseInt(req.params.postazione),
  };
  db.collection('humid').insert(data);
  console.log('acquisisco valore');

  io.emit('newTemperature', data);
	}
		else if(req.params.sensore=="hygro")
	{
		console.log('Sensore umidità terreno');
	
		
  var data = {
    t: new Date(),
    valore: parseInt(req.params.dato),
    postazione: parseInt(req.params.postazione),
  };
  db.collection('hygro').insert(data);
  console.log('acquisisco valore');

  io.emit('newTemperature', data);
	}
		
	else{console.log('postazione non esistente');
		
	}
	
		
});


mqttClient.on('message', (topic, message) => {  
  console.log(`Received message: '${message}'`);
  
  	var msg = (message).toString();
  	var dati = msg.split("/");
  
  	console.log(dati[0]);
  	console.log(dati[1]);

	var data = {
    	t: new Date(),
    	valore: dati[1],
    	sensore : dati[0],
  	};
  	db.collection('temperatures').insert(valore);
  	console.log('acquisisco valore');

  	io.emit('newTemperature', valore);
});




io.on('connection', function (socket) {
  console.log('richiesta di connessione dal client');
  console.log('invio tutte le temperature');
  db.collection('temperatures').find({},{sort:{t:-1}}).limit(150).toArray( function (err, result) {
    socket.emit('temperatures', result.reverse());
  });
});