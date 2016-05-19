

var AUTO_LOAD_LEVEL_ON_DOCUMENT_READY = true;

// For scripts to attach public functions to
// See bottom of "Public Functions" in the load scripts
var sr = {};


/*
 * Animals and Easter Egg
 **************************/

var PIECE = {
    LIST: [
        [], [], // Index (size) 0, 1 empty. No animals of that size.
        ['zebra', 'lion'],
        ['elephant', 'giraffe']
    ],

    JEEP_IMG_NAME:  'jeep',

    IMG_DIR:        'images/animals/',
    IMG_EXT:        '.png',

    AUDIO_DIR:      'audio/animals/',
    AUDIO_EXT:      '.mp3'
};

var EASTER_EGG = {
    CLICKS_NEEDED:  10,    // # of consecutive clicks to activate
    CLICK_SPEED:    400,   // Consecutive click speed in ms
    AUDIO_SRC:      'audio/CrocHunterCrikey3.wav'
};

/*
 * DIV ID's and Classnames
 **************************/

var DIV_ID = {
    BOARD:          'gameBoard',
    NUM_MOVES:      'numMoves',
    TIMER:          'timerDisplay',
    MUTE:           'volume',

    JEEP:           'jeep',

    LEVEL_COMPLETE_MODAL:   'levelCompleteModal',
    NEXT_LEVEL_BUTTON:      'nextLevelBtn',
    RANDOM_LEVEL_BUTTON:    'randomLevelBtn',
    SUBMIT_SCORE_BUTTON:    'submitScoreBtn',
    PLAYER_NAME_INPUT:      'playerNameInput'
};

var PIECE_CLASSNAME = {
    ALL:        'piece',
    HORIZONTAL: 'dragX',
    VERTICAL:   'dragY',
    SIZE:       ['', '', 'size2', 'size3']
};

/*
 * Scoring
 **************************/

var SCORING = {
    DIFFICULTY_MULTIPLIER:  100,
    MOVES_MULTIPLIER:       0.98,
    SECONDS_MULTIPLIER:     0.999
};

var TOTAL_LEVELS = 2;

/*
 * AJAX
 **************************/

var AJAX_URL = {
    GET_LEVEL:      'http://team23.site88.net/db/getLevel.php',
    SUBMIT_SCORE:   'http://team23.site88.net/db/submitScore.php',
    LEADERBOARD:    'http://team23.site88.net/leaderboard.php'
};

// Gets and returns response to callback() using AJAX
sr.ajaxGet = function(url, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            callback(xhttp.responseText);
        }
    };
    xhttp.open("GET", url);
    xhttp.send();
}

/*
 * DOM Objects and Related
 **************************/

var BOARD;
var NUM_MOVES;
var TIMER;

var BOARD_LENGTH_PX;

// Initialize variables on document ready
$(document).ready(function() {
    BOARD     = $('#' + DIV_ID.BOARD);
    NUM_MOVES = $('#' + DIV_ID.NUM_MOVES);
    TIMER     = $('#' + DIV_ID.TIMER);
    MUTE      = $('#' + DIV_ID.MUTE);
    BOARD_LENGTH_PX = BOARD.width();
});

/*
 * LEVELS
 **************************/

