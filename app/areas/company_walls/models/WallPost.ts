
module culamaApp.areas.companyWall.models {
    export class WallPost {
        public Id: number;
        public WallId: number;
        //public Title: string;
        public Text: string;
        public WallPostImages: any;
        public CreatorId: number;
        public WallPostMediaInfo: any;
        public RemoveExistingImageIds: string;
    }
}