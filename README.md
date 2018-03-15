 Autore: Diomede Mazzone con la collaborazione di Fabio Z Tessitore (@FabioZTessitore)

Tag: NodeJS, ExpressJS, Socket.io, HTML 5, client/server, MongoDB, Arduino Yun

Licenza: GPL 3.0 o successive

#PLANT

Questo pacchetto ha scopo didattico e si vogliono rappresentare le potenzialità di Node.js. L'istituto superiore Morano ha dato delle direttive per la realizzazione di una StartUp,
con l'obiettivo di riuscire a creare un sistema che raccolga dati logici per un particolare sensore di: umidità dell'aria, umidità del terreno e temperatura del terreno.
In tale progetto,la capacità progettuale d'implementazione fa la differenza. Per questo motivo, siamo stati divisi in gruppi  


##NodeMCU 

per configurarlo bisogna prima scaricare i driver
https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers

e poi, per comodita', abbiamo utilizzato l'ide di Arduino, debitamente onfigurato così come indicato nelle numerose guide on line.

##Arduino Yun

come ulteriore client utilizzato per la raccolta dei dati è stato utilizzato Arduino Yun.

##MQTT

permette la ricezione di dati tramite protocollo Mqtt. deve quindi potersi collegare ad un broker in ascolto sul topic sensore/valore.


##Node.js

va installato su una macchina e messo in ascolto sulla porta 3000, così come indicato nel pacchetto. riferimenti https://nodejs.org/en/docs/

##INSTALLAZIONE
per avviare il server bisogna procedere nel seguente modo:

1. Scaricare e installare la versione idonea di node ed npm: https://nodejs.org/it/download/
2. installare il framework express tramite il gestore dei pacchetti: npm install express
3. installare socket.io attraverso il gestore dei pacchetti: npm install socket.io

è possibile anche configurare tutto tramite npm install, a patto che il file package.json sia aggiornato nelle dipendenze necessarie.
 

a questo punto si potrà avviare il server:

node app.js

Da notare che su sistemi Debian Node viene avviato con nodejs app.js, in quanto node è un altro applicativo presente sui repository.
