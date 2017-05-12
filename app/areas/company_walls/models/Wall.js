var culamaApp;
(function (culamaApp) {
    var areas;
    (function (areas) {
        var companyWall;
        (function (companyWall) {
            var models;
            (function (models) {
                var Wall = (function () {
                    function Wall() {
                    }
                    return Wall;
                }());
                models.Wall = Wall;
            })(models = companyWall.models || (companyWall.models = {}));
        })(companyWall = areas.companyWall || (areas.companyWall = {}));
    })(areas = culamaApp.areas || (culamaApp.areas = {}));
})(culamaApp || (culamaApp = {}));
