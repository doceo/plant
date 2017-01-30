var gestioneDati={
		
		elenco:[],
		
		tutti: function()
		{
			return this.elenco
		},

		nuovo: function(ter)
		{
			nuovoDato = {terreno: ter};
			this.elenco.push(nuovoDato);
		},
};

exports.gestioneDati=gestioneDati;
