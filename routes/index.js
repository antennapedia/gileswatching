var
	helpers = require('helpers'),
	moment  = require('moment')
	;

exports.index = function(request, response)
{
	var config = request.app.get('config');
	var fencepost, posts;
	locals =
	{
		endpoint: 'http://pinboard.in/u:' + config.pinboard.account;
		today: new Date(), // format with moment
	};

	// 	Newsletter::Category.setup(Gileswatching.categories[:setup][:titles], Gileswatching.categories[:setup][:order])
	helpers.fetchFencepost(confg.newsletter)
	.then(function(ts)
	{
		fencepost = ts;
		locals.lastNewsletter = fencepost; // TODO format with moment
		return helpers.fetchRecentPosts(config.pinboard, fencepost);
	})
	.then(function(result)
	{
		posts = result;
		locals.postcount = posts.length;
		response.render('index', locals);
	},
	function(error)
	{
		// set flash message
		// render index anyway
		locals.err = error.message;
		response.render('index', locals);
	}).done();
};

exports.help = function(request, response)
{
	var config = request.app.get('config');
	var locals =
	{
		title:      'Help',
		account:    config.pinboard.account,
		categories: config.categories.titles,
		order:      config.categories.order
	};

	response.render('help', locals);
};

exports.ping = function(request, response)
{
	response.json({ ping: 'pong' });
};
