require 'sinatra'


get '/' do
  erb :index
end

post '/contact' do

  from = params[:email]
  subj =  params[:subject]
  cont = params[:content]

  email = Mail.new do
      body  cont
      from  from
      subject subj
      to    'matt.faluotico+devtest@gmail.com'
  end

  puts email.to_s
  email.delivery_method :sendmail
  email.deliver!

  # redirect '/'
end


