var mongoose = require('mongoose');

mongoose.connect('mongodb://192.168.8.20/clients', function(err, res) {
 if(err) throw err;
 console.log('Connected to Database');
});
