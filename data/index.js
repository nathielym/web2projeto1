const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/afe',  { useMongoClient: true});
mongoose.Promise = global.Promise;

console.log("deu certo");
module.exports = mongoose;