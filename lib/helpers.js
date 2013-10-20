var
	_       = require('lodash'),
	pie     = require('nodepie'),
	Request = require('request')
	;


exports.fetchFenchpost = function fetchFencepost(feedurl)
{
	// fencepost: the time of the most recent newsletter post, with a 1 week fallback
	var fencepost = Date.now() - 7 * 24 * 60 * 60 * 1000;

	if (!feedurl)
		return fencepost;

	// fetch feedurl
	// parse
	// extract date of most recent post
	// return that
};

exports.fetchRecentPosts = fetchRecentPosts(credentials, fencepost)
{

};



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

end
