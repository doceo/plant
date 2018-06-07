function invia(){
 nVal = parseInt($("#num").val());
 console.log(nVal);

 if (nVal == 0){
//         document.getElementById("error").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">si è scelto un valore nullo</div>";
  alert("hai inserito un valore nullo");
 }else{
 $.post("nval",

     { 
  numV: nVal,

       });

 }
};

function invia2(){
	dataIn = new Date($("#datain").val());
	dataOut = new Date($("#dataout").val());


	//ordinare le date
	if(dataOut < dataIn){
		var temp = dataIn;
		dataIn = dataOut;
		dataOut = temp;
	}

	console.log(dataIn);

	$.post("range",

	    {	
		dataIn: dataIn,
		dataOut: dataOut,
  	});
	
};



function VerificaRicerca(data){
	if (data.length == 0){
		alert("in questo range non ci sono rilevazioni");
	}
};
</script>

<script>
function AverageP1(data){
    Nel = data.length;
    console.log(Nel);

if (data.length!=0){
    	data.forEach(function (record){
             tempM1 = tempM1 + record.temperature;
             humidM1 = humidM1 + record.humidity;
             hygroM1 = hygroM1 + record.hygroThermal;

	     console.log(record);
             });

             tempM1 = parseInt(10*tempM1/Nel)/10;
             humidM1 = parseInt(10*humidM1/Nel)/10;
             hygroM1 = parseInt(10*hygroM1/Nel)/10;

	     console.log(tempM1);
	     console.log(humidM1);
	     console.log(hygroM1);
             
             document.getElementById("tempM1").innerHTML = tempM1;
             document.getElementById("humidM1").innerHTML = humidM1;
             document.getElementById("hygroM1").innerHTML = hygroM1;
}
};

  function AverageP2(data){
              Nel = data.length;
    console.log(Nel);

if (data.length!=0){
    	data.forEach(function (record){
             tempM2 = tempM2 + record.temperature;
             humidM2 = humidM2 + record.humidity;
             hygroM2 = hygroM2 + record.hygroThermal;

	     console.log(record);
             });

             tempM2 = parseInt(10*tempM2/Nel)/10;
             humidM2 = parseInt(10*humidM2/Nel)/10;
             hygroM2 = parseInt(10*hygroM2/Nel)/10;

	     console.log(tempM2);
	     console.log(humidM2);
	     console.log(hygroM2);
             
             document.getElementById("tempM2").innerHTML = tempM1;
             document.getElementById("humidM2").innerHTML = humidM1;
             document.getElementById("hygroM2").innerHTML = hygroM1;
}
        };
		
		
		  function AverageP3(data){
         Nel = data.length;
    console.log(Nel);

if (data.length!=0){
    	data.forEach(function (record){
             tempM3 = tempM3 + record.temperature;
             humidM3 = humidM3 + record.humidity;
             hygroM3 = hygroM3 + record.hygroThermal;

	     console.log(record);
             });

             tempM3 = parseInt(10*tempM3/Nel)/10;
             humidM3 = parseInt(10*humidM3/Nel)/10;
             hygroM3 = parseInt(10*hygroM3/Nel)/10;

	     console.log(tempM3);
	     console.log(humidM3);
	     console.log(hygroM3);
             
             document.getElementById("tempM3").innerHTML = tempM3;
             document.getElementById("humidM3").innerHTML = humidM3;
             document.getElementById("hygroM3").innerHTML = hygroM3;
}
        };
		
	