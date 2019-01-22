var socket = io();
socket.emit('cliente');
function agregarArchivo()
{

 var texto= $(".textcrear").val();
 if(texto=="")
 {
 	alert("ERROR:Nombre del archivo vacio");
 }
 else
 {
	socket.emit('creararchivo', {texto:texto});

 }
}


socket.on("documentos",function(data){
	
files=data;

function function_name(elements) {
	$(".files_content").empty();
	for(var i=0;i<elements.length;i++){
		if(elements[i].substring(elements[i].length-4, elements[i].length) == ".txt"){
			var element='<div class="file_struct" id="'+elements[i]+'" title="'+elements[i]+'">'+
						'<img src="../estatico/Diseño/img/logo.png" alt="File">'+
						'<span>'+elements[i]+'</span>'+
						'<div class="controls">'+
						'<button class="vew" title="Ver"><span class="glyphicon glyphicon-zoom-in"></span></button>'+
						'<button class="upgrade" title="Agregar"><span class="glyphicon glyphicon-refresh"></span></button>'+
						'<button class="delete" title="Eliminar" hidden><span class="glyphicon glyphicon-trash"></span></button></div></div>';
			$(".files_content").append(element);
		}
		else{  
		}
	}
}

function_name(files)

$(".file_struct .vew").click(function (element){
	var id= $(element.target).parents(".file_struct").attr("id")
	// $(".text").empty();
	//$(".text").text(id);


	socket.emit('lectura', { id:id});
});

$(".file_struct .upgrade").click(function (element){
	 var id= $(element.target).parents(".file_struct").attr("id")
	 // $(".text").empty();
	 var texto= $(".text1").val();
	 
	 if(texto=="")
	 {
	 	alert("ERROR:campo vacío")
	 }
	 else
	 {
		socket.emit('modificar', { id:id ,texto:texto});
	 }
});

$(".file_struct .delete").click(function (element){
	var id= $(element.target).parents(".file_struct").attr("id")
	socket.emit('eliminar', { id:id });
});

socket.on("lectura_cliente",function(data){
  $(".text").empty();
  //alert("oieme llego");

  var texto= $(".text").text()+data;

  //alert(texto);
  
  $(".text").text(texto)
});

socket.on("permisos",function(data){
	socket.emit('darpermisos');
});


});