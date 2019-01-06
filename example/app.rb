require 'sinatra'
require 'sinatra/reloader'
require 'yaml'

set :run, false
set :raise_errors, true
set :protection, except: [:json_csrf]

get '/server-side' do
  redirect '/auth/facebook'
end

get '/auth/:provider/callback' do
  content_type 'application/json'
  MultiJson.encode(request.env)
end
