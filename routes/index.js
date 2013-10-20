var
	moment     = require('moment'),
	helpers    = require('../lib/helpers'),
	newsletter = require('../lib/newsletter')
	;

exports.index = function(request, response)
{
	var config = request.app.get('config');
	var fencepost, posts;
	locals =
	{
		endpoint: 'http://pinboard.in/u:' + config.pinboard.account,
		today: moment().format('LL'), // format with moment
	};

	helpers.fetchFencepost(config.newsletter)
	.then(function(ts)
	{
		fencepost = ts;
		locals.lastNewsletter = moment(fencepost).calendar();

		return helpers.fetchRecentPosts(config.pinboard, fencepost);
	})
	.then(function(result)
	{
		locals.posts = result;
		locals.postcount = locals.posts.length;
		locals.buffer = '';

		var lastcat = null;
		for (var i = 0; i < locals.posts.length; i++)
		{
			var p = locals.posts[i];
			if (lastcat !== p.category)
			{
				if (lastcat)
					locals.buffer += '\n';
				locals.buffer += '<b><u>' + p.category.ljtag() + '</u></b>';
				lastcat = p.category;
			}
			locals.buffer += p.entry(true) + '\n';
		}

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
