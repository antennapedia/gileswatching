var
	express    = require('express'),
	http       = require('http'),
	multiparty = require('connect-multiparty'),
	path       = require('path'),
	routes     = require('./routes')
	;

var app = express();


var config = require('./config.json');
app.set('config', config);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(multiparty.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env'))
{
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/help', routes.help);
app.get('/ping', routes.ping);

http.createServer(app).listen(app.get('port'), function()
{
	console.log('Express server listening on port ' + app.get('port'));
});
