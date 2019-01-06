require 'bundler/setup'
require 'dotenv/load'
require 'omniauth-facebook'
require './app.rb'

puts "App ID #{ENV['FB_APP_ID']}, App Secret: #{ENV['FB_APP_SECRET']}"

use Rack::Session::Cookie, secret: 'abc123'

use OmniAuth::Builder do
  provider :facebook, ENV['FB_APP_ID'], ENV['FB_APP_SECRET']
end

run Sinatra::Application
