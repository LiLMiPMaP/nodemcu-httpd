var mode;
var circleDiameter;
var noOfBeatsInSequence = 8;
var beatWidth;
var lastFillHeight;
var fillMaxHeight;
var windowWidth;
var windowHeight;
var noOfSequences = 1;
var activeSequence = 0;

// BPM
var interval = 500;
// TIMER
var timeout;
var pointer = 0;
var previousPointer = 0;
// ELEMENTS
var bpm, bmpFill, sequence, beat, circle, controls, icons, w, buttonContainer, button, allSequencesContainer, sequenceMini, beatMini, playButton, clearButton, addButton, removeButton;


// SEQUENCER
var sequenceData = [
    [0, 0, 0, 0, 0, 0, 0, 0]
];

$(document).ready(function() {

    mode = ($('#sequence-mode')[0] != undefined) ? true : false;

    // ELEMENTS
    w = $(window);
    bpm = $("#bpm-container");
    bpmFill = $("#bpm-fill");
    sequence = $("#sequence");
    beat = $("#sequence li");
    circle = $(".circle");
    controls = $("#controls-container");
    icons = $(".icon");
    buttonContainer = $("#button-container");
    button = $("#button");
    allSequencesContainer = $('#all-sequences-container');
    playButton = $("#play-stop");
    addButton = $("#add");
    clearButton = $("#clear-all");
    removeButton = $("#remove");

    // ASSIGN DATA TO PLAYBUTTON
    jQuery.data(playButton, "state", true);

    /*
    //
    // DYNAMIC CONTENT 
    //
    */
    sequenceMini = $('<div class="sequence-mini"><div class="beat-mini"></div><div class="beat-mini"></div><div class="beat-mini"></div><div class="beat-mini"></div><div class="beat-mini"></div><div class="beat-mini"></div><div class="beat-mini"></div><div class="beat-mini"></div></div>');
    beatMini = sequenceMini.find('.beat-mini');

    function launchIntoFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    // Launch fullscreen for browsers that support it!
    launchIntoFullscreen(document.documentElement); // the whole page

    $('#switch-UI').hammer().bind('tap', function() {
        window.location.href = (mode) ? "/button" : "/";
    });

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            elem.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    /*
    //
    // RESIZE 
    //
    */

    allSequencesContainer.append(sequenceMini);

    resizeHandler();

    if (mode) {
        console.log("sequence");



        // SEND REQUEST
        // var xhr = new XMLHttpRequest();                        
        // xhr.open('POST','http://192.168.43.147/ss.lua?bpm=120&p=1',true);                        
        // xhr.send('');

        /*
        //
        // EVENT LISTENERS 
        //
        */

        // BEAT
        beat.hammer().bind('tap', function() {

                var clickedId = $(this).index();

                // BIG TILE
                $(this).toggleClass("selected");
                //$(".beat-mini")[(activeSequence-1*8)+$(this).index()].toggleClass("selected");
                // SMALL TILE
                // $(".beat-mini:eq("+(activeSequence*8)+clickedId+1+")").toggleClass("selected");
                console.log($(".beat-mini:eq(" + ((activeSequence * 8) + clickedId) + ")").toggleClass("selected"));
                sequenceData[activeSequence][clickedId] = (sequenceData[activeSequence][clickedId] == 1) ? 0 : 1;

            })
            // ADD BUTTON
        addButton.hammer().bind('tap', function() {
                var newSequenceMini = sequenceMini.clone();
                // CLEAR THE NEW SEQUENCE FROM SELECTED BEATS
                newSequenceMini.find(".beat-mini").removeClass("selected");
                // APPEND THE NEW SEQUENCE
                allSequencesContainer.append(newSequenceMini);
                noOfSequences++;
                sequenceData.push([0, 0, 0, 0, 0, 0, 0, 0]);

                //console.log(allSequencesContainer.children().length);

            })
            // REMOVE BUTTON
            // NOTE: USE DETACH IN THE FUTURE
        removeButton.hammer().bind('tap', function() {
                if (noOfSequences > 1) {
                    allSequencesContainer.children().last().remove();
                    noOfSequences--;
                    sequenceData.pop();
                    console.log(allSequencesContainer.children().length);
                }
            })
            // PLAY/STOP BUTTON
        playButton.hammer().bind('tap', function() {
        	console.log(jQuery.data(playButton, "state"));
              // jQuery.data(playButton, "state",)=false;
               jQuery.data(playButton, "state",(jQuery.data(playButton, "state"))? false:true);
            })
        // CLEAR BUTTON
        clearButton.hammer().bind('tap',function(){

        	 if (confirm("Destroy everything?") == true) {
       console.log("yes");
      
       noOfSequences = 1;
       activeSequence = 0;
var pointer = 0;
var previousPointer = 0;
var sequenceData = [[0, 0, 0, 0, 0, 0, 0, 0]];
// REMOVE ALL CHILDREN EXCEPT OF ONE
var noOfChildren = allSequencesContainer.children().length();

for(var n=noOfChildren;n>1;n--)
{
allSequencesContainer.children().last().remove();
}

    } else {
       console.log("no");
    }
        })
            // BPMs
        bpm.hammer({
            time: 0,
            threshold: 0
        }).bind('tap', function(e) {
            console.log("tPPED")
        });


        initTimer(1000);

    } else {

        console.log("button mode");


        /*
        //
        // LISTEN FOR TAPPING IN BUTTON MODE 
        //
        */

        button.hammer({}).bind('tap', function(e) {
            console.log("button pressed");
            buttonContainer.toggleClass("active");
            setTimeout(function() {
                buttonContainer.toggleClass("active");
            }, 50);

        });
    }


    /*
    //
    // LISTEN FOR RESIZE CHANGES 
    //
    */

    window.addEventListener("resize", function() {
        resizeHandler();

    }, false);

})



