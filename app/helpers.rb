# Helper methods defined here can be accessed in any controller or view in the application

Gileswatching.helpers do

def fetchFencepost(feedurl)
	# fencepost: the time of the most recent newsletter post, with a 1 week fallback
	fencepost = Time.now - 7 * 24 * 60 * 60

	if feedurl
		begin
			feed = Feedzirra::Feed.fetch_and_parse(feedurl)
			fencepost = feed.entries.first.published
		rescue
			logger.error 'feed fetch failed, falling back'
		end
	end

	if fencepost.kind_of?(''.class)
		Time.parse(fencepost)
	else
		fencepost
	end
end

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