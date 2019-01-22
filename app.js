var express= require("express");

//server Master
var http =require("http");
var app = express(); // mirar 
var server = http.Server(app);
var bodyParser = require("body-parser");
var session =require("express-session");
var redis = require("redis");
var formidable =require("express-formidable");
var RedisStore = require("connect-redis")(session);
var realtime = require("./realtime");
let fs = require('fs');
var sessionMiddleware=session({
store: new RedisStore({}),
secret:"SuperUltraSecretWords"
})

app.use(sessionMiddleware);
realtime(server,sessionMiddleware);

var methodOverride =require("method-override");
app.use(methodOverride("_method"));
app.use("/estatico",express.static('public')); //server archivos estaticoss
app.use(bodyParser.json());// para peticiones aplicaciones/json
app.use(bodyParser.urlencoded({extended:true}));//leer parametros 
app.use(formidable.parse({keepExtensions:true}));
app.set("view engine","jade");
var client =redis.createClient();



/*
fs.readFile('prueba.txt', 'utf-8', (err, data) => {
  if(err) {
    console.log('error: ', err);
  } else {
    console.log(data);
  }
});


fs.writeFile('./archivo1.txt','línea 1\nLínea 2 leonardito',function(error){
    if (error)
        console.log(error);
    else
        console.log('El archivo fue creado');
});


function ReadAppend(file, appendFile){
  fs.readFile(appendFile, function (err, data) {
    if (err) throw err;
    console.log('File was read'+data);

    fs.appendFile(file, "hola mundo como estas", function (err) {
      if (err) throw err;
      console.log('The "data to append" was appended to file!');

    });
  });
}

// edit this with your file names
file = 'prueba.txt';
appendFile = 'archivo1.txt';
ReadAppend(file, appendFile);
*/


//function ReadAppend(file, data){
//    fs.appendFile(file, data, function (err) {
//      if (err) throw err;
//      console.log('The "data to append" was appended to file!');
//    });
//}


// edit this with your file names
//file = 'prueba.txt';
//texto = 'HHola mundoadsnoigfhdsoigdsiu';
//ReadAppend(file, texto);



//fs.unlink('./archivo1.txt');


app.get("/",function(req,res){//solicitudes y respuestas
	 	 res.render('menuclientes');
	});
	
	
app.get("/leer",function(req,res){//solicitudes y respuestas
	 	 res.render('menuclientes');
	});	
	
app.get("/borrar",function(req,res){//solicitudes y respuestas
	 	 res.render('menuclientes');
	});	
	
app.get("/crear",function(req,res){//solicitudes y respuestas
	 	 res.render('menuclientes');
	});	
	
	
	
	
server.listen(8080);