// SETUP BEATS
function updateBeats(previousPointer, currentPointer) {

    $("#sequence li:eq( " + previousPointer + " )").toggleClass("active");
    $("#sequence li:eq( " + currentPointer + " )").toggleClass("active");

}

function resizeHandler() {
    windowWidth = w.outerWidth();
    windowHeight = w.outerHeight();

    if (mode) {

        // BPM
        lastFillHeight = bpmFill.height();
        fillMaxHeight = windowHeight * 0.85;

        // BEAT 
        beatWidth = (100 / noOfBeatsInSequence);
        beat.each(function() {
            $(this).css("width", beatWidth + "%")
        });

        // CIRCLES IN BEATS
        circleDiameter = beat.width() * 0.33;
        circle.each(function() {
            $(this).css({
                height: circleDiameter,
                width: circleDiameter,
                top: circleDiameter,
                left: circleDiameter
            })
        });

        // MINI SEQUENCES
        var miniSequenceContainerHeight = windowHeight * 0.1;
        var miniSequenceHeight = miniSequenceContainerHeight * 0.6;
        var clearance = (miniSequenceContainerHeight - miniSequenceHeight) * 0.5;

        sequenceMini.css({
            height: miniSequenceHeight,
            top: clearance,
            left: clearance,
            "margin-right": clearance
        });
        beatMini.css({
            width: miniSequenceHeight
        });


    } else {
        var size = (windowWidth > windowHeight) ? windowHeight * 0.6 : windowWidth * 0.6;
        circleDiameter = size * 0.33;
        // BUTTON
        button.css({
            width: size,
            height: size,
            top: (windowHeight - size) * 0.5,
            left: (windowWidth - size) * 0.5
        });

        // BALL
        circle.each(function() {
            $(this).css({
                height: circleDiameter,
                width: circleDiameter,
                top: circleDiameter,
                left: circleDiameter
            })
        });


        console.log(size + " - " + windowWidth + " - " + windowHeight);
    }
    // ICONS
    var controlsSize = windowHeight * 0.15 * 0.8;
    icons.css({
        width: controlsSize,
        height: controlsSize,
        top: controlsSize / 10
    });

    /*
    //
    // MULTIPLE SEQUENCES 
    //
    */

}

function initTimer() {

    var expected = Date.now() + interval;
    setTimeout(step, interval);

    function step() {
        var dt = Date.now() - expected; // the drift (positive for overshooting)
        if (dt > interval) {
            // something really bad happened. Maybe the .rower (tab) was inactive?
            // possibly special handling to avoid futile "catch up" run
        }

        // UPDATE POINTER
        updateBeats(previousPointer, pointer);
        //console.log(pointer);

        // MOVE TO NEXT SEQUENCE IF MORE THAN ONE
        if (pointer == 0 && noOfSequences > 1) {
            activeSequence++;
            activeSequence = activeSequence % noOfSequences;
            console.log(activeSequence + " - " + noOfSequences);
            updateSequence(activeSequence);

        }
        // MOVE POINTER
        previousPointer = pointer;
        pointer = (pointer + 1) % 8;



        // CALCULATE DELAY IF ANY
        expected += interval;
        timeout = setTimeout(step, Math.max(0, interval - dt)); // take into account drift
    }
}

function updateSequence(id) {
    beat.each(function() {
        var beatNo = $(this).index();
        if (sequenceData[id][beatNo] == 1) $(this).addClass("selected");
        else $(this).removeClass("selected");
    });

}

/*

	function updateTiles()
	{


	}

	function clearTimer()
	{
	}

	function updateTimer()
	{
		

	}

	Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}*/