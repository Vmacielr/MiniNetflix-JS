var express = require('express');
var router = express.Router();

/* GET upload page. (sera accessible via /upload) */
router.get('/', function(req, res, next) {
    res.render('upload', { title: 'Page d\'Upload' });
  
});

module.exports = router;
