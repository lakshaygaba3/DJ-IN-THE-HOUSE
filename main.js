
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
    }
});
$('.play-icon').on('click',function() {
    toggleSong()
});
$('body').on('keypress',function(event) {
    if (event.keyCode == 32){
        toggleSong()
    }
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
    // console.log(song.currentTime);
    // console.log(song.duration);
    var currentTime = Math.floor(song.currentTime);
    currentTime = fancyTimeFormat(currentTime);

    var duration = Math.floor(song.duration);
    duration = fancyTimeFormat(duration)
    $('.time-elapsed').text(currentTime);
    $('.song-duration').text(duration);
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



function fetchSongs() {

    $.ajax({
        'url': 'https://jsonbin.io/b/59f713154ef213575c9f652f',
        'dataType': 'json',
        'method': 'GET',
        'success': function (responseData) {
            // do something with the data here
            songs = responseData ;
            setupApp();
        }
    }) ;

}

function setupApp() {
    changeCurrentSongDetails(songs[0]);
    for(var i =0; i < songs.length;i++) {
        var obj = songs[i];
        var name = '#song' + (i+1);
        var song = $(name);
        song.find('.song-name').text(obj.name);
        song.find('.song-artist').text(obj.artist);
        song.find('.song-album').text(obj.album);
        song.find('.song-length').text(obj.duration);
        addSongNameClickEvent(obj,i+1);
    }

    updateCurrentTime();
    setInterval(function() {
        updateCurrentTime();
    },1000);
}


