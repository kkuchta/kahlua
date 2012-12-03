desc "Compile to single file"
task :compile, :filename do |t,args|
  puts "Compiling to a single file."

  require 'haml'
  require 'nokogiri'
  require 'net/http'
  require 'uri'
  require 'Excon'

  inputFile = File.new( args.filename )
  html = inputFile.read()

  if( /\.haml$/ =~ args.filename )
    puts "haml detected, converting to html"
    html =Haml::Engine.new(html).to_html()
  end

  doc = Nokogiri::HTML(html);
  doc.css('script').each do |script|
    src = script['src']
    script.delete 'src'
    scriptContent = getContents( src, 'public' )
    script.children = Nokogiri::XML::Text.new(scriptContent,doc)
  end

  doc.css('link').each do |link|
    href = link['href']
    link.delete 'href'
    content = getContents( href, 'public' )
    link.swap( '<style type="text/css">' + content + '</style>' )
    link.children = Nokogiri::XML::Text.new(content,doc)
  end

  File.open('out/out.html', 'w') { |file|
    file.write(doc.serialize())
  }
  
end

# Get the contents of a local file or web url
def getContents( name, dir )
  if( /^https?:\/\// =~ name )
    begin
      response = Excon.get( name, :expects => [200] )
    rescue Exception => e
      puts "Error - failed to load #{name}, got non-200 code."
      return ''
    end
    response.body
  else
    open('public/' + name).read
  end
end
