var gestioneDati={

		elenco:[
      /*{
        t: new Date(),
        temperature: 30
      },
      {
        t: new Date(),
        temperature: 35,
      }*/
    ],

		tutti: function()
		{
			return this.elenco
		},

		nuovo: function(ter)
		{
			nuovoDato = {
        t: new Date(),
        temperature: ter,
      };
			this.elenco.push(nuovoDato);
		},
};

exports.gestioneDati=gestioneDati;
