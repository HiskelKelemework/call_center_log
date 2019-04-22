var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Log = new Schema({
    time: {type: Date, default: Date.now()},
    sex: {type: String, maxlength: 1, trim: true},
    customerNumber:{type: String, trim: true},
    customerName: {type: String, trim: true},
    driverName: {type: String, trim: true},
    driverNumber: {type: String, trim: true},
    from: {type: String, trim: true},
    to: {type: String, trim: true},
    status: {type: String, trim: true},
    reasonForCancelation: {type: String, trim: true},
    username: {type: String, trim: true},   // the person who made the change.
});

Log.index({driverNumber: 1});
Log.index({time: 1});
Log.index({from: 1});
Log.index({to: 1});
Log.index({status: 1});

module.exports = mongoose.model('Log', Log);