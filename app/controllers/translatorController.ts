/// <reference path="../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../Scripts/typings/angularjs/angular-route.d.ts" />
class TranslatorController {
    static $inject = ["$scope","$rootScope"];
    constructor(public scope: any, public $rootScope: any) {
        scope.vm = this;
       
        //$resource('data/language_resource.json')
        //    .query()
        //    .$promise
        //    .then(function (dt_data) {
        //        scope.vm.lanresourceobj = dt_data;
        //    });
    }

    getLanguages() {
        return localStorage.getItem("localelanguage");
    }

    setLanguage(language) {
        localStorage.setItem("localelanguage", language);
    }

    getTranslation(elemid, targetPage) {
        var currentLanguage = localStorage.getItem("localelanguage");
        var targetobj = this.$rootScope.lanresourceobj[targetPage];
        var findobj , translateTxt='';
        $.each(targetobj, function (index) {
            if (this.id === elemid) {
                findobj = this;
            }
        });
        if (findobj != undefined) {
            translateTxt = findobj[currentLanguage];
        }
        return translateTxt;
    }



   
}

angular.module("culamaApp")
    .controller("translatorController", TranslatorController);