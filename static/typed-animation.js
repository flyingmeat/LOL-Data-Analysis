// typed.js animation
(function () {
    $(function(){
        $("#sentence1").typed({
            strings: ["LOL, ^600 a fantastic and fair game..."],
            typeSpeed: 0,
            contentType: 'text',
            startDelay: 0,
            showCursor: false
        });

        $("#sentence2").typed({
            strings: [" Maybe not that <span style='font-weight:bold; color:#ff775c'>Fair</span>?"],
            typeSpeed: 0,
            contentType: 'html',
            startDelay: 4200,
            showCursor: true,
            cursorChar: "|"
        });

        $("#sentence3").typed({
            strings: ["Let\'s see "],
            typeSpeed: 0,
            contentType: 'text',
            startDelay: 6900,
            showCursor: false
        });

        $("#sentence4").typed({
            strings: ["<span style='font-weight:bold;'>popular champions</span>.", "<span style='font-weight:bold;'>champion win rate</span>.", "<span style='font-weight:bold;'>who kills most</span>.", "<span style='font-weight:bold;'>different team data......</span>", "more and more Analysis."],
            typeSpeed: 0,
            contentType: 'html',
            startDelay: 7400,
            backDelay: 1500,
            showCursor: false,
        });
    });
})();