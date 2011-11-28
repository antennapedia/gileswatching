module Newsletter
	$AllTags = {}

	class Tag
		attr_accessor :tag, :count, :type
	
		def initialize(tag, count)
			@tag = tag
			@count = Integer(count)
			@type = nil
		end
		
		def url
			@tag
		end
		
		def ljtag
			@tag
		end
		
		def link(lj = false)
			if lj
				return self.ljtag
			end
			self.url
		end
		
		def delicious
			"<a href=\"http://pinboard.in/u:#{account}/#{self}\">#{@tag}</a>"
		end
		
		def sortkey
			@tag
		end
			
		def to_s
			return "#{@type}:#{@tag}" if @type
			@tag
		end
	end
			
	class Category < Tag
		@@titles = Hash.new
		@@sortkeys = Hash.new
		
		def initialize(tag, count)
			@tag = tag
			@count = Integer(count)
			@type = :cat
		end
		
		def self.setup(titles, order)
			titles.each do |item|
				@@titles[item[0]] = item[1]
			end
			cats = order.split(', ')
			i = 0
			cats.each do |c|
				@@sortkeys[c] = "#{i}_#{c}"
				i += 1
			end
		end
			
		def sortkey
			return @@sortkeys.fetch(@tag, "9_#{@tag}")
		end
			
		def ljtag
			return @@titles.fetch(@tag, @tag.gsub(/\b\w/){$&.upcase})
		end
	end

	class Poster < Tag
		def initialize(tag, count, type, site)
			@tag = tag
			@count = Integer(count)
			@type = type
			@site = site # TODO
		end
		
		def ljtag
			result = case @site
			when :ao3
				self.url
			when :ffnet
				self.url
			when :ij
				self.url
			when :dw
				self.url
			when :lj, nil
				tmp = "<lj "
				tmp += 'comm=' if @type == :comm
				tmp += 'user=' if @type == :poster
				tmp += "\"#{@tag}\">"
			end			
		
			return result
		end

		# <span style="white-space:nowrap;">
		#<a href="http://twitter.com/#!/TWITTER">
		#<img src="http://l-stat.livejournal.com/img/twitter-profile.gif" alt="[info]" width="16" height="16" style="vertical-align: text-bottom; border: 0; padding-right: 1px;" /></a>
		#<a href="http://twitter.com/#!/Livejournal"><b>Livejournal</b></a></span>
		# <span style="white-space:nowrap;"><a href="http://twitter.com/#!/TWITTER"><img src="http://twitter.com/phoenix/favicon.ico
		# <span style="white-space:nowrap;"><a href="http://TUMBLR.tumblr.com/archive"><img src="https://secure.assets.tumblr.com/images/favicon.gif" alt="[info]" width="16" height="16" style="vertical-align: text-bottom; border: 0; padding-right: 1px;" /></a><a href="http://random.tumblr.com/"><b>random</b></a></span>		

		def url
			if @type == :comm
				case @site
				when :ao3
					"<span style=\"white-space:nowrap;\"><a href=\"http://archiveofourown.org/users/%s\"><img src=\"http://www.buffyworld.com/images/AO3.png\" alt=\"[info]\" width=\"16\" height=\"16\" style=\"vertical-align: text-bottom; border: 0; padding-right: 2px;\" /></a><a href=\"http://archiveofourown.org/users/%s\"><b>%s</b></a></span>" % [@tag, @tag, @tag]
				when :ffnet
					"TBD ffnet"
				when :ij
					"<b><a href=\"http://community.insanejournal.com/#{@tag}/\"><img src=\"http://www.insanejournal.com/img/community.gif\" alt=\"[info]\" width=\"16\" height=\"16\" style=\"vertical-align: bottom; border: 0;\" />#{@tag}</a></b>"
				when :dw
					"<b><a href=\"http://community.dreamwidth.org/#{@tag}/\"><img src=\"http://s.dreamwidth.org/img/silk/identity/community.png\" alt=\"[info]\" width=\"16\" height=\"16\" style=\"vertical-align: bottom; border: 0;\" />#{@tag}</a></b>"
				when :lj
					"<b><a href=\"http://community.livejournal.com/#{@tag}/\"><img src=\"http://stat.livejournal.com/img/community.gif\" alt=\"[info]\" width=\"16\" height=\"16\" style=\"vertical-align: bottom; border: 0;\" />#{@tag}</a></b>"
				else
					"<b><a href=\"http://community.livejournal.com/#{@tag}/\"><img src=\"http://stat.livejournal.com/img/community.gif\" alt=\"[info]\" width=\"16\" height=\"16\" style=\"vertical-align: bottom; border: 0;\" />#{@tag}</a></b>"
				end			
			elsif @type == :poster
				case @site
				when :ao3
					"<span style=\"white-space:nowrap;\"><a href=\"http://archiveofourown.org/users/%s\"><img src=\"http://www.buffyworld.com/images/AO3.png\" alt=\"[info]\" width=\"16\" height=\"16\" style=\"vertical-align: text-bottom; border: 0; padding-right: 2px;\" /></a><a href=\"http://archiveofourown.org/users/%s\"><b>%s</b></a></span>" % [@tag, @tag, @tag]
				when :ffnet
					"TBD ffnet"
				when :ij
					"<b><a href=\"http://#{@tag}.insanejournal.com/\"><img src=\"http://www.insanejournal.com/img/userinfo.gif\" alt=\"[info]\" width=\"17\" height=\"17\" style=\"vertical-align: bottom; border: 0;\" />#{@tag}</a></b>"
				when :dw
					"<b><a href=\"http://#{@tag}.dreamwidth.org/\"><img src=\"http://s.dreamwidth.org/img/silk/identity/user.png\" alt=\"[info]\" width=\"17\" height=\"17\" style=\"vertical-align: bottom; border: 0;\" />#{@tag}</a></b>"
				when :lj
					"<b><a href=\"http://#{@tag}.livejournal.com/\"><img src=\"http://stat.livejournal.com/img/userinfo.gif\" alt=\"[info]\" width=\"17\" height=\"17\" style=\"vertical-align: bottom; border: 0;\" />#{@tag}</a></b>"
				else
					"<b><a href=\"http://#{@tag}.livejournal.com/\"><img src=\"http://stat.livejournal.com/img/userinfo.gif\" alt=\"[info]\" width=\"17\" height=\"17\" style=\"vertical-align: bottom; border: 0;\" />#{@tag}</a></b>"
				end
			else
				@tag
			end
		end
	end
	
	def tagFactory(items)
		## Parses data returned by the bookmark site api into a tag. Assumes that
	    ## tags are prefixed with category:
	    ## comm:lj_comm_name
	    ## poster:lj_user_name
	    ## cat:entry_category
	    ## Tags without prefixes are assumed to be straight categories, as used
	    ## in the giles_watchers post headers.
	    
	    if items.kind_of?({}.class)
	    	tag = items['tag']
	    	count = items['count']
	    else
	    	count = 1
	    	tag = items
	    end
	    
	    result = nil
	    if tag.include? ':'
			(cat, tag) = tag.split(':', 2)
			if cat == 'poster'
				result = Poster.new(tag, count, :poster, :lj)
			elsif cat == 'comm'
				result = Poster.new(tag, count, :comm, :lj)
			elsif ['category', 'cat'].include?(cat)
				result = Category.new(tag, count)
			elsif ['ij-poster', 'ijposter'].include?(cat)
				result = Poster.new(tag, count, :poster, :ij)
			elsif ['ij-comm', 'ijcomm'].include?(cat)
				result = Poster.new(tag, count, :comm, :ij)
			elsif ['dw-poster', 'dwposter'].include?(cat)
				result = Poster.new(tag, count, :poster, :dw)
			elsif ['dw-comm', 'dwcomm'].include?(cat)
				result = Poster.new(tag, count, :comm, :dw)
			elsif cat == 'ao3'
				result = Poster.new(tag, count, :poster, :ao3)
			elsif ['ffnet', 'ff.net'].include?(cat)
				result = Poster.new(tag, count, :poster, :ffnet)
			elsif cat == 'series'
				result = Tag.new(tag, count)
				result.type = :series
			end
	    end
	    if result == nil
	    	result = Tag.new(tag, count)
	    end
	    
	    result
	end
	module_function :tagFactory
	
	class Item
		attr_accessor :tags, :series, :category, :posters, :next, :bookmark
	
		def initialize(bookmark)
			@bookmark = bookmark
			
			@series = nil
			@tags = []
			@category = nil
			@posters = []
			@next = nil
			
			self.parseTags(@bookmark.tag)
		end
		
		def parseTags(taglist)
			tags = taglist.split(' ')
			tags.each do |t|
				if $AllTags.has_key?(t)
					tag = $AllTags[t]
				else
					tag = Newsletter.tagFactory(t)
					$AllTags[t] = tag
				end
				case tag.type
				when :poster
					@posters << tag
				when :comm
					@posters << tag
				when :series
					@series = tag.tag
				when :cat
					@category = tag
				when :category
					@category = tag
				else
					logger.error("unknown tag type #{tag.type}")
				end
			end
			if @category == nil
				@category = $miscTag
			end
		end
		
		def sortkey
			"#{@category.sortkey()}_#{@bookmark.time}_#{@bookmark.description}"
		end
		
		def posterlinks(ljtags = true)
			if @posters.size == 1
				@posters[0].link(ljtags)
			elsif @posters.size > 1
				result = ""
				@posters.each do |p|
					result = "#{result}#{p.link(ljtags)} &amp; "
				end
				result = result[0..-7]
				return result
			end
		end
		
		def link
			if @bookmark.description == nil && @bookmark.href == nil
				return '[none]'
			end
			if @bookmark.description != nil
				desc = @bookmark.description
			else
				desc = @bookmark.href
			end
			"<a href=\"#{@bookmark.href}\">#{desc}</a>"
		end
		
		def serieslinks
			result = self.link
			if @next
				result += ", #{@next.serieslinks}"
			end
			result
		end
		
		def entry(ljtags = true)
			if @posters.size > 0
				result = "+ #{self.posterlinks(ljtags)}:"
			else
				result = '+'
			end

			if @series && @next
				result += " #{self.serieslinks}"
			else
				result += " #{self.link}"
			end
			
			result += " - #{@bookmark.extended}" if @bookmark.extended != nil
			return result
		end
		
		def <=>(right)
			self.sortkey <=> right.sortkey
		end
	end

end
