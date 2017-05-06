# Change Log

## [Unreleased]
- aggiunta la possibilità di acquisire dati da più client, in particolare è presente il codice per farlo con nodeMCU e arduino YUN
- salvataggio dei dati in un DB Mongo

### Changed
- non vengono inviati tutti i dati del DB ma solo gli ultimi 50

## [1.0]
- app.js acquisisce dati da client e li memorizza finchè rimane in esecuzione
- app.js invia index.html alla prima richiesta di connessione da parte di un web client
- il file index.html elabora il file inviato tramite connessione socket e li organizza in un grafico
- ad ogni invio di dati da parte di un client app.js invia il dato ai web client connessi che aggiornano in tempo reale il grafico visualizzato

da notare che 
- per il caricamento di dati è stata usata una GET teoricamente non corretta per permettere un più facile test effettuabile via browser
