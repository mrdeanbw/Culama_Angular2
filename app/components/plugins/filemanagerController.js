angular
    .module('altairApp')
    .controller('filemanagerCtrl', [
        '$scope',
        '$state',
        '$timeout',
        function ($scope,$state,$timeout) {
            $timeout(function () {
                // filemanager
                $('#fileManager').elfinder({
                    useBrowserHistory: false,
                    height: $('body').height() - 140,
                    url : 'file_manager/php/connector.minimal.php'  // connector URL (REQUIRED)
                    // lang: ''  // language (OPTIONAL)
                });
            })
        }
    ])
;