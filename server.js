var express = require('express');
var app = express();
const port = 3000;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'))

//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/test');

/* var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
*/

/*var urlSchema = new mongoose.Schema({
  url: String,
  checkfrequency: Number
});
*/

//var Urls = mongoose.model('Urls', urlSchema);

app.get('/', function(req, res) {
  res.send('Hello World!');
});

app.get('/status/:userStatus', function(req, res) {
  res.status(req.params.userStatus).send();
});

app.post('/newurl', function() {
  var newurl = new Urls({
    url: req.body.url,
    checkfrequency: req.body.checkfrequency
  });
  newurl.save(function(err, newurl) {
    if (err) {
      return console.error(err);
    }
  });
});

app.get('/urls', function(req, res) {
  Urls.find(function(err, Urls) {
    if (err) return console.error(err);
    console.log(Urls);
    res.send(Urls);
  })
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`);
});
