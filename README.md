A simple [Padrino](http://www.padrinorb.com/) web app for auto-generating a Livejournal newsletter from bookmarks stored in a Pinboard account. The Gemfile lists dependencies beyond Padrino.

Edit app/app.rb to set up your own newsletter configuration.

The :pinboard hash should contain your pinboard account credentials.

The :newsletter variable should be a URL pointing to the RSS feed of the site where you'll be posting the newsletter. The script will use all bookmarks that are newer than the most recent post found in the newsletter feed.

The :categories hash contains a list of headers used by the newsletters and the order in which you want them to appear in your newsletter. Each bookmarked item needs at least two tags: one to identify the poster or community the item comes from, and one to specify to which category the item belongs in the newsletter. See the help page for more details on tagging.
