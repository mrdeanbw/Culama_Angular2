module culamaApp {

    export class Language {
        public Id: number;
        public Abbreviation: string;
        public Description: string;
        public LookupCode: string;
    }

    export class TranslationEntry {
        public Id: number;
        public Value: string;
        public Language: Language;
    }

    export class Translation {
        public Id: number;
        public DefaultValue: string;
        public Entries: any;
    }

    export class UserDetail {
        public UserId: number;
        public FullIdentityName: string;
        public Name: string;
        public FirstName: string;
        public LastName: string;
        public CustomerId: number;
        public Customer: culamaApp.Customer;
        public Title: string;
        public TitleTranslationId: number;
        public TitleTranslation: Translation;
        public Phone: string;
        public UserName: string;
        public IsActive: boolean;  
        public LanguageId: number;
        public PreferredLanguageId: number;
        public UserGroupId: number;
        public UserGroupName: string;
        public IsAllowMsgToEveryone: boolean;  
        public UserMessages: any;
        public UserPhoto: any;
        public Base64StringofUserPhoto: string;
    }



}