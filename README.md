 Autore: Diomede Mazzone con la collaborazione di Fabio Z Tessitore (@FabioZTessitore)

Tag: NodeJS, ExpressJS, Socket.io, HTML 5, client/server

Versione: 1

Licenza: GPL 3.0 o successive

#PLANT

questo pacchetto ha scopo didattico e si vogliono rappresentare le potenzialità di Node.js. A tal fine prevede uno script da lanciare su uno o più dispositivi IoT (nel nostro caso NodeMCU, che invia dati al server node, il quale li rappresenta sotto forma di grafico ad eventuali client collegati tramite web browser.

il server ascolta sulla porta 3000 sia i client che inviano i dati sia quelli che li ricevono sotto forma di pagina web.


##NodeMCU 

per installarlo bisogna prima scaricare i driver
https://www.silabs.com/products/development-tools/software/usb-to-uart-bridge-vcp-drivers

e poi, per comodita', abbiamo utilizzato l'ide di Arduino, debitamente onfigurato così come indicato nelle numerose guide on line.

##Node.js

va installato su una macchina e messo in ascolto sulla porta 3000, così come indicato nel pacchetto. riferimenti https://nodejs.org/en/docs/

##INSTALLAZIONE
per avviare il server bisogna procedere nel seguente modo:

1. Scaricare e installare la versione idonea di node ed npm: https://nodejs.org/it/download/
2. installare il framework express tramite il gestore dei pacchetti: npm intall express
3. installare socket.io attraverso il gestore dei pacchetti: npm install socket.io

a questo punto si potrà avviare il server:

node app.js
