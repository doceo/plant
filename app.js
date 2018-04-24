const app = require('express')();
const log=require('morgan');
const path=require('path');

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


var db;

var Ntemp = 50;


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
var mqttClient = mqtt.connect('mqtt://192.168.1.100:1883', {
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
  path.resolve( __dirname,'html','testChart.html')
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
  	var dato = msg.split(",");
  
 
	dato.forEach(function (record){
//	console.log("messaggio ricevuto:");
//	console.log(record);
	});

	var data =dato[4].split("-");

	data.forEach(function (record){
//	console.log("conversione: " + record +" in " + parseInt(record));

	});
	
//	var dataAcq = new Date(parseInt(data[0],10),parseInt(data[1]-1,10),parseInt(data[2],10),parseInt(data[3],10),parseInt(data[4],10),parseInt(data[5],10));

	var dataAcq = new Date();

//	console.log("il tipo che arriva è: " + typeof(dato[4]));

//	console.log("il dato ricevuto è: " + dato[4]);
	
//	dataAcq =new Date('String(dato[4])');
//	console.log("la data generata: " + dataAcq);	
//	console.log("il formato data è: " + Date());

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

	//creo la variabile temp estrapolando i pezzi del vettore
	var temp = {
    	postazione: parseInt(dato[0]),
    	temperature: parseFloat(dato[1]),
    	data: dataAcq,
  	};

	//inserisco nel DB
  	db.collection('temp').insert(temp);
//  	console.log('acquisisco temperatura');
//	console.log(temp);
	//invio il nuovo dato al client collegato
//  	io.emit('newTemperature', temp);

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


});




io.on('connection', function (socket) {
  console.log('richiesta di connessione dal client');
  console.log('invio tutte le temperature');

  db.collection('temp').find({},{sort:{data:-1}}).limit(Ntemp).toArray( function (err, result) {
//  console.log(result);
   socket.emit('temp', result.reverse());
  });
 db.collection('Humidity').find({},{sort:{data:-1}}).limit(Ntemp).toArray( function (err, result) {
//  console.log(result);
   socket.emit('humid', result.reverse());
  });
 db.collection('HygroThermal').find({},{sort:{data:-1}}).limit(Ntemp).toArray( function (err, result) {
//  console.log(result);
   socket.emit('hygro', result.reverse());
  });

 db.collection('temp').find({},{sort:{data:-1}}).limit(Ntemp).toArray( function (err, result) {
//  console.log(result);
//   console.log(result);
  });


});