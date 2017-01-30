
var express = require('express');
var  db= require('./gestione');
 
var app = express();

app.get('/dato/tutti', function (req, res) {
	res.send(db.gestioneDati.tutti());
});

app.post('/dato/acquisisci/:dato', function (req, res) {
	db.gestioneDati.nuovo(req.params.dato);
	res.end();
});

app.listen(4156, function () {
  console.log('Server in esecuzione sulla porta 4156...');
  console.log('Per inviare dati tramite metodo Post: /dato/acquisisci/:dato');
  console.log('Per visualizzare l\'elenco di tutti i dati acquisiti tramite metodo Get: /dato/tutti'); 
});


