# Change Log

## [Unreleased]
- modificati i grafici
- risolto il bug dell'invio dei dati, adesso non vengono mandati in brodcast ma solo al singolo client che si connette

## [2.0]
- aggiunta la possibilità di acquisire dati da più client, in particolare è presente il codice per farlo con nodeMCU e arduino YUN
- salvataggio dei dati in un DB Mongo
- i dati vengono visualizzato in tre grafici differenti

### Changed
- non vengono inviati tutti i dati del DB ma solo gli ultimi 100

## [1.0]
- app.js acquisisce dati da client e li memorizza finchè rimane in esecuzione
- app.js invia index.html alla prima richiesta di connessione da parte di un web client
- il file index.html elabora il file inviato tramite connessione socket e li organizza in un grafico
- ad ogni invio di dati da parte di un client app.js invia il dato ai web client connessi che aggiornano in tempo reale il grafico visualizzato

da notare che 
- per il caricamento di dati è stata usata una GET teoricamente non corretta per permettere un più facile test effettuabile via browser
