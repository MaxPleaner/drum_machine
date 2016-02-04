$(function () {
    sound_files = [
        "./hihat_closed2",
        "./909-klick",
        "./909-dist",
    ];
    buzzes = [];
    tracks = [];
    sound_files.forEach(function (file) {
        buzzes.push(
            new buzz.sound(file, {formats: ["aif"]})
        );
    });

    // register a sound to play when it is clicked
    $('.sound').on("click", function (e) {

        // what button we clicked
        var $button = $(this);

        // jquery can bind to data-x dom attributes
        var sound = $button.data("sound");
        var beat = $button.data("beat");

        // ensure this sound array has been initialized
        if (typeof tracks[sound] === 'undefined') {
            tracks[sound] = [];
        }

        // add or remove beat to our track
        // the track array no longer holds a 0 or 1 but instead the timestamp
        // at which this sound was played last
        if (typeof tracks[sound][beat] === 'undefined') {

            // beat being added and will be played on the next check
            tracks[sound][beat] = 0;
        } else {

            // beat should no longer be played
            delete tracks[sound][beat];
            $button.removeClass('playing');
        }
    });

    // check registered sounds and play them if enough time has passed
    window.setInterval(
        function () {
            // 0, 1, 2
            for (var sound in tracks) {
                var sounds = tracks[sound];

                // 0 - 15
                for (var beat in sounds) {

                    // the time this sound was last played
                    var timePlayedLast = sounds[beat];

                    // now
                    var currentTime = Date.now();

                    // the interval (ms) in which this sound should be played
                    var interval = 20 * (beat + 1);

                    // has there been enough time since we last played this sound?
                    if ((currentTime - timePlayedLast) > interval) {

                        // mark the button as playing
                        var $button = $("[data-sound='" + sound + "'][data-beat='" + beat + "']");
                        $button.addClass('playing');

                        // update our time last played
                        tracks[sound][beat] = currentTime;

                        // play the sound
                        buzzes[sound].play();

                        //console.log('playing ' + sound + '-' + beat + ' with interval ' + interval + 'ms');
                    }
                }
            }
        }, 20
    )

})
