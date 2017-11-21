
function toggleSong() {
    var song = document.querySelector('audio');

    if(song.paused == true) {
        console.log('Playing');
        $('.play-icon').removeClass('fa-play').addClass('fa-pause');
        song.play();
    }
    else {
        console.log('Pausing');
        $('.play-icon').removeClass('fa-pause').addClass('fa-play');
        song.pause();
    }
}

$(document).ajaxStart(function(){
    $("#wait").css("display", "block");
});
$(document).ajaxComplete(function(){
    $("#wait").css("display", "none");
});
$("button").click(function(){
    $("#txt").load("demo_ajax_load.asp");
});

$('#replace-song').on('click', function (){
    var songName = $('#song-name-input');
    var songArtist = $('#song-artist-input');
    var songAlbum = $('#song-album-input');
    var songDuration = $('#song-duration-input');
    var songURL = $('#song-url-input');
    var songVideo = $('#song-video-input');
    var songLyrics = $('#song-lyrics-input');
    var songImage = $('#song-image-input');

    songs[3] = {
        'name': songName.val(),
        'artist': songArtist.val(),
        'album': songAlbum.val(),
        'duration': songDuration.val(),
        'fileName': songURL.val(),
        'videoLink': songVideo.val(),
        'lyricsLink': songLyrics.val(),
        'image': songImage.val()
    };

    songName.val('');
    songArtist.val('');
    songAlbum.val('');
    songDuration.val('');
    songURL.val('');
    songVideo.val('');
    songLyrics.val('');
    songImage.val('');
    setupApp();

});

$("#song1").hover(function(){
    $('.song-lyrics').removeClass('hidden');
    });

$('.welcome-screen button').on('click', function() {
    var name = $('#name-input').val();

    if(name.length > 2) {
        var message = "Welcome, " +  name;
        $('.main .user-name').text(message);
        $('.welcome-screen').addClass('hidden');
        $('.main').removeClass('hidden');
        fetchSongs() ;

    }
    else {
        $('#name-input').addClass('error');
        $('#error-text').removeClass('hidden');
    }
});

$('#logout').click(function(){
    $('.welcome-screen').removeClass('hidden');
    $('.main').addClass('hidden');
    $('#name-input').val("");
    $('#name-input').removeClass('error');
    $("#error-text").addClass('hidden');
});

$('.play-icon').on('click',function() {
    toggleSong()
});
function fancyTimeFormat(time)
{
    // Hours, minutes and seconds
    var hrs = ~~(time / 3600);
    var mins = ~~((time % 3600) / 60);
    var secs = time % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

function updateCurrentTime() {
    var song = document.querySelector('audio');
    var currentTime = Math.floor(song.currentTime);
    var duration = Math.floor(song.duration);
    var remainingTime = duration - currentTime;
    currentTime = fancyTimeFormat(currentTime);
    duration = fancyTimeFormat(duration);
    remainingTime = fancyTimeFormat(remainingTime);
    console.log(currentTime);
    $('.time-elapsed').text(currentTime);
    $('.song-duration').text(duration);
    $('.time-left').text(remainingTime);
}
var fileNames = ['song1.mp3','song2.mp3','song3.mp3','song4.mp3'];

function changeCurrentSongDetails(songObj) {
    $('.current-song-image ').attr('src', songObj.image) ;
    $('.current-song-name').text(songObj.name) ;
    $('.current-song-album').text(songObj.album) ;
}

// make a function for selecting different songs to imply pause and play feature
function addSongNameClickEvent(songObj,position) {
    var songName = songObj.fileName; // New Variable
    var id = '#song' + position;
    $(id).click(function() {
        var audio = document.querySelector('audio');
        console.log(audio);
        var currentSong = audio.src;
        if(currentSong.search(songName) != -1)
        {
            toggleSong()
        }
        else {
            audio.src = songName;
            toggleSong()
            changeCurrentSongDetails(songObj); // Function Call
        }
    });

}

var songs = [];

$('.total-songs').text("Songs: " + songs.length);

function fetchSongs() {

    $.ajax({
        'url': 'https://jsonbin.io/b/59f713154ef213575c9f652f',
        'dataType': 'json',

        'method': 'GET',
        'success': function (responseData) {
            // do something with the data here
            songs = responseData ;
            setupApp();
            $('.total-songs').text("Songs: " + songs.length);

        }
    }) ;
    $('body').on('keypress',function(event) {
        if (event.keyCode == 32 || event.keyCode == 80 || event.keyCode == 112){
            toggleSong()
        }
    });

}

function setupApp() {
    changeCurrentSongDetails(songs[0]);
    for(var i =0; i < songs.length ;i++) {
        var obj = songs[i];
        var name = '#song' + (i+1);
        var song = $(name);
        song.find('.song-name').text(obj.name);
        song.find('.song-artist').text(obj.artist);
        song.find('.song-album').text(obj.album);
        song.find('.song-length').text(obj.duration);
        song.find(' .song-lyrics').html('<a target="_blank" href="' + obj.lyricsLink +'">See Lyrics</a>');
        song.find(' .song-video').html('<a target="_blank" href="' + obj.videoLink +'">Watch Video</a>');
        addSongNameClickEvent(obj,i+1);
    }

    updateCurrentTime();
    setInterval(function() {
        updateCurrentTime();
    },1000);
}


