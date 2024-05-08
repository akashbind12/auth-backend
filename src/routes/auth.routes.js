const express = require('express');
const router = express.Router();
const { 
    signup, 
    login , 
    refreshToken 
} = require('../controllers/auth.controller');


router.post('/signup', signup);
router.post('/login', login);
router.post('/refresToken', refreshToken);

module.exports = router;
