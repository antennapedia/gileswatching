class Gileswatching < Padrino::Application
	register SassInitializer
	register Padrino::Mailer
	register Padrino::Helpers

	# Padrino::Logger::Config[:development] = { :log_level => :debug, :stream => :to_file }
	
	def self.readConfiguration	
		data = File.read('config/config.yml')
		config = YAML.load(data)
		config.keys.each do |k|
			Gileswatching.set k, config[k]
		end
	end
end