
/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/angularjs/angular-route.d.ts" />

module culamaApp.areas.companyWall.controllers {
    import Models = culamaApp.areas.companyWall.models;

    export interface ICompanyWallPostScope extends ng.IScope {
        isWallPosts: boolean;
        isEditMode: boolean;
        wallID: string;

        saveWallPostInfo: () => void;
        editWallPost: (id: number) => void;
        deleteWallPost: (id: number) => void;
        removeExistingImg: (id: number) => void;
    }
}