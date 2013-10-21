var
	_          = require('lodash'),
	P          = require('bluebird'),
	NodePie    = require('nodepie'),
	Pinboard   = require('node-pinboard'),
	Request    = require('request'),
	Newsletter = require('./newsletter'),
	strftime   = require('prettydate').strftime
	;


exports.fetchFencepost = function fetchFencepost(feedurl)
{
	// fencepost: the time of the most recent newsletter post, with a 1 week fallback
	var fencepost = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

	if (!feedurl)
		return P.cast(fencepost);

	var deferred = P.pending();

	Request.get(feedurl, function(err, response, body)
	{
		if (err)
			return deferred.fulfill(fencepost);

		if (response.statusCode >= 400)
			return deferred.fulfill(fencepost);

		var feed = new NodePie(body);
		feed.init();
		fencepost = feed.getDate();
		deferred.fulfill(fencepost);
	});

	return deferred.promise;
};

exports.fetchRecentPosts = function fetchRecentPosts(credentials, fencepost)
{
	var deferred = P.pending();

	var pinboard = new Pinboard(credentials.token);
	var fromString = strftime(fencepost, '%Y-%m-%dT%H:%M:%SZ');

	// pinboard.get({ fromdt: fromString}, function(response)
	pinboard.recent({}, function(response)
	{
		if (!response || !response.posts || !response.posts.length)
			return deferred.fulfill([]);

		var posts = [];
		var serieses = {};

		_.each(response.posts, function(p)
		{
			var item = new Newsletter.Item(p);

			if (item.series)
			{
				if (serieses[item.series])
				{
					var head = serieses[item.series];
					while (head.next)
						head = head.next;
					head.next = item;
				}
				else
				{
					serieses[item.series] = item;
					posts.push(item);
				}
			}
			else
				posts.push(item);
		});

		posts = posts.sort(Newsletter.Item.comparator);
		deferred.fulfill(posts);
	});

	return deferred.promise;
};
