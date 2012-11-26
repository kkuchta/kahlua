require 'sinatra'
require './lib/utils'
set :environment, :development
require "sinatra/reloader" if development?

get '/' do
  haml :index
end
