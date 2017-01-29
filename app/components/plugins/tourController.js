angular
    .module('altairApp')
    .controller('tourCtrl', [
        '$scope',
        '$timeout',
        function ($scope,$timeout) {

            function tourInit() {
                // This tour guide is based on EnjoyHint plugin
                // for more info/documentation please check https://github.com/xbsoftware/enjoyhint

                // initialize instance
                var enjoyhint_instance = new EnjoyHint({});

                // config
                var enjoyhint_script_steps = [
                    {
                        "next #header_main": 'Hello, In this short tour guide I\'ll show you<br>' +
                        'some features/components included in Altair Admin.<br>' +
                        'This is the main header.<br>' +
                        'Click "Next" to proceed.'
                    },
                    {
                        "next #full_screen_toggle" : "Here you can activate fullscreen.",
                        shape : 'circle',
                        radius: 30,
                        showSkip: false
                    },
                    {
                        "click #main_search_btn" : "Click this icon to show search form.",
                        shape : 'circle',
                        radius: 30,
                        showSkip: false
                    },
                    {
                        "next #header_main" : "This is the main search form.",
                        showSkip: false
                    },
                    {
                        "next #style_switcher_toggle" : "When you click on that icon '<i class='material-icons'>&#xE8B8;</i>'<br>" +
                        "you will activate style switcher.<br>" +
                        "There you can change <span class='md-color-red-500'>c</span><span class='md-color-light-blue-500'>o</span><span class='md-color-red-500'>l</span><span class='md-color-orange-500'>o</span><span class='md-color-pink-500'>r</span><span class='md-color-light-green-500'>s</span> and few other things.",
                        shape : 'circle',
                        radius: 30,
                        showSkip: false
                    },
                    {
                        "next #sidebar_main": "This is the primary sidebar.<br>" +
                        "Click 'Next' to find out how to close this sidebar.<br>",
                        showSkip: false
                    },
                    {
                        "key #sSwitch_primary" : "Click this icon to close primary sidebar.",
                        shape : 'circle',
                        radius: 30,
                        "skipButton" : {text: "Finish"}
                    }
                ];

                // set script config
                enjoyhint_instance.set(enjoyhint_script_steps);

                // run Enjoyhint script
                enjoyhint_instance.run();

                $('#restartTour').click(function() {
                    console.log(enjoyhint_instance);
                    // run Enjoyhint script
                    enjoyhint_instance.run();
                })
            }

            $timeout(function() {
                tourInit();

                $('#restartTour').click(function() {
                    tourInit();
                })

            });

        }
    ]);