##Procedura di sviluppo

per iniziare:
- fork da doceo/plant. Da fare una sola volta all'apertura dell'account
  si fa da account github
- clone in locale del repository remoto, da ripetere ogni volta che si cambia cartella e/o pc
  git clone http://github.com/TUOACCOUNT/plant

guide:
https://git-scm.com/book/it/v2/GitHub-Maintaining-a-Project
https://git-scm.com/book/it/v1/Basi-di-Git-Lavorare-coi-server-remote


per ogni features da realizzare:

1. aggiornamento all’ultima versione del branch master di doceo/plant 

  	per sapere quali sono i repository remoti associati:
	`git remote -v`
   
  	se il branch doceo/plant non è tra quelli che trovate allora bisogna aggiungerlo:
	git remote add upstream https://github.com/doceo/plant.git
  	
	adesso con git remote -v dovrebbe apparire 
  	guida di riferimento: https://help.github.com/articles/configuring-a-remote-for-a-fork/

	a questo punto si procede all'aggiornamento: 
	git pull upstream master

	se il merge crea conflitti non è un problema, apre una schermata che permette di scrivere un commento. con ctrl+x, chiude la schermata ma prima chiede di
	salvare. digitare yes e scaricherà tutti gli aggiornamenti. 
  
2. creazione del branch (il nome è legato alla features e può essere indicato nella issue da risolvere) 
        `git branch -b “nome branch”`

3. modificare i file che si devono modificare.

4. a prescindere dall'esito dei test è sempre bene salvare in modo remoto le modifiche così da poterle far vedere agli altri o comunque tenerne traccia.

	bisogna prima aggiungere i file modificati che si vogliono salvare.
	`git add "nome file"`
	`git commit -m "descrizione delle modifiche"`
	`git push origin "branch_creato"`

 5. effettuare una pull request attraverso github, se non ancora fatto.

##NOTE

- per scaricare gli aggiornamenti del mio repository devo entrare tramite terminale nella cartella di progetto e digitare
	`git pull`

- per scaricare un branch diverso dal master
	`git pull origin "branch"`

- per fare una pull request:
        
	Andare sulla pagina principale del repository

	Nel menù "branch", scegliere il branch     

	Fare clic su "Nuova pull request", a destra del menu Branch;

	Utilizzare il menu a discesa del branch di base per selezionare il branch sul quale unire le modifiche, per poi utilizzare il menu a discesa del branch di confronto per scegliere il branch dell'argomento su cui apportare le modifiche;

	Digitare un titolo ed una descrizione per la richiesta di pull request e mettere se possibile un riferimento alla issue che si sta risolvendo

	Cliccare su "Crea nuova pull request". 
