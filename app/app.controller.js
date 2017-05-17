/*
 *  Altair Admin angularjs
 *  controller
 */

var myHub = "";
var signalRServer = "http://api.culama.com:8080";

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
                $scope.ishidenewmsg = true;
                $scope.notifymsg = message;
                $scope.senderName = sendername;

                $("#personname").text(sendername);
                $("#msg").text(message);

                $("#newMessagePopup").delay(200).fadeIn(500);
                //document.getElementById('newMessagePopup').style.display = 'block';
                window.setTimeout(function () {
                    //document.getElementById('newMessagePopup').style.display = 'none';
                    $scope.ishidenewmsg = false;                    
                    $('#newMessagePopup').fadeOut(5000);
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
                    $rootScope.signalRConnection = myHub;
                    myHub.client.receiveNotification = function (newmessage, msgThradId, senderUserID, senderName) {
                        if (senderUserID != $rootScope.LoggedUser.UserId) {
                            $rootScope.$emit("newMessage",
                                { msg: newmessage, sender: senderName });
                        }
                    }
                    $.connection.hub.start().done(function () {
                        if ($rootScope.LoggedUser != null) {
                            getconnectedThreadIDs($rootScope.LoggedUser.UserId);
                            //myHub.server.joinGroup($rootScope.connectedThreadIDs);
                            console.log('Connection Established.');
                        }
                    });
                });
            });

            function getconnectedThreadIDs (userID)
            {
                commonService.getUserConnectedThreads(userID).then(function (result) {
                    if(result.data.length > 0)
                    {
                        var TIDs = "";
                        for(var i = 0; i < result.data.length; i++)
                        {
                            TIDs += result.data[i].MessageId + ",";
                        }

                        $rootScope.connectedThreadIDs = TIDs;

                        var hubconnection = myHub.server;

                        if (hubconnection == undefined)
                            myHub = $rootScope.signalRConnection;

                        myHub.server.joinGroup($rootScope.connectedThreadIDs);
                    }
                });
            }

            //$scope.getLanguage = function () {
            //    return commonService.getLanguage();
            //}
        }
    ]);
