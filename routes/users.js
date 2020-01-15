var express = require('express');

var auth = require('../controllers/authentication');
var userController = require('../controllers/user');

var router = express.Router();

router.post('/login', (req, res) => auth.authenticateUser(req, res, 'user'));


// ------- user validation checkpoint -------------------
router.use((req, res, next) => auth.checkPoint(req, res, next, 'user'));


// retrieve call logs of a single day
router.get('/logs', userController.getTodaysLogs);  

// add a new call log
router.post('/addLog', userController.addLog);

// edit an existing log from today
router.put('/editLog/:logId', userController.editLog);

router.get('/getPlaces/:place', userController.getPlaces);

router.get('/getDriverName/:driverNumber', userController.getDriverName);

module.exports = router;
