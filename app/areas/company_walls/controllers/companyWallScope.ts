
/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/angularjs/angular-route.d.ts" />

module culamaApp.areas.companyWall.controllers {
    import Models = culamaApp.areas.companyWall.models;

    export interface ICompanyWallScope extends ng.IScope {
        cardview: boolean;
        isHasWalls: boolean;
        isEditMode: boolean;
        editedWallId: number;

        saveWallInfo: () => void;
        editWallInfo: (id: number) => void;
        deletewall: (id: number) => void;
        changeView: (view: string) => void;
        //clearDailog: () => void;
    }
}