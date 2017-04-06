/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var culamaApp;
(function (culamaApp) {
    var TranslatorService = (function () {
        function TranslatorService(scope, $resource) {
            this.scope = scope;
            this.$resource = $resource;
            scope.vm = this;
            $resource('data/language_resource.json')
                .query()
                .$promise
                .then(function (dt_data) {
                scope.vm.lanresourceobj = dt_data;
            });
        }
        TranslatorService.prototype.getLanguages = function () {
            return localStorage.getItem("localelanguage");
        };
        TranslatorService.prototype.setLanguage = function (language) {
            localStorage.setItem("localelanguage", language);
        };
        TranslatorService.prototype.getTranslation = function (elemid, targetPage) {
            var currentLanguage = localStorage.getItem("localelanguage");
            var targetobj = this.scope.vm.lanresourceobj[targetPage];
            var findobj, translateTxt = '';
            $.each(targetobj, function (index) {
                if (this.id === elemid) {
                    findobj = this;
                }
            });
            if (findobj != undefined) {
                translateTxt = findobj[currentLanguage];
            }
            return translateTxt;
        };
        return TranslatorService;
    }());
    TranslatorService.$inject = ["$scope", "$resource"];
    culamaApp.TranslatorService = TranslatorService;
    angular
        .module("culamaApp")
        .service("translatorService", TranslatorService);
})(culamaApp || (culamaApp = {}));
