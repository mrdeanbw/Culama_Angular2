module culamaApp.areas.messaging.models {
    export class MessageThread {
        Id: string;
        UserId: string;
        IsAdmin: boolean;
        CreatedUserId: string;
        MessageThreadUsers: Array<MessageThreadUser> = [];
        Messages: Array<Message> = [];
        Message: string;
    }
}