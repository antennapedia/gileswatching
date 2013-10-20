# Helper methods defined here can be accessed in any controller or view in the application

Gileswatching.helpers do

def fetchFencepost(feedurl)
	# fencepost: the time of the most recent newsletter post, with a 1 week fallback
	fencepost = Time.now - 7 * 24 * 60 * 60

	if feedurl
		begin
			feed = Feedzirra::Feed.fetch_and_parse(feedurl,
				:on_success => lambda {|url, feed| fencepost = feed.entries.first.published },
				:on_failure => lambda {|url, response_code, response_header, response_body| puts "feedzirra failure: #{response_code} #{response_body}" }
			)
		rescue
			puts 'exception caught; falling back to fencepost 7 days back'
		end
	end

	puts "Fencepost: #{fencepost}"
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