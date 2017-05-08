/// <reference path="../../../../Scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../../../Scripts/typings/angularjs/angular-route.d.ts" />
module culamaApp.areas.messaging.controllers {
    import Models = culamaApp.areas.messaging.models;

    export interface IUserMessageScope extends ng.IScope {
        messages: Array<Models.MessageThread>;
        currentllyActiveThread: number;
        isHasMessages: boolean;
        isUserCreateMessage: boolean;
        isUserTypeMessage: boolean;
        customer: any; // TODO: Needs to be typed
        selectedMessageThread: Models.MessageThread;
        newMessage: Models.MessageThread;
        newMessageUsers: Array<number>;
        chatMessages: Array<Models.Chat>;

        gmembers: string;

        selectizeUsersOptions: Array<any>; // TODO: This needs to be typed
        olderChatingGroup: Array<any>; // TODO: Still used? If so => needs to be typed
        selectizeUsersConfig: any; // TODO: Needs to be typed
        loggedUserId: number;


        showMessageUsers: (msg: Models.MessageThread, isusershow: boolean) => string;
        scopeLoadMessages: (id: number) => void;
        scopeSendMessage: () => void;
        CreateMessage: () => void;
        abc: (msg: Models.MessageThread) => void;
        receiveNotification: (msg: string) => void;
    }
}