require 'sinatra'
require './lib/utils'
set :environment, :development
require "sinatra/reloader" if development?

get '/hi' do
  "Hello World!"
end

get '/id/?:id?' do
  id = params[:id] ? params[:id] : randomID
  if(!validID?(id))
    "invalid id " + id
  else
    'id='+id
  end
end

get '/' do
  haml :index
end
