Gileswatching.controllers do

	get :index do
		Newsletter::Category.setup(Gileswatching.categories[:setup][:titles], Gileswatching.categories[:setup][:order])
		
		fencepost = fetchFencepost(Gileswatching.newsletter[:url])
		@posts = fetchRecentPosts(Gileswatching.pinboard[:credentials], fencepost)

		@endpoint = "http://pinboard.in/u:#{Gileswatching.pinboard[:credentials][:account]}"
		@postcount = @posts.size
		@today = Time.now.strftime('%A, %B %e')
		@lastNewsletter = fencepost.strftime("%Y-%m-%d %I:%M %Z")
		
		render 'index'
	end
	
	get :help do
		@categories = Gileswatching.categories[:setup][:titles]
		@order = Gileswatching.categories[:setup][:order].split(', ')
		@account = Gileswatching.pinboard[:credentials][:account]
		render 'help'
	end

end