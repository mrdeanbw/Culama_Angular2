angular
    .module('altairApp')
    .controller('idle_timeoutCtrl', [
        '$scope',
        'Idle',
        '$state',
        function ($scope,Idle,$state) {

            // append modal to <body>
            $('body').append('<div class="uk-modal" id="modal_idle">' +
                '<div class="uk-modal-dialog">' +
                    '<div class="uk-modal-header">' +
                        '<h3 class="uk-modal-title">Your session is about to expire!</h3>' +
                    '</div>' +
                    '<p>You\'ve been inactive for a while. For your security, we\'ll log you out automatically.</p>' +
                    '<p>Your session will expire in <span class="uk-text-bold md-color-red-500" id="sessionSecondsRemaining"></span> seconds.</p>' +
                '</div>' +
            '</div>');

            var modal = UIkit.modal("#modal_idle", {
                    bgclose: false
                }),
                $sessionCounter = $('#sessionSecondsRemaining');

            Idle.watch();
            $scope.$on('IdleWarn', function(e, countdown) {
                modal.show();
                $sessionCounter.html(countdown)
            });

            $scope.$on('IdleEnd', function() {
                modal.hide();
                $sessionCounter.html('');
            });

            $scope.$on('IdleTimeout', function() {
                modal.hide();
                // log out user
                $state.go('login');
            });

        }
    ])
    .config(function(IdleProvider, KeepaliveProvider) {
        // configure Idle settings
        IdleProvider.idle(5); // in seconds
        IdleProvider.timeout(30); // in seconds
        IdleProvider.keepalive(false);
    })
;