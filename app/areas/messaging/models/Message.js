var culamaApp;
(function (culamaApp) {
    var areas;
    (function (areas) {
        var messaging;
        (function (messaging) {
            var models;
            (function (models) {
                var Message = (function () {
                    function Message() {
                    }
                    return Message;
                }());
                models.Message = Message;
            })(models = messaging.models || (messaging.models = {}));
        })(messaging = areas.messaging || (areas.messaging = {}));
    })(areas = culamaApp.areas || (culamaApp.areas = {}));
})(culamaApp || (culamaApp = {}));
