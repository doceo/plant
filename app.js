
var express = require('express');
var db= require('./gestione');
var io = require('socket.io')(server);
var server =require('http').Server(app);
 
var app = express();

app.get('/dato/tutti', function (req, res) {
	res.send(db.gestioneDati.tutti());
});

app.get('/', function(req, res){
	res.sendFile(__dirname+'/html/index.html');

});

app.post('/dato/acquisisci/:dato', function (req, res) {
	db.gestioneDati.nuovo(req.params.dato);
	res.end();
});


io.on('connection',function(socket){

  // all'avvio di una connessione viene creato un socket!

  console.log('user connected');


});

app.listen(4156, function () {
  console.log('Per inviare dati tramite metodo Post: /dato/acquisisci/:dato');
  console.log('Per visualizzare l\'elenco di tutti i dati acquisiti tramite metodo Get: /dato/tutti');
  console.log('...');
  console.log('Server in esecuzione sulla porta 4156...');
 
});