var LEVELS_STRING = [,
    // Level 1 - 5
    '1,6,5,2,0021,5013,0113,3113,1221j,0412,4421,2531',
    '2,6,5,2,0012,3031,3112,5113,0221j,4212,0331,2412,4421,0521,3521',
    '3,6,5,2,1221j,3213,1321,5313,1412,2521',
    '4,6,5,2,0013,3013,1221j,2312,3331,5412,2531',
    '5,6,5,2,0021,3013,5012,0113,4113,1221j,5212,1331,0412,4421,4521',

    // Level 6-10
    '6,6,5,2,0021,0121,0321,0412,1221j,2312,3012,3213,3531,4113,5113',
    '7,6,5,2,1012,2021,4012,5012,3112,1221j,5212,2321,3412',
    '8,6,5,2,0221j,0321,0421,0521,2121,2212,2412,3021,3212,3431,3531,4112,4321,5013',
    '9,6,5,2,0221j,0313,1012,1331,2021,2412,3112,4021,4121,4213,5212,5412',
    '10,6,5,2,0021,0121,0213,0521,2012,1221j,1331,3412,4021,4421,4521,5113',

    // Level 11-15
    '11,6,5,2,1221j,0013,1021,3013,2312,3331,5412,2531',
    '12,6,5,2,0221j,0012,1021,5013,2113,3331,4412,0531',
    '13,6,5,2,3221j,0021,2021,4012,2112,5113,1212,0313,3321,3412,4421,1521,4521',
    '14,6,5,2,2221j,0021,2012,4121,0212,1212,2221,2321,4212,5212,2412,4421,0521',
    '15,6,5,2,2221j,1021,3021,0121,2121,4113,5113,0213,1213,2312,3312,4421,1521,3521',

    // Level 16-20
    '16,6,5,2,3221j,0021,2021,4012,5013,0112,2121,1212,2213,3331,0521',
    '17,6,5,2,0221j,0012,1031,2121,4121,2212,0321,0431,0531,3313,4412,5412',
    '18,6,5,2,1221j,0021,0121,2012,3013,0213,1331,1421,0531',
    '19,6,5,2,2221j,2012,3021,4112,1212,2321,4312,1431',
    '20,6,5,2,0221j,0012,3031,1121,3112,2212,5213,2412,3421,3531',

    // Level 21-25
    '21,6,5,2,1221j,0021,2012,3013,0113,1331,3531',
    '22,6,5,2,1221j,0112,2012,3031,3113,4121,1312,4321,0412,2421,5412,1531',
    '23,6,5,2,3221j,2031,5013,2112,3121,2312,3312,4321,4421,2531',
    '24,6,5,2,2221j,0212,1112,2012,3021,1321,4212,0431,0521,4412',
    '25,6,5,2,1221j,0021,0121,2012,4021,5113,0213,4212,1331,1412,3412,4421,4521',

    // Level 26-30
    '26,6,5,2,1221j,3031,0112,3112,4113,5212,0312,1331,2412,5412,3521,1012',
    '27,6,5,2,0221j,0012,1021,1121,3013,2212,3321,5213,2412,3531',
    '28,6,5,2,0221j,0031,3012,4121,2113,0312,1312,3321,5313,2431,0521,2521',
    '29,6,5,2,0221j,0031,4013,2112,5212,0312,1321,1421,3321,3412,5412,0531',
    '30,6,5,2,1221j,0013,2012,3031,3112,0321,2321,5313,0521,2521',

    // Level 31-35
    '31,6,5,2,1221j,0021,3031,3112,4121,0212,5213,2313,3321,0421,3531',
    '32,6,5,2,0221j,0021,2013,3012,4021,0312,1321,3321,5313,3412,0521',
    '33,6,5,2,0221j,1012,2013,4021,0312,1321,3321,5313,1421,3412,4412,0531',
    '34,6,5,2,0221j,0012,3031,3112,5113,4212,0331,3312,2412,4421,0521,3521',
    '35,6,5,2,0221j,2013,3021,5013,3112,0312,1331,1421,3412,4412,0521',

    // Level 36-40
    '36,6,5,2,2221j,0013,1031,4021,1112,2121,5113,0331,3312,2412,4421,0521',
    '37,6,5,2,1221j,0021,2012,4021,0121,4113,5113,0213,1331,3412,4421,4521,0521',
    '38,6,5,2,0221j,0012,3031,1121,3112,2212,5213,3321,2412,3421,3531',
    '39,6,5,2,0221j,2012,3031,3112,2212,5213,0321,3321,0412,1412,2421,2521',
    '40,6,5,2,3221j,0013,1021,4012,1112,2112,5113,0331,3312,2412,4421,0521,3521'
];