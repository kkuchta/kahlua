var COLUMN_WIDTH = 150;
$( function(){
    $(document).on('mouseenter', '.imgurImage', null, hoverHandler); 
    $('#images').masonry({
        columnWidth : COLUMN_WIDTH,
        isAnimated: true
    });

    $('#bottomOfImages').waypoint(function(){
        addImages(5);
    },{
        offset: '100%'
    });

    controls.bindEvents();
    controls.restoreState();
} );

function addImages( countToLoad ){
    var countLoaded = 0;
    var displayImage = function($img){

        $img.css('float','left');
        $('#images').append($img);

        if( controls.kittens.getChecked() ){
            var width = $img.prop('width');
            var height = $img.prop('height');
            var kittenSize = getKittenSize({width:width,height:height});
            var kittenURL = 'http://placekitten.com/' + kittenSize.width + '/' + kittenSize.height;
            $img.attr('src',kittenURL);
        }
        setImageSize( $img );
        $('#images').masonry( 'appended', $img, true );

        countLoaded++;
        if( countLoaded >= countToLoad ){
            console.log('finished!');
            $.waypoints('refresh');
        }
    };
    for( var i = 0; i < countToLoad; i++ ){
        getValidImage( displayImage );
    }
}

function hoverHandler( e ){
    var $imgClone = null;
    $img = $(this);
    var killClone = function(){
        $imgClone.remove();
        //$img.off( 'mouseout', killClone );
        //$img.css('opacity','1');
        $img.css('visibility','');
    };

    // Clone the image at full size
    $imgClone = $('<img>');
    $imgClone.css('position','absolute');
    $imgClone.attr('src',$img.attr('src'));
    var position = $img.position();
    $imgClone.css('left', position.left);
    $imgClone.css('top', position.top);
    $imgClone.css('max-height', 2000);
    $imgClone.css('max-width', 2000);

    $img.css('visibility','hidden');
    $imgClone.mouseout(killClone);
    $('#images').append($imgClone);
}

function setImageSize( $img ){
    var width = $img.prop('width');
    var newWidth = fixWidth( width, COLUMN_WIDTH, 3 );
    $img.css('width',newWidth);
    var height = $img.css('max-height',1000);
}

// Expects {width:123,height:123}
function getKittenSize( rawSize ){
    var width = rawSize.width;
    var height = rawSize.height;
    while( width >= 2000 || height >= 2000 ){
        width = Math.floor(width/2);
        height = Math.floor(height/2);
    }
    return {height:height,width:width};
}

/**
 * Snap width a grid line width (always rounding down)
 */
function fixWidth( width, gridWidth, maxGridLines ){
    for( var i=1; i < maxGridLines; i++ ){
        if( width > i * gridWidth && width <= (i+1) * gridWidth ){
            return (i) * gridWidth;
        }
    }
    return maxGridLines * gridWidth;
}

// Gets a valid jquery image object
function getValidImage( callback ){
    var url = getRandomUrl();
    var $img = $("<img class='imgurImage' src='" + url + "'>");

    // Hide the image but still add it to the body so the height/width load
    $img.css('position','absolute');
    $img.css('left','-10000px');
    $img.css('top','-10000px');
    $img.css('opacity','-10000px');
    $('body').append($img);
    $img.load(function(){
        if(
            (this.width == 161 && this.height == 81) || // kill non-existant images
            (this.width < COLUMN_WIDTH ) || // kill images smaller than 1 column
            (this.width < 25 || this.height < 25 ) // kill super thin/tall images
        ){
            console.log('gotbadimage');
            $img.remove();
            getValidImage(callback);
        }
        else{
            console.log("success");
            $img.css('position','relative');
            $img.css('left','0');
            $img.css('top','0');
            $img.detach();
            callback($img);
        }
    });
}

function getRandomUrl(){
    return 'http://i.imgur.com/' + makeid() + '.jpg';
}

// From http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    //console.log( 'id=' + text );
    return text;
}


var controls = (function(){
    var $container = $('#controls');

    var $kittenButton = $container.find('.kittens');
    var $reloadButton = $container.find('.reload');

    var saveState = function(){
        console.log('saving control state');
        var kittenChecked = pub.kittens.getChecked();
        console.log( 'kitten checked = ' + kittenChecked );
        localStorage.setItem( 'kittenButton', kittenChecked );
    };

    var pub = {
        kittens: {
            getChecked: function(){
                return $('.kittens').prop('checked');
            },
            setChecked: function( checked ){
                $('.kittens').prop('checked', checked );
            }
        },

        // Sets up the click events
        bindEvents: function(){
            $reloadButton.click(function(){
                console.log("reloading");
                $('.imgurImage').remove();
                addImages(5);
            });
            $kittenButton.change(function(){
                saveState();
            });

        },

        restoreState: function(){
            console.log('restoring state');
            var kittenChecked = (localStorage.getItem( 'kittenButton' ) === 'true');
            console.log( 'kitten checked = ' + kittenChecked );
            pub.kittens.setChecked( kittenChecked );
        }
    };
    return pub;
})();
