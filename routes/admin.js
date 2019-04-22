var express = require('express');

var adminController = require('../controllers/admin');
var auth = require('../controllers/authentication');

var router = express.Router();

router.post('/login', (req, res) => { auth.authenticateUser(req, res, 'admin') });

//----------- admin validation checkpoint ---------------------------
router.use((req, res, next) => auth.checkPoint(req, res, next, 'admin'));

// creates a new user account (call center attendants)
router.post('/createUser', adminController.createUser);


// get todays call log
router.get('/logs', (req, res) => {});

// get a specific days log
router.get('/specificLog', (req, res) => {});


module.exports = router;
