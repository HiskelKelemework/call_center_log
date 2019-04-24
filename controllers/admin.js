var fs = require('fs');
var path = require('path');
var moment = require('moment');
var converter = require('json-2-csv');

var User = require('../models/user');
var Log = require('../models/log');
var utils = require('../utils/utils');

module.exports = {
  createUser: function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (utils.areNonEmpty(username, password)) {
      const user = new User({
        username: username.trim(),
        password: password.trim(),
        type: 'user'
      });

      // converts password to hashed password
      user.hashPassword();

      user.save((err, result) => {
        if (err) {
          utils.sendErrorMessage(res, 'username already taken!');
        } else {
          utils.sendSuccessMessage(res, { message: 'successfully created user!' });
        }
      });
    } else {
      utils.sendErrorMessage(res, 'username and password required!');
    }
  },

  getTodaysLogs: function (req, res) {
    const startOfToday = moment().startOf('day').toDate();

    Log.find({ time: { '$gte': startOfToday } }).select('-username -__v').exec((err, logs) => {
      if (err) utils.sendErrorMessage(res, 'could not retrieve logs.');
      else utils.sendSuccessMessage(res, { logs: logs });
    });
  },

  getASpecificDaysLog: function (req, res) {
    const date = req.params.date;

    if (date.split('-').length == 3) {
      const startOfDate = moment(date).startOf('day').toDate();
      const endOfDate = moment(date).endOf('day').toDate();

      Log.find({ time: { '$gte': startOfDate, '$lte': endOfDate } }).select('-username -__v').exec((err, logs) => {
        if (err) utils.sendErrorMessage(res, 'could not retrieve logs.');
        else utils.sendSuccessMessage(res, { logs: logs });
      });
    } else {
      utils.sendErrorMessage(res, 'incorrect date string');
    }

  },

  generateReport: function (req, res) {
    const date = req.params.date;
    console.log(date);

    if (date.split('-').length == 3) {
      const startOfDate = moment(date).startOf('day').toDate();
      const endOfDate = moment(date).endOf('day').toDate();

      Log.find({ time: { '$gte': startOfDate, '$lte': endOfDate } }, (err, logs) => {
        if (err) utils.sendErrorMessage(res, 'could not retrieve logs.');
        else {
          const filtered = []

          logs.forEach((doc) => {
            filtered.push({
              sex: doc.sex,
              customerNumber: doc.customerNumber,
              customerName: doc.customerName,
              driverName: doc.driverName,
              driverNumber: doc.driverNumber,
              from: doc.from,
              to: doc.to,
              status: doc.status,
              reasonForCancelation: doc.reasonForCancelation,
            });
          });

          converter.json2csv(filtered, (err, csv) => {
            if (err) {
              console.log(err);
              utils.sendErrorMessage(res, 'could not generate report');
            }
            else {
              const filename = path.join(__dirname, `../reports/${startOfDate.toDateString()}.csv`);

              fs.writeFile(filename, csv, (err) => {
                if (err) utils.sendErrorMessage(res, 'could not write report to disk');
                else res.download(filename);
              });
            }
          });
        }
      });

    } else {
      utils.sendErrorMessage(res, 'incorrect date string');
    }
  }
}