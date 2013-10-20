var
	_          = require('lodash'),
	P          = require('bluebird'),
	pie        = require('nodepie'),
	Request    = require('request'),
	Newsletter = require('./newsletter')
	;


exports.fetchFenchpost = function fetchFencepost(feedurl)
{
	// fencepost: the time of the most recent newsletter post, with a 1 week fallback
	var fencepost = Date.now() - 7 * 24 * 60 * 60 * 1000;

	if (!feedurl)
		return P.cast(fencepost);

	var deferred = P.pending();

	// fetch feedurl
	// parse
	// extract date of most recent post
	// return that

	deferred.fulfill(fencepost);

	return deferred.promise;
};

exports.fetchRecentPosts = fetchRecentPosts(credentials, fencepost)
{
	var miscTag = new Newsletter.Tag('Misc', 1);
	var allTags = {};
	allTags.Misc = miscTag;


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
