var
	_          = require('lodash'),
	P          = require('bluebird'),
	NodePie    = require('nodepie'),
	Request    = require('request'),
	Newsletter = require('./newsletter')
	;


exports.fetchFencepost = function fetchFencepost(feedurl)
{
	// fencepost: the time of the most recent newsletter post, with a 1 week fallback
	var fencepost = Date.now() - 7 * 24 * 60 * 60 * 1000;

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

	// fetch posts newer than fencepost
	// process
	// resolve promise


	deferred.fulfill([]);


	return deferred.promise;
};

/*

def fetchRecentPosts(credentials, fencepost)
	$miscTag = Newsletter::Tag.new('Misc', 1)
	$AllTags['Misc'] = $miscTag

	# pinboard uses the delicious time format
	fromString = fencepost.strftime('%Y-%m-%dT%H:%M:%SZ')

	pin = Pinboarder::Wrapper.new(credentials[:account], credentials[:password])
	pinnedItems = pin.posts('all', {:fromdt=>fromString})
	pinnedItems.reverse!

	serieses = {}
	posts = []
	pinnedItems.each do |p|
		next if p.time < fromString
		item = Newsletter::Item.new(p)

		if item.series
			if serieses.has_key?(item.series)
				head = serieses[item.series]
				while head.next
					head = head.next
				end
				head.next = item
			else
				serieses[item.series] = item
				posts << item
			end
		else
			posts << item
		end

	end
	posts.sort!

	posts
end

*/
