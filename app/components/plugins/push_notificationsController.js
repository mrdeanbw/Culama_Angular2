angular
    .module('altairApp')
    .controller('push_notificationsCtrl', [
        '$scope',
        '$timeout',
        function ($scope,$timeout) {

            $scope.pushDemo = function($event) {
                $event.preventDefault();
                Push.create("Hello!", {
                    body: "How's it hangin'?",
                    icon: 'assets/img/avatars/avatar_11@2x.png',
                    timeout: 10000,
                    onClick: function () {
                        window.focus();
                        this.close();
                    }
                });
            }

        }
    ]);