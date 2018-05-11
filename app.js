// Incluímos las dependencias que vamos a usar

var express = require("express"),
    app     = express(),
    http    = require("http"),
    server  = http.createServer(app),
    mongoose = require("mongoose");

const Eureka = require('eureka-js-client').Eureka;

// call the packages we need
var bodyParser = require('body-parser');


// example configuration
/*const client = new Eureka({
    instance: {
        app: 'Microservicio NodeJs',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        statusPageUrl: 'http://localhost:3000/clients',
        port: {
            '$': 3000,
            '@enabled': 'true',
        },
        vipAddress: 'Microservicio NodeJs',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: 'localhost',
        port: 7000,
        servicePath: '/eureka/apps/'
    },
});*/

//client.start();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Configuramos la app para que pueda realizar métodos REST
app.configure(function () {
  app.use(express.bodyParser()); // JSON parsing
  app.use(express.methodOverride()); // HTTP PUT and DELETE support
  app.use(app.router); // simple route management
});

routes = require('./controller/clientController')(app);
// Connection to DB
require('./config/index');

// Start server
app.listen(3000, function() {
 console.log("Node server running on http://localhost:3000");
});
