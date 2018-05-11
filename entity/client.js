var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientSchema = new Schema({ 
 id: { type: Number },
 name: { type: String },
 email: { type: String }
});

clientSchema.index({ name: 1, type: -1});
module.exports = mongoose.model('Client', clientSchema);
