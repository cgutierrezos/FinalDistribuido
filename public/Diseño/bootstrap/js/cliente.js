alert("sadasdasdasdsa");
var socket = io();
socket.emit('cliente');


function hacerresta()
{
    //valor de numero1
    //valor de numero2
    var numero1=document.getElementById("restanumero1").value;
    var numero2=document.getElementById("restanumero2").value;
    socket.emit('resta', { numero1:numero1,numero2:numero2 });
}


function hacerproducto()
{
    //valor de numero1
    //valor de numero2
    var numero1=document.getElementById("productonumero1").value;
    var numero2=document.getElementById("productonumero2").value;
    socket.emit('producto', { numero1:numero1,numero2:numero2 });
}


function prueba_broadcast(argument) {
    var numero1=document.getElementById("productonumero1").value;
    var numero2=document.getElementById("productonumero2").value;
     socket.emit('mensajebroadcast', { numero1:numero1,numero2:numero2 })
}

function hacerpotencia()
{
    //valor de numero1
    //valor de numero2
    var numero1=document.getElementById("potencianumero1").value;
    var numero2=document.getElementById("potencianumero2").value;
    socket.emit('potencia', { numero1:numero1,numero2:numero2 });
}


function prueba_canal()
{
 var numero1=document.getElementById("productonumero1").value;
 var numero2=document.getElementById("productonumero2").value;
 socket.emit('canal', { numero1:numero1,numero2:numero2 })
}


socket.on("broadcast",function(data){
  var capa = document.getElementById("capa");
  var h1 = document.createElement("h1");
  h1.innerHTML = "Se Mando un broadcast";
  capa.appendChild(h1);
});



// socket.on("canaliti",function(data){
//   var capa = document.getElementById("capa");
//   var h1 = document.createElement("h1");
//   h1.innerHTML = "Se Mando un canaliti";
//   capa.appendChild(h1);
// });


