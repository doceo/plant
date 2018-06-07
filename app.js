const app = require('express')();
const log=require('morgan');
const path=require('path');
const express = require('express');


const mqtt = require('mqtt');

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const MongoClient = require('mongodb').MongoClient;
//const ObjectId = require('mongodb').ObjectId;

var bodyParser = require('body-parser');
app.use(express.static('/js'));

var db;

var Ntemp = 50;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(log('dev'));
//connessione del client a mongodb
MongoClient.connect('mongodb://diomDB:Cawethubezt4Dro@ds237620.mlab.com:37620/heroku_zn28dl17', function (err, database) {

//MongoClient.connect('mongodb://127.0.0.1:27017/terreno', function (err, database) {



  if (err) return console.log(err)
  db = database;
  server.listen(3000, function() {
    console.log('Server in ascolto sulla porta 3000 ...');
  });
});




//rendo possibile il collegamento ad un broker mqtt esterno

//var mqtt = require('mqtt');  
//var mqttClient = mqtt.connect('mqtt://192.168.1.115:1883', {
//	clean: true,
//    clientId: 'nodeJS'
//});  


  var my_topic_name = 'diomede/f/acqDati';

  var client = mqtt.connect('mqtts://io.adafruit.com',{
    port: 8883,
    username: 'diomede',
    password: '30e0f9943a9243768e5c6af82fbbc16a'
  });


  client.on('connect', (connack) => {  
  if (connack.sessionPresent) {
    console.log('Already subbed, no subbing necessary');
  } else {
    console.log('First session! Subbing.');
    client.subscribe(my_topic_name, { qos: 2 });
  }
  });

  client.on('error', (error) => {
    console.log('MQTT Client Errored');
    console.log(error);
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
	console.log("dobbiamo cercare dati tra " + datain + " e " + dataout);
 

	db.collection('rilevazioni').find({postazione : 1,
					 data: { $gt: new Date(datain) , $lt: new Date(dataout) },						
						},
					{sort:{data:-1}}).toArray( function (err, result) {
//					console.log("ho recuperato " + result.length + " elementi di postazione 3");
	console.log("ho recuperato " + result.length + " elementi");
//	console.log(datain + " diventa " + new Date(datain));   	
	io.emit('postazioneUno', result.reverse());
	})

	db.collection('rilevazioni').find({postazione : 2,
					 data: { $gt: new Date(datain) , $lt: new Date(dataout) },						
						},
					{sort:{data:-1}}).toArray( function (err, result) {
//					console.log("ho recuperato " + result.length + " elementi di postazione 3");
	console.log("ho recuperato " + result.length + " elementi");
//	console.log(datain + " diventa " + new Date(datain));   	
	io.emit('postazioneDue', result.reverse());
	})
	
	db.collection('rilevazioni').find({postazione : 3,
					 data: { $gt: new Date(datain) , $lt: new Date(dataout) },						
						},
					{sort:{data:-1}}).toArray( function (err, result) {
//					console.log("ho recuperato " + result.length + " elementi di postazione 3");
	console.log("ho recuperato " + result.length + " elementi");
//	console.log(datain + " diventa " + new Date(datain));   	
	io.emit('postazioneTre', result.reverse(), console.log('Prova'));
	})
});  
  
client.on('message', (topic, message) => {  
  	console.log(`Received message: '${message}'`);
  
  	var msg = (message).toString();
  	var dato = msg.split(",");
	

//	var data =dato[4].split("-");
//	var dataAcq = new Date(parseInt(data[0]),parseInt(data[1]-1),parseInt(data[2]),
//	parseInt(data[3]),parseInt(data[4]),parseInt(data[5]));

/*utiliziamo la data generata dal server solo nel caso in cui il simulatore del client
non è ingrado di generarne una attendibile*/

	var dataAcq = new Date();

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

});


//invio vettori al client

io.on('connection', function (socket) {
  console.log('richiesta di connessione dal client');
  console.log('invio tutte le temperature');
  


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