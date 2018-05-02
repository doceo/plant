const app = require('express')();
const log=require('morgan');
const path=require('path');

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const MongoClient = require('mongodb').MongoClient;
//const ObjectId = require('mongodb').ObjectId;

var bodyParser = require('body-parser');

var db;

var Ntemp = 50;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(log('dev'));
//connessione del client a mongodb
MongoClient.connect('mongodb://127.0.0.1:27017/terreno', function (err, database) {

  if (err) return console.log(err)
  db = database;
  server.listen(3000, function() {
    console.log('Server in ascolto sulla porta 3000 ...');
  });
});




//rendo possibile il collegamento ad un broker mqtt esterno
var mqtt = require('mqtt');  
var mqttClient = mqtt.connect('mqtt://127.0.0.1:1883', {
	clean: true,
    clientId: 'nodeJS'
});  

mqttClient.on('connect', (connack) => {  
  if (connack.sessionPresent) {
    console.log('Already subbed, no subbing necessary');
  } else {
    console.log('First session! Subbing.');
    mqttClient.subscribe('acqDati', { qos: 2 });
  }
});



app.get('/', function(req, res) {
  res.sendFile(
  path.resolve( __dirname,'html','index.html')
  );
});

/*questa rotta sarà utilizzata quando verrà implementata la scelta
dell'utente del numero di valori da visualizzare*/

app.post('/nval', function(req, res) {
  	console.log("ricevuto");
  	var nVal = parseInt(req.body.numV);
	console.log(nVal);

//	res.send();
//	Ntemp = nVal;

	db.collection('rilevazioni').find({postazione : 1},{sort:{data:-1}}).limit(nVal).toArray( function (err, result) {
		console.log("ho recuperato " + result.length + " elementi di postazione 1");
   		io.emit('nValUno', result.reverse());
	});
	db.collection('rilevazioni').find({postazione : 2},{sort:{data:-1}}).limit(nVal).toArray( function (err, result) {
		console.log("ho recuperato " + result.length + " elementi di postazione 2");
   		io.emit('nValDue', result.reverse());
	});
	db.collection('rilevazioni').find({postazione : 3},{sort:{data:-1}}).limit(nVal).toArray( function (err, result) {
		console.log("ho recuperato " + result.length + " elementi di postazione 3");
   		io.emit('nValTre', result.reverse());
	});

res.send("ricevuti i dati");
});



app.get('/report', function(req, res) {
  res.sendFile(
  path.resolve( __dirname,'html','report.html')
  );
  });
 
/*questa rotta sarà utilizzata quando verrà realizzata la scelta
di un range temporale entro cui visualizzare i dati*/

app.post('/range', function(req, res) {

	var datain = req.body.dataIn;
  	var dataout = req.body.dataOut;
//	console.log(datain.toUTCString());
	console.log(dataout);
  	res = 13;

	db.collection('rilevazioni').find({postazione : 1,
					 data: { $gt: new Date(datain) },
					 data: { $lt: new Date(dataout) },						
						},
					{sort:{data:-1}}).toArray( function (err, result) {
					console.log("ho recuperato " + result.length + " elementi di postazione 3");
	console.log(result.length);
	console.log(datain + " diventa " + Date(datain));   	
	io.emit('nValTre', result.reverse());
	})

});  
  
mqttClient.on('message', (topic, message) => {  
  	console.log(`Received message: '${message}'`);
  
  	var msg = (message).toString();
  	var dato = msg.split(",");
	

	var data =dato[4].split("-");
	var dataAcq = new Date(parseInt(data[0]),parseInt(data[1]-1),parseInt(data[2]),
	parseInt(data[3]),parseInt(data[4]),parseInt(data[5]));

/*utiliziamo la data generata dal server solo nel caso in cui il simulatore del client
non è ingrado di generarne una attendibile*/

//	var dataAcq = new Date();

	console.log("");
	console.log("");	

	//creo una variabile che racchiude tutto e la invio al client
	var nuovoDato = {
    	postazione: parseInt(dato[0]),
    	temperature: parseFloat(dato[1]),
    	humidity: parseFloat(dato[2]),
    	hygroThermal: parseFloat(dato[3]),
    	data: dataAcq,
  	};

  	io.emit('newData', nuovoDato);

	console.log(nuovoDato);
	db.collection('rilevazioni').insert(nuovoDato);
/*
tutta la parte seguente commentata serviva prima della modifica strutturale
delle variabili e degli insert nel DB

	
	//creo la variabile temp estrapolando i pezzi del vettore
	var temp = {
    	postazione: parseInt(dato[0]),
    	temperature: parseFloat(dato[1]),
    	data: dataAcq,
  	};

	//inserisco nel DB
  	db.collection('temp').insert(temp);

	var humid = {
    	postazione: parseInt(dato[0]),
    	humidity: parseFloat(dato[2]),
    	data: dataAcq,
  	};
  	db.collection('Humidity').insert(humid);
//  	console.log('acquisisco Umidità');
//  	io.emit('newHumid', humid);


	var hygro = {
    	postazione: parseInt(dato[0]),

    	hygroThermal: parseFloat(dato[3]),
    	data: dataAcq,
  	};
  	db.collection('HygroThermal').insert(hygro);
//  	console.log('acquisisco umidità del terreno');
//  	io.emit('newHygro', hygro);
*/

});


//invio vettori al client

io.on('connection', function (socket) {
  console.log('richiesta di connessione dal client');
  console.log('invio tutte le temperature');
  
//db.collection('rilevazioni').find({postazione : 1},{sort:{data:-1}}).limit(Ntemp).toArray( function (err, result) {
//  console.log(result);
//   socket.emit('postazioneUno', result.reverse());
//  });

db.collection('rilevazioni').find({postazione : 1},{sort:{data:-1}}).limit(Ntemp).toArray( function (err, result) {
//  console.log(result);
   socket.emit('postazioneUno', result.reverse());
  });

  
db.collection('rilevazioni').find({postazione : 2},{sort:{data:-1}}).limit(Ntemp).toArray( function (err, result) {
//  console.log(result);
   socket.emit('postazioneDue', result.reverse());
  });
  
  db.collection('rilevazioni').find({postazione : 3},{sort:{data:-1}}).limit(Ntemp).toArray( function (err, result) {
//  console.log(result);

   socket.emit('postazioneTre', result.reverse());
  });
  


});

//});