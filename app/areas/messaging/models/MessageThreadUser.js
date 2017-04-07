var culamaApp;
(function (culamaApp) {
    var areas;
    (function (areas) {
        var messaging;
        (function (messaging) {
            var models;
            (function (models) {
                var MessageThreadUser = (function () {
                    function MessageThreadUser() {
                    }
                    return MessageThreadUser;
                }());
                models.MessageThreadUser = MessageThreadUser;
            })(models = messaging.models || (messaging.models = {}));
        })(messaging = areas.messaging || (areas.messaging = {}));
    })(areas = culamaApp.areas || (culamaApp.areas = {}));
})(culamaApp || (culamaApp = {}));
