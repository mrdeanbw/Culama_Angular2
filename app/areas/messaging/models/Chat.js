var culamaApp;
(function (culamaApp) {
    var areas;
    (function (areas) {
        var messaging;
        (function (messaging) {
            var models;
            (function (models) {
                var Chat = (function () {
                    function Chat() {
                    }
                    return Chat;
                }());
                models.Chat = Chat;
            })(models = messaging.models || (messaging.models = {}));
        })(messaging = areas.messaging || (areas.messaging = {}));
    })(areas = culamaApp.areas || (culamaApp.areas = {}));
})(culamaApp || (culamaApp = {}));
