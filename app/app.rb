class Gileswatching < Padrino::Application
	register SassInitializer
	register Padrino::Mailer
	register Padrino::Helpers

	set :pinboard, :credentials => {
		:account => 'xxxxxxxxx',
		:password => 'xxxxxxxxxxx',
	}
	set :newsletter, :url => 'http://community.livejournal.com/giles_watchers/data/atom'
	set :categories, :setup => {
		:titles => {
			'fiction' => 'Fiction',
			'ficlets' => 'Drabbles &amp; Ficlets',
			'art' => 'Fan Art',
			'misc' => 'Misc',
			'rpgs' => 'RPGs',
			'sog' => 'Summer of Giles',
			'prompts' => 'Prompts &amp; Contests'
		},
		:order => 'fiction, ficlets, art, prompts, misc, rpgs, sog'
	}

end
