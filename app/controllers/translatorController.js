/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
var TranslatorController = (function () {
    function TranslatorController(scope, $rootScope) {
        this.scope = scope;
        this.$rootScope = $rootScope;
        scope.vm = this;
        //$resource('data/language_resource.json')
        //    .query()
        //    .$promise
        //    .then(function (dt_data) {
        //        scope.vm.lanresourceobj = dt_data;
        //    });
    }
    TranslatorController.prototype.getLanguages = function () {
        return localStorage.getItem("localelanguage");
    };
    TranslatorController.prototype.setLanguage = function (language) {
        localStorage.setItem("localelanguage", language);
    };
    TranslatorController.prototype.getTranslation = function (elemid, targetPage) {
        var currentLanguage = localStorage.getItem("localelanguage");
        var targetobj = this.$rootScope.lanresourceobj[targetPage];
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
    return TranslatorController;
}());
TranslatorController.$inject = ["$scope", "$rootScope"];
angular.module("culamaApp")
    .controller("translatorController", TranslatorController);
