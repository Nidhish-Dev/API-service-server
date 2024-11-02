const express = require('express');
const { verifyApiKey } = require('../middleware/verifyApiKey');
const router = express.Router();
const {getHello} = require('../controllers/apiController')

router.get('/hello', getHello);

module.exports = router;
