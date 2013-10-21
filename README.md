# Giles-Watching

A simple express.js web application for auto-generating a Livejournal newsletter from bookmarks stored in a Pinboard account.

## Configuration

Clone the repo: `git clone https://github.com/antennapedia/gileswatching.git`

Edit `config.json.example` to `config.json` and edit to your tastes.

The `newsletter` field should be a URL pointing to the RSS feed of the site where you'll be posting the newsletter. The script will use all bookmarks that are newer than the most recent post found in the newsletter feed.

The `categories` object contains a list of headers used by the newsletters and the order in which you want them to appear in your newsletter. Each bookmarked item needs at least two tags: one to identify the poster or community the item comes from, and one to specify to which category the item belongs in the newsletter. See the help page for more details on tagging.

## Deploying locally

Make sure you have [node.js](http://nodejs.org/) installed. Run `npm install` to install dependencies as usual, then run npm start.

## Deploying on Heroku

Follow the [usual Heroku instructions](https://devcenter.heroku.com/articles/getting-started-with-nodejs) for creating & deploying a node application. This app does not require any data storage or any Heroku addons of any kind.

You must configure two environment variables:

`PINBOARD_TOKEN`: your pinboard [API](https://pinboard.in/api/) token
`PORT`: the port the app should listen on

Set these environment variables the usual way: `heroku config:set PORT=80`.

## License

MIT.
