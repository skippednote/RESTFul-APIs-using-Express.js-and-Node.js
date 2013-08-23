var express = require('express')
  , http = require('http') , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Connect DB
var dbName = 'Axelerant';
var collections = ['employees'];

var db = require('mongojs').connect(dbName, collections);

// Setup Routes
app.get('/', function(req, res) {
    res.render('index', {title: "Express"});
});

app.get('/employees', function(req, res) {
    db.employees.find({}, function(err, employees) {
        if (err) { console.log("no employees"); }
        res.json(employees);
    });
});

app.get('/employees/:id', function(req, res) {
    var id = req.params.id;
    db.employees.find({ "_id" : db.ObjectId(id) }, function(err, employee) {
        if (err) { throw err }
        res.json(employee);
    });
});

// POST
app.post('/employees', function(req, res) {
    res.json(req.body);
    db.employees.save(req.body);
    });
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
