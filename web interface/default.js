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
var bpmValue = 150;
var lastBpmValue = bpmValue;
var interval;

// BPM
var interval = 500;
// TIMER
var timeout;
var pointer = 0;
var previousPointer = 0;
// ELEMENTS
var bpm, bpmValueText, sequence, beat, circle, controls, icons, w, buttonContainer, button, allSequencesContainer, sequenceMini, beatMini, playButton, clearButton, addButton, removeButton;


// SEQUENCER
var sequenceData = [
    [0, 0, 0, 0, 0, 0, 0, 0]
];

$(document).ready(function() {

    mode = ($('#sequence-mode')[0] != undefined) ? true : false;

    // ELEMENTS
    w = $(window);
    bpm = $("#bpm-container");
    bpmValueText = $("#bpm-value");
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

    // UPDATE SLIDER
    $('input[type="range"]').rangeslider({
        polyfill: false,
        // Callback function
        onInit: function() {

        },

        // Callback function
        onSlide: function(position, value) {
            bpm.css({
                width: "10%"
            });
            bpmValue = value;
            bpmValueText.text(value);
            bpmValueText.addClass("visible").css((value < 150) ? {
                bottom: "inherit",
                color: "black"
            } : {
                bottom: "0",
                color: "white"
            });

        },

        // Callback function
        onSlideEnd: function(position, value) {
            bpm.css({
                width: "5%"
            });
            bpmValueText.removeClass("visible");

            // IF BPM HAS CHANGED UPDATE THE SPEED
            if (bpmValue != lastBpmValue) {
                
                // STOP INTERVAL
                clearRequestInterval(interval);
                
                // RESTART INTERVAL
                step();
                interval = requestInterval(step, 60000/bpmValue);

            }

            lastBpmValue = bpmValue;
        }
    });;

    // $('input').on('input', function () {    
    //     console.log($(this).val());
    // });



    $('#switch-UI').hammer().on('tap', function() {
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
    // ACTIVATE SEQUENCE MINI
    sequenceMini.addClass("active");

    resizeHandler();

    if (mode) {
        console.log("sequence");



        // SEND REQUEST
        // var xhr = new XMLHttpRequest();                        
        // xhr.open('POST','http://192.168.100.181/ss.lua?bpm=100&p=1'/*&r=4*/,true);                        
        // xhr.send('');

        /*
        //
        // EVENT LISTENERS 
        //
        */

        // BEAT
        beat.hammer().on('tap', function() {

                var clickedId = $(this).index();

                // BIG TILE
                $(this).toggleClass("selected");
                //$(".beat-mini")[(activeSequence-1*8)+$(this).index()].toggleClass("selected");
                // SMALL TILE
                // $(".beat-mini:eq("+(activeSequence*8)+clickedId+1+")").toggleClass("selected");
                $(".beat-mini:eq(" + ((activeSequence * 8) + clickedId) + ")").toggleClass("selected");
                sequenceData[activeSequence][clickedId] = (sequenceData[activeSequence][clickedId] == 1) ? 0 : 1;

            })
            // ADD BUTTON
        addButton.hammer().on('tap', function() {
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
        removeButton.hammer().on('tap', function() {
                if (noOfSequences > 1) {
                    allSequencesContainer.children().last().remove();
                    noOfSequences--;
                    sequenceData.pop();
                    pointer = 0;
                    previousPointer = 0;
                }
            })
            // PLAY/STOP BUTTON
        playButton.hammer().on('tap', function() {
                var state = jQuery.data(playButton, "state");


                if (state) {
                    state = false;
                    clearRequestInterval(interval);

                } else {
                    state = true;
                    step();
                    interval = requestInterval(step, bpmValue);
                }

                jQuery.data(playButton, "state", state);
                console.log(state);
            })
            // CLEAR BUTTON
        clearButton.hammer().on('tap', function() {

                if (confirm("Destroy everything?") == true) {
                    
                    // IF SEQUENCE IS PLAYING STOP IT
                    var state = jQuery.data(playButton, "state");
                    
                    if(state){

                    	clearRequestInterval(interval);

                     }

                    // RESET ALL VALUES
                    noOfSequences = 1;
                    activeSequence = 0;

                    // MOVE POINTER TO 0
                    var pointer = 0;
                    var previousPointer = 0;

                    // RESET ARRAY
                    var sequenceData = [
                        [0, 0, 0, 0, 0, 0, 0, 0]
                    ];

                    // REMOVE ALL CHILDREN EXCEPT OF ONE
                    var noOfChildren = allSequencesContainer.children().length;

                    // REMOVE ALL SEQUENCES EXCEPT ONE
                    for (var n = noOfChildren; n > 1; n--) {
                        allSequencesContainer.children().last().remove();
                    }

                    //CLEAR ALL BEATS
                    beat.removeClass("selected active");
                    $(".beat-mini").removeClass("selected");

                    // RESTART SEQUENCE
                    step();
                    interval = requestInterval(step, bpmValue);


                } else {
                    console.log("no");
                }
            })
            // BPMs
            /*  bpm.hammer({
            time: 0,
            threshold: 0
        }).on('tap', function(e) {
            console.log("tPPED")
        });
*/
            // START SEQUENCE AND SET INTERVAL
        step();
        interval = requestInterval(step, bpmValue);

    } else {

        console.log("button mode");


        /*
        //
        // LISTEN FOR TAPPING IN BUTTON MODE 
        //
        */

        button.hammer({}).on('tap', function(e) {
            console.log("button pressed");
            // SEND REQUEST
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://192.168.100.181/ss.lua?bpm=300&p=1' /*&r=4*/ , true);
            xhr.send('');
            // CHANGE ACTIVE STATE
            buttonContainer.toggleClass("active");
            // CHANGE BACK TO NORMAL STATE   
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
        //lastFillHeight = bpmFill.height();
        //fillMaxHeight = windowHeight * 0.85;

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
            
            left: clearance,
            "margin-right": clearance
        });
        $(".beat-mini").css({
        	height: miniSequenceHeight,
            top: clearance,
            width: miniSequenceHeight
        });

        // SIZE OF BPM TEXT
        bpmValueText.css({
            "font-size": (windowWidth * 0.05) + "px"
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


}

function step() {

    // UPDATE POINTER
    updateBeats(previousPointer, pointer);
    //console.log(pointer);

    // MOVE TO NEXT SEQUENCE IF MORE THAN ONE UPDATE THE BEATS AND HIGHLIGHT IT
    if (pointer == 0 && noOfSequences > 1) {
    	
    	var previousSequence = activeSequence;
    	
    	// REMOVE HIGHLIGHT FROM PREVIOUS SEQUENCE
		$(".sequence-mini").eq( previousSequence ).removeClass("active");
		
		// HIGHLIGHT NEW SEQUENCE
		activeSequence++;
        activeSequence = activeSequence % noOfSequences;
		$(".sequence-mini").eq( activeSequence ).addClass("active");
        
        console.log(activeSequence + " - " + noOfSequences);
        updateSequence(activeSequence);

    }
    // MOVE POINTER
    previousPointer = pointer;
    pointer = (pointer + 1) % 8;



}

function updateSequence(id) {
    beat.each(function() {
        var beatNo = $(this).index();
        if (sequenceData[id][beatNo] == 1) $(this).addClass("selected");
        else $(this).removeClass("selected");
    });

}

/*!
 * Behaves the same as setInterval except uses requestAnimationFrame() where possible for better performance
 * modified gist.github.com/joelambert/1002116
 * the fallback function requestAnimFrame is incorporated
 * gist.github.com/joelambert/1002116
 * gist.github.com/englishextra/873c8f78bfda7cafc905f48a963df07b
 * jsfiddle.net/englishextra/sxrzktkz/
 * @param {Object} fn The callback function
 * @param {Int} delay The delay in milliseconds
 * requestInterval(fn, delay);
 */
var requestInterval = function(fn, delay) {
    var requestAnimFrame = (function() {
            return window.requestAnimationFrame || function(callback, element) {
                window.setTimeout(callback, 1000 / 60);
            };
        })(),
        start = new Date().getTime(),
        handle = {};

    function loop() {
        handle.value = requestAnimFrame(loop);
        var current = new Date().getTime(),
            delta = current - start;
        if (delta >= delay) {
            fn.call();
            start = new Date().getTime();
        }
    }
    handle.value = requestAnimFrame(loop);
    return handle;
};
/*!
 * Behaves the same as clearInterval except uses cancelRequestAnimationFrame()
 * where possible for better performance
 * gist.github.com/joelambert/1002116
 * gist.github.com/englishextra/873c8f78bfda7cafc905f48a963df07b
 * jsfiddle.net/englishextra/sxrzktkz/
 * @param {Int|Object} handle function handle, or function
 * clearRequestInterval(handle);
 */
var clearRequestInterval = function(handle) {
    if (window.cancelAnimationFrame) {
        window.cancelAnimationFrame(handle.value);
    } else {
        window.clearInterval(handle);
    }
};
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