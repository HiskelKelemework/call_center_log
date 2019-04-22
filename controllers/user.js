var moment = require('moment');

var Log = require('../models/log');

var utils = require('../utils/utils');

function extractLogValues(req) {
    return {
        sex: req.body.sex,
        customerNumber: req.body.customerNumber,
        customerName: req.body.customerName,
        driverName: req.body.driverName,
        driverNumber: req.body.driverNumber,
        from: req.body.from,
        to: req.body.to,
        status: req.body.status,
        reasonForCancelation: req.body.reasonForCancelation,
        username: req.username
    }
}

module.exports = {
    addLog: function (req, res) {
        // log values
        const lv = extractLogValues(req);
        console.log(req.body);

        // only this 5 parameters are required at first, others can be edited in later.
        if (utils.areNonEmpty(lv.sex, lv.customerNumber, lv.from, lv.to, lv.status)) {
            const log = new Log(lv);

            log.save((err, result) => {
                if (err) utils.sendErrorMessage(res, 'could not create log');
                else {
                    utils.sendSuccessMessage(res, { id: result._id });
                }
            });

        } else {
            utils.sendErrorMessage(res, 'some fields are missing!');
        }

    },

    editLog: function (req, res) {
        const logId = req.params.logId;
        const lv = extractLogValues(req);

        // console.log(`log id is ${logId}`);

        if (utils.areNonEmpty(lv.sex, lv.customerNumber, lv.from, lv.to, lv.status, lv.driverName, lv.driverNumber, lv.reasonForCancelation)) {
            Log.findOneAndUpdate({ _id: logId }, lv, (err, doc, result) => {
                if (err) utils.sendErrorMessage(res, 'could not update log!');
                else utils.sendSuccessMessage(res, { message: 'log updated successfully!' });
            });
        } else {
            utils.sendErrorMessage(res, 'all fields are required!');
        }
    },

    getTodaysLogs: function (req, res) {
        const startOfToday = moment().startOf('day').toDate();

        Log.find({ time: { '$gte': startOfToday } }).select('-__v').exec((err, logs) => {
            if (err) utils.sendErrorMessage(res, 'could not retrieve logs.');
            else utils.sendSuccessMessage(res, { logs: logs });
        });
    },

    getPlaces: function (req, res) {
        const place = req.params.place.trim();
        const startsWith = RegExp("^" + place);

        Log.find({ '$or': [{ from: startsWith }, { to: startsWith }] }).select('from to -_id').exec((err, places) => {
            if (err) utils.sendErrorMessage(res, 'could not autocomplete');
            else {
                const filtered = {};
                places.forEach((each) => {
                    if (each.from.startsWith(place)) filtered[each.from] = true;
                    if (each.to.startsWith(place)) filtered[each.to] = true;
                });
                utils.sendSuccessMessage(res, { places: Object.keys(filtered) });
            }
        });
    },

    getDriverName: function (req, res) {
        const driverNumber = req.params.driverNumber.trim();

        Log.findOne({ driverNumber: driverNumber }).select('driverName -_id').exec((err, result) => {
            if (err) utils.sendErrorMessage(res, 'could not autocomplete driverName');
            else if (!result) utils.sendErrorMessage(res, 'no driver found!');
            else utils.sendSuccessMessage(res, result);
        });
    }
}