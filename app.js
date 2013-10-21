var
	express    = require('express'),
	http       = require('http'),
	multiparty = require('connect-multiparty'),
	path       = require('path'),
	routes     = require('./routes'),
	newsletter = require('./lib/newsletter')
	;

var app = express();
app.locals.pretty = true;

var config = require('./config.json');

if (!config.pinboard.token)
	config.pinboard.token = process.env.PINBOARD_TOKEN;

if (!config.pinboard.token)
	throw new Error('cannot operate without a pinboard api token in env var PINBOARD_TOKEN');

app.set('config', config);
newsletter.Category.setup(config.categories.titles, config.categories.order);

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
