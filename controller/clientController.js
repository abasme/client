module.exports = function(app){
 var mongoose = require('mongoose');
 var Client = require('../entity/client.js'); 	
 require('mongoose-middleware').initialize(mongoose);

/**
 * List of Customers
 */
listClient = function(req, res) { 

	var count = req.query.count || 5;
	var page = req.query.page || 1;

	var filter = {
		filters: {
			mandatory: {
				contains: req.query.filter
			}
		}
	};

	var pagination = {
		start: (page -1) * count,
		count: count
	};

	var sort = {
		sort: {
			desc: '_id'
		}
	};

	Client
		.find()
		.filter(filter)
		.order(sort)
		.page(pagination, function(err, client) {
			if (err) {
				return res.send(400, {
					message: getErrorMessage(err)
				});
			} else {
				res.jsonp(client);
			}
		});

};

//GET - Return all registers
findAllClients = function(req, res) {
  console.log('GET /Clients');
    return Client.find(function(err, client) {
           if(!err) {
		return res.send(client);
	   } else {
    res.statusCode = 500;
		console.log('Internal error(%d): %s',res.statusCode,err.message);
    return res.send({ error: 'Server error' });
	}	
});
};

//GET - Return a Client with specified ID
  findById = function(req, res) {
    console.log("GET /clients/id");
    return Client.findOne({name: req.params.id}, function(err, client) {
      if(!client) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }
      if(!err) {
        // Send { status:OK, client { client values }}
        return res.send({ status: 'OK', client:client });
        // Send {clients values}
        // return res.send(client);
      } else {
        res.statusCode = 500;
        console.log('Internal error(%d): %s',res.statusCode,err.message);
        return res.send({ error: 'Server error' });
      }
    });
  };
 
  //POST - Insert a new Client in the DB
  addClient = function(req, res) {
    console.log('POST  /client');
    console.log(req.body);
 
    var client = new Client({
      id:    req.body.id,
      name:  req.body.name, 
      email: req.body.email  
    });
 
    client.save(function(err) {
      if(!err) {
        console.log("Client created");
        return res.send({ status: 'OK', client:client });
      } else {
        console.log(err);
        if(err.name == 'ValidationError') {
          res.statusCode = 400;
          res.send({ error: 'Validation error' });
        } else {
          res.statusCode = 500;
          res.send({ error: 'Server error' });
        }
        console.log('Internal error(%d): %s',res.statusCode,err.message);
      }
    });
 
    res.send(client);
  };
 
  //PUT - Update a register already exists
  updateClient = function(req, res) {
    return Client.findOneAndUpdate({_id: req.body.perId},req.body,{new:true},function(err, client) {
      if(!client) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }
 
      if (req.body.id != null) client.id = req.body.id;
      if (req.body.name != null) client.name = req.body.name;
      if (req.body.email != null) client.email = req.body.email;
       
      return client.save(function(err) {
        if(!err) {
          console.log('Updated');
          return res.send({ status: 'OK', client:client });
        } else {
          if(err.name == 'ValidationError') {
            res.statusCode = 400;
            res.send({ error: 'Validation error' });
          } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
          }
          console.log('Internal error(%d): %s',res.statusCode,err.message);
        }
 
        res.send(client);
      });
    });
  }
 
  //DELETE - Delete a Client with specified ID
  deleteClient = function(req, res) {
    console.log("DELETE  /client/id");
    return Client.findById(req.params.id, function(err, client) {
      if(!client) {
        res.statusCode = 404;
        return res.send({ error: 'Not found' });
      }
 
      return client.remove(function(err) {
        if(!err) {
          console.log('Removed client');
          return res.send({ status: 'OK' });
        } else {
          res.statusCode = 500;
          console.log('Internal error(%d): %s',res.statusCode,err.message);
          return res.send({ error: 'Server error' });
        }
      })
    });
  }
 
  //Link routes and functions
  app.get('/clients', findAllClients);
  app.get('/client/:id', findById);
  app.post('/client', addClient);
  app.put('/client', updateClient);
  app.delete('/client/:id', deleteClient);
  app.get('/paginacion', listClient);
}
