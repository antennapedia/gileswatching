require 'rexml/document'

module Pinboarder
	ENDPOINT = 'https://api.pinboard.in/'
	VERSION = 'v1'
	URL = ENDPOINT + '/' + VERSION + '/'
	
	class Wrapper		
		def initialize(username, password)
			@user = username
			@pass = password
		end
		
		def resource
			if @resource == nil
				@resource = RestClient::Resource.new(URL, :user => @user, :password => @pass)
			end
			@resource
		end
 
		def get(verb, params)
			self.resource[verb].get({:params => params})
		end
		
		def post(verb, params)
			self.resource[verb].post({:params => params})
		end
		
		def posts(method, params)
			begin
				data = self.get('posts/' + method, params)
			rescue StandardError => err
				# TODO needs something more user-visible than this
				logger.error(err)
				data = ''
			end

			posts = Array.new
			begin
				doc = REXML::Document.new(data)
				doc.elements.each("//post") do |xmldata|
					posts << Bookmark.new(xmldata)
				end
			rescue StandardError => err
				# TODO needs something more user-visible than this
				logger.error(err)
				data = ''
			end
			posts
		end
		
	end
	
	class Bookmark
		attr_reader :href, :time, :hash, :tag, :description, :extended

		def initialize(xml)
			@href = xml.attributes["href"]
			@time = xml.attributes["time"]
			@hash = xml.attributes["hash"]
			@tag = xml.attributes["tag"]
			@description = xml.attributes["description"]
			@extended = xml.attributes["extended"]
		end
		
		def to_s
			@description
		end
	end
end
