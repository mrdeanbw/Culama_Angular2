/*
 *  Altair Admin angularjs
 *  controller
 */

var myHub = "";
var signalRServer = "http://localhost:55507";

angular
    .module('culamaApp')
    .controller('mainCtrl', ['$rootScope',
        '$scope', 'commonService',
        function ($rootScope, $scope, commonService) {
            $rootScope.CurrentLocaleLanguage = commonService.getLanguage();
            $scope.ishidenewmsg = false;
            if ($rootScope.CurrentLocaleLanguage == undefined || $rootScope.CurrentLocaleLanguage === "") {
                localStorage.setItem("localelanguage", "US");
            }
            var result = localStorage.getItem("loggeduser");
            $rootScope.LoggedUser = JSON.parse(result);
            if ($rootScope.LoggedUser != null && $rootScope.LoggedUser != undefined) {
                $rootScope.isloggedin = true;
            } else {
                $rootScope.isloggedin = false;
                window.location.href = "#/login";
            }

            $rootScope.$on("logout", function () {
                $scope.logout();
            });

            $rootScope.$on("successnotify", function (events, args) {
                $scope.showNotification(args.msg, args.status);
            });

            $rootScope.$on("newMessage", function (events, args) {
                $scope.showNewMessagePopup(args.msg, args.sender);
            });

            $rootScope.$on("changeLanguage", function (events, args) {
                if (args !== "") {
                    if ($rootScope.CurrentLocaleLanguage !== args) {
                        $scope.setLanguage(args);
                        window.location.reload();
                    }
                }
            });


            $rootScope.$on("toggleLoader", function (events, args) {
                $scope.toggleLoader(args);
            });

            $scope.showNotification = function (message, status) {
                $scope.notifymsg = message;
                $scope.notfifystatus = status;
                setTimeout(function () {
                    $("#successnotifybtn").click();
                }, 500);

            };

            $scope.showNewMessagePopup = function (message, sendername) {
                document.getElementById('newMessagePopup').style.display = 'block';
                $scope.ishidenewmsg = true;
                $scope.notifymsg = message;
                $scope.senderName = sendername;
                setTimeout(function () {
                    document.getElementById('newMessagePopup').style.display = 'none';
                    $scope.ishidenewmsg = false;
                    //$("#newMessagePopup").click();
                }, 10000);
            };

            $scope.logout = function () {
                localStorage.removeItem("loggeduser");
                localStorage.removeItem("localelanguage");
                $rootScope.isloggedin = false;
                $rootScope.LoggedUser = null;
                window.location.href = "#/login";
            };

            $scope.toggleLoader = function (status) {
                if (status) {
                    $rootScope.pageLoading = true;
                    $rootScope.pageLoaded = false;
                } else {
                    $rootScope.pageLoading = false;
                    $rootScope.pageLoaded = true;
                }

            };

            $scope.setLanguage = function (lan) {
                commonService.setLanguage(lan);
            }

            $.getScript(signalRServer + '/Scripts/jquery.signalR-2.2.1.min.js', function () {
                $.getScript(signalRServer + '/signalr/hubs', function () {
                    $.connection.hub.url = signalRServer + '/signalr';
                    myHub = $.connection.notificationHub;
                    myHub.client.receiveNotification = function (newmessage, msgThradId, notifyusers, senderName) {
                        //var currentMessages = [];
                        //currentMessages = umg.scope.SelectedMessageThread.MessageThreadDetails;
                        //var currentMessagesIndex = umg.scope.SelectedMessageThread.MessageThreadDetails.length;
                        //currentMessages.push(updatedchatObjs[0]);
                        //umg.scope.chatMessages = currentMessages;
                        $rootScope.$emit("newMessage",
                            { msg: newmessage, sender: senderName });
                        //scope.$apply();
                    }
                    $.connection.hub.start().done(function () {
                        console.log('Connection Established.');

                        //myHub.server.sendNotifications("Hello friends...");


                    });
                });
            });

            //$scope.getLanguage = function () {
            //    return commonService.getLanguage();
            //}
        }
    ]);
