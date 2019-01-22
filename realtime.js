let fs = require('fs');
//SERVIDOR  INTERMEDIO

function Queue() {
    var elements = [];
    this.add = add;
    this.remove = remove;
    this.getFrontElement = getFrontElement;
    this.hasElements = hasElements;
    this.removeAll = removeAll;
    this.size = size;
    this.toString = toString;
    this.retornarelemento=retornarelemento;
    this.eliminar=eliminar;
    
    function add(element) {
        elements.push(element);
    }
 
    function remove() {
        return elements.shift();
    }
 
    function getFrontElement() {
        return elements[0];
    }
   
 
    function hasElements() {
        return elements.length > 0;
    }
 
    function removeAll() {
        elements = [];
    }
 
    function size() {
        return elements.length;
    }
    
    function retornarelemento(i) {
        return elements[i];
    }

    function toString() {
        console.log(elements.toString());
    }
   
    function eliminar(pos)
    {
          elements.splice( pos, 1 );

    }
  
 
}

module.exports =function(server,sessionMiddleware) {
 var io = require("socket.io")(server);
 var lista_sockets = [];
 var archivos = [];
 var listaDocumentosServidor=["archivo1.txt","archivo2.txt"];
 var colapeticiones = []; 
 var cola_peticiones = new Queue();
 var OrdenEdicion=[];
  

function ipUsuario(socket) {
    	var iplogaritmo = socket.request.connection.remoteAddress;
    	iplogaritmo = iplogaritmo.split(":");
    	iplogaritmo = iplogaritmo[3];
     return iplogaritmo;
}

function eliminarsoket ( arr, item ) {
    var i = arr.indexOf( item );
    if ( i !== -1 ) 
    {
        arr.splice( i, 1 );
    }
}
function eliminarArchivo ( arr, item ) 
{
     var i = arr.indexOf( item );
     if ( i !== -1 ) 
     {
         arr.splice( i, 1 );
     }
 }
function eliminarArchivocolas( arr, item ) 
{

    var i = arr.indexOf( item );
    if ( i !== -1 ) 
    {
        arr.splice( i, 1 );
    }
}
function ListaConectados() 
{
 for (var i = 0; i < lista_sockets.length; i++)
 {
   console.log(i+" = "+lista_sockets[i].id);
 }
}
function puedoLeer(elemento)
{
 for (var i = 0; i < archivos.length; i++) 
 {
   if(archivos[i]==elemento)
   {return false;}
 }
return true;
}

function peticion_soket(soket,cola)
{
  for (var i = 0; i < cola.size();  i++) 
  {   
    if(cola.retornarelemento(i)[1]==soket)
    {
       return false;
    }
  }
  return true;
}

function mandarelementoscola(cola)
{
  for (var i = cola.size()-1; i >= 0;  i--)  //EROR DE TAMAÑO OJO AL QUITAR UN ELEMENTO EL SIZE DIM
  {   
     if(puedoLeer(cola.retornarelemento(i)[0]))
     {  
        var soketvalor=cola.retornarelemento(i);
        var archi=cola.retornarelemento(i)[0];
        cola.eliminar(i);
                     io.in(soketvalor[1]).emit("lectura_cliente","El arhivo  "+archi+" ya fue liberado para su edicion");
                     cadena = archi.split(".");
                     fs.writeFile(cadena[0]+"TSL.txt", "0", function (err) {
                         console.log("Elemento liberado "+archi);});    
     }
  }
}

function getRandomArbitrary(min, max) {
  return  parseInt(Math.random() * (max - min) + min);
}

function crearPermisos(listaPermisos,ListaArchivos)
{
    for (var i = 0; i < ListaArchivos.length; i++) {
        listaPermisos.push(getRandomArbitrary(1,4))
        //listaPermisos.push(4);
    }

    return listaPermisos;
}

function miArchivo(archivo,MisArchivos)
{
    for (var i = 0; i < MisArchivos.length; i++) {
        if(archivo==MisArchivos[i])
        {return true;}
    }
    return false;
}

io.sockets.on("connection",function(socket){

  lista_sockets.push(socket); 
  ListaConectados();
  socket.join(socket.id);
  socket.misDocumentos=[];
  socket.misPermisos=[];
  socket.cantidadArchivos=2;
  socket.cantidadCopias=3;

  console.log("Se conecto usuario: "+ipUsuario(socket));
  socket.misPermisos=crearPermisos(socket.misPermisos,listaDocumentosServidor);
  io.emit("documentos",listaDocumentosServidor);//ENVIAR TODOS LOS DOCUMENTOS AL CLIENTES
    
 socket.on('disconnect', function () 
 {
  console.log("Se desconecto "+ipUsuario(socket));
  eliminarsoket(lista_sockets,socket);
 });

 socket.on('lectura', function (data) 
 {
    
    var permisosusuario=false;
    var miarchivo=false;
 
    
  if(miArchivo(data.id,socket.misDocumentos))
  {
    miarchivo=true;
  }
  else
  {
        var i = listaDocumentosServidor.indexOf(data.id);
        var permi= socket.misPermisos[i];
        if(permi>=2)
        {
          permisosusuario=true;  
        }
  }
  
  
if(permisosusuario==true || miarchivo==true)    
  {console.log("lectura del archivo "+data.id+" cliente = "+socket.id );
    
    fs.readFile(data.id, 'utf-8', (err, data) => {
      if(err) {
         console.log('error: ', err);
      } else 
      {
                if(miarchivo)
                {
        		    io.in(socket.id).emit("lectura_cliente","PROPIETARIO : "+data);
                }
                else
                {
                  	io.in(socket.id).emit("lectura_cliente",data);  
                }
              
                     
               
       fs.readFile("log.txt", 'utf-8', (err, data2) => {
      if(err) {
         console.log('error: ', err);
      } 
      else 
      {
           var  d = new  Date();
               
                fs.writeFile("log.txt",data2+"Se LEE el archivo"+data.texto+".txt"+"del cliente "+socket.id+"la hora:"+d.getHours()+":"+d.getMinutes()+"\n", function (err) {
                if (err) throw err;
                console.log('modifico log  '+data.id+" "+data.texto);
               }); 
      }
      });
        
      }
   });
  }
  else
  {
      
   	io.in(socket.id).emit("lectura_cliente","No tiene permisos de lectura");
      
  }
   
 });
 
 socket.on('modificar', function (data) 
 { 
  var permisosusuario=false;
  var miarchivo=false;
 
  if(miArchivo(data.id,socket.misDocumentos))
  {
    miarchivo=true;
  }
  else
  {
        var i = listaDocumentosServidor.indexOf(data.id);
        var permi= socket.misPermisos[i];
        if(permi>=3)
        {
          permisosusuario=true;  
        }
  }    
    
 if(permisosusuario==true || miarchivo==true)    
  {   
         if(socket.archivo!=null)
          {
             eliminarArchivo(archivos,socket.archivo)//mirar esta
          }
          //SI SE LIBERA ALGUN ARCHIVO MANDA UN MENSAJE A LOS USUARIOS MOSTRANDOLES QUE SU ARCHIVO YA FUE LIBERADO
         if(cola_peticiones.size()>0)
           {
              mandarelementoscola(cola_peticiones);
            }    
           
           if(puedoLeer(data.id))
           { 
            
                //ACOMODAR ULITMO EDITADO
               eliminarArchivo (OrdenEdicion,data.id); 

                OrdenEdicion.push(data.id);
             
                
                archivos.push(data.id);
                socket.archivo=data.id;
                console.log("lectura del archivo "+data.id+" cliente = "+socket.id );
                 
               fs.writeFile(data.id, data.texto, function (err) {
                   
                    var cadena = data.id.split(".");
                    for (var i = 0; i < socket.cantidadCopias; i++) {
                          fs.writeFile(cadena[0]+i.toString()+".txt", data.texto, function (err) {
                           if (err) throw err;
                     });
                        
                    }
                     
                   
                   
                if (err) throw err;
                console.log('Se anexo al documento  '+data.id+" "+data.texto);
                if(miarchivo==true)
                {
                    
                 var cadena = data.id.split(".");
                     fs.writeFile(cadena[0]+"TSL.txt", "1", function (err) {
                         console.log("Elemento en uso "+data.id);});         
                  io.in(socket.id).emit("lectura_cliente","PROPIETARIO:Editaste tu archivo");
                  
                }
                else
                {
                    
                     var cadena = data.id.split(".");
                     fs.writeFile(cadena[0]+"TSL.txt", "1", function (err) {
                    console.log("Elemento en uso "+data.id);});     
                   io.in(socket.id).emit("lectura_cliente","Edicion completa");   
                }
                
               });
               
                 fs.readFile("log.txt", 'utf-8', (err, data2) => {
      if(err) {
         console.log('error: ', err);
      } 
      else 
      {
           var  d = new  Date();
               
                fs.writeFile("log.txt",data2+"Se EDITO el archivo"+data.texto+".txt"+"del cliente "+socket.id+"la hora:"+d.getHours()+":"+d.getMinutes()+"\n", function (err) {
                if (err) throw err;
                console.log('modifico log  '+data.id+" "+data.texto);
               }); 
      }
      });  
               
               
               
           }
            else
         {
          console.log("ERROR:lectura del archivo "+data.id+" cliente = "+socket.id+" no pudo ser EDITADO dado que ya otro cliente lo EDITA");
         	 
     	if(peticion_soket(socket.id,cola_peticiones))
        {
          console.log("elemento entrante");
     	  cola_peticiones.add([data.id,socket.id]);
     	 }
     	else
     	{
     	  console.log("este soket ya esta en espera");
     	}
     	
     	io.in(socket.id).emit("lectura_cliente","No se puede EDITAR el archivo encolamos su solicitud");
        }
  
  }
   else
  {
   	io.in(socket.id).emit("lectura_cliente","No tiene permisos de edicion");
  }
  
 });
 
  socket.on('darpermisos', function () 
 {
    if(socket.misPermisos.length<listaDocumentosServidor.length)
    {
        //socket.misPermisos.push(getRandomArbitrary(1,4));
        socket.misPermisos.push(getRandomArbitrary(1,4));
    }
 });

socket.on('creararchivo', function (data) 
 {      
     socket.cantidadArchivos= socket.cantidadArchivos - 1;
      if(socket.cantidadArchivos>0) {
                fs.writeFile(data.texto+'.txt','Archivo Creado',function(error){
                        if (error)
                            console.log(error);
                        else
                            console.log('El archivo fue creado : '+data.texto+'.txt');
                            listaDocumentosServidor.push(data.texto+'.txt');
                            socket.misDocumentos.push(data.texto+'.txt');
                            io.emit("documentos",listaDocumentosServidor);
                            io.emit("permisos");
                    });
                    
                            for (var i = 0; i < socket.cantidadCopias; i++) 
                           {
                                  
                              fs.writeFile(data.texto+i+'.txt','Archivo Creado copia'+i,function(error)
                              {
                                    if (error)
                                        console.log(error);
                                    else
                                        console.log('Copia creada : '+data.texto+i+'.txt');
                                });
                            }
                          
                             fs.writeFile(data.texto+"TSL"+'.txt','0',function(error){
                                    if (error)
                                        {console.log(error);}
                                        console.log('El archivo TSL fue creado : '+data.texto+"TSL"+'.txt');
                                });  
                             fs.readFile("log.txt", 'utf-8', (err, data2) => {
                              if(err) {
                                 console.log('error: ', err);
                              } 
                              else 
                              {
                                   var  d = new  Date();
                                       
                                        fs.writeFile("log.txt",data2+"Se CREO el archivo"+data.texto+".txt"+"del cliente "+socket.id+"la hora:"+d.getHours()+":"+d.getMinutes()+"\n", function (err) {
                                        if (err) throw err;
                                        console.log('modifico log  '+data.id+" "+data.texto);
                                       }); 
                              }
                              }); 
      }  
     else
     {
             var menor=1000;
             var auxiliar=-1;
             for (var i = 0; i < socket.misDocumentos.length; i++) 
             {
                 auxiliar=OrdenEdicion.indexOf(socket.misDocumentos[i]);
                 if(menor > auxiliar && auxiliar!=-1 )
                 {
                     menor=auxiliar; 
                 }
              }
             if(menor!=1000)
             {
                fs.readFile(OrdenEdicion[menor], 'utf-8', (err, data1) => {
                if(err){
                    console.log('error: ', err);
                }     
                else
                {
                    fs.writeFile("escritorio/"+OrdenEdicion[menor],data1, function (err) 
                    {
                    if (err) throw err;
                    console.log("ARCHIVO MANDADO A ESCRITORIO");
                    
                                fs.writeFile(data.texto+'.txt','Archivo Creado',function(error){
                                if (error)
                                    console.log(error);
                                else
                                    console.log('El archivo fue creado : '+data.texto+'.txt');
                                    listaDocumentosServidor[listaDocumentosServidor.indexOf(OrdenEdicion[menor])]=data.texto+'.txt';
                                    socket.misDocumentos[socket.misDocumentos.indexOf(OrdenEdicion[menor])]=data.texto+'.txt';
                                    io.emit("documentos",listaDocumentosServidor);
                                    io.emit("permisos");
                                    });
                    });  
                
                    for (var i = 0; i < socket.cantidadCopias; i++) 
                    {
                      
                  fs.writeFile(data.texto+i+'.txt','Archivo Creado copia'+i,function(error)
                  {
                        if (error)
                            console.log(error);
                        else
                            console.log('Copia creada : '+data.texto+i+'.txt');
                    });
                }
              
                 fs.writeFile(data.texto+"TSL"+'.txt','0',function(error){
                        if (error)
                            {console.log(error);}
                            console.log('El archivo TSL fue creado : '+data.texto+"TSL"+'.txt');
                    });  
                 fs.readFile("log.txt", 'utf-8', (err, data2) => {
                  if(err) {
                     console.log('error: ', err);
                  } 
                  else 
                  {
                       var  d = new  Date();
                           
                            fs.writeFile("log.txt",data2+"Se CREO el archivo"+data.texto+".txt"+"del cliente "+socket.id+"la hora:"+d.getHours()+":"+d.getMinutes()+"\n", function (err) {
                            if (err) throw err;
                            console.log('modifico log  '+data.id+" "+data.texto);
                           }); 
                  }
                  }); 
                    
                    
                    
                }
                });
             } else {
                            var ultimoarchivo=socket.misDocumentos[0];
                            
                            fs.writeFile(data.texto+'.txt','Archivo Creado',function(error){
                            if (error)
                                console.log(error);
                            else
                                console.log('El archivo fue creado : '+data.texto+'.txt');
                                listaDocumentosServidor[listaDocumentosServidor.indexOf(ultimoarchivo)]=data.texto+'.txt';
                                socket.misDocumentos[0]=data.texto+'.txt';
                                io.emit("documentos",listaDocumentosServidor);
                                io.emit("permisos");
                                });                    
         
                                 for (var i = 0; i < socket.cantidadCopias; i++) 
                               {
                                      
                                  fs.writeFile(data.texto+i+'.txt','Archivo Creado copia'+i,function(error)
                                  {
                                        if (error)
                                            console.log(error);
                                        else
                                            console.log('Copia creada : '+data.texto+i+'.txt');
                                    });
                                }
                              
                                 fs.writeFile(data.texto+"TSL"+'.txt','0',function(error){
                                        if (error)
                                            {console.log(error);}
                                            console.log('El archivo TSL fue creado : '+data.texto+"TSL"+'.txt');
                                    });  
                                 fs.readFile("log.txt", 'utf-8', (err, data2) => {
                                  if(err) {
                                     console.log('error: ', err);
                                  } 
                                  else 
                                  {
                                       var  d = new  Date();
                                           
                                            fs.writeFile("log.txt",data2+"Se CREO el archivo"+data.texto+".txt"+"del cliente "+socket.id+"la hora:"+d.getHours()+":"+d.getMinutes()+"\n", function (err) {
                                            if (err) throw err;
                                            console.log('modifico log  '+data.id+" "+data.texto);
                                           }); 
                                  }
                                  }); 
             }
             
             
             
             
             socket.cantidadArchivos=1;
             io.in(socket.id).emit("lectura_cliente","ERROR:Memoria llena");
     }
 }); 
             
  });
}


