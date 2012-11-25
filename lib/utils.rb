require 'securerandom'
def randomID
  chars = 'abcdefghjkmnpqrstuvwxyz1234567890'
  s = ''
  5.times { s << chars[rand(chars.size)] }
  return s
end

def validID?( id )
  /^[a-zA-Z0-9]{5}$/ =~ id
end
