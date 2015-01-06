require 'sinatra'


get '/' do
  erb :index
end

post '/contact' do
  puts 'hello'
end