var culamaApp;
(function (culamaApp) {
    var areas;
    (function (areas) {
        var messaging;
        (function (messaging) {
            var models;
            (function (models) {
                var MessageThread = (function () {
                    function MessageThread() {
                        this.MessageThreadUsers = [];
                        this.Messages = [];
                    }
                    return MessageThread;
                }());
                models.MessageThread = MessageThread;
            })(models = messaging.models || (messaging.models = {}));
        })(messaging = areas.messaging || (areas.messaging = {}));
    })(areas = culamaApp.areas || (culamaApp.areas = {}));
})(culamaApp || (culamaApp = {}));
