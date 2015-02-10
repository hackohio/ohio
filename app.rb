# --------------------------
# OHI/O
# The Hackathon at Ohio State
# Matt Faluotico
# Kevin Payravi
# --------------------------

require 'sinatra'
require 'mail'
require 'mailchimp'

MAILCHIMP_API_KEY = "28449532bfbee447fa34d0030504254d-us10"

def init_mailchimp
  $mailchimp = Mailchimp::API.new(MAILCHIMP_API_KEY)
  puts 'mailchimp is good' if $mailchimp
end

def subscribe (email)
  
  begin
  $mailchimp.lists.subscribe('23221b96a8', { :email => email,
    :update_existing => true})
  rescue Mailchimp::ListAlreadySubscribedError
    puts "#{email} is already on the list"
  rescue Mailchimp::Error
    puts "error :("
  end

  puts "#{email} was subscribed to the mailing list"
  
end

# called when server launches
configure do
  init_mailchimp
end

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
      to    'buckeyehackers+web@gmail.com'
  end

  puts email.to_s
  email.delivery_method :sendmail
  email.deliver!
end

post '/subscribe' do
  email = params[:email]
  subscribe email
end