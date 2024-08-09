import { PublicUser } from "./User";

export default class Post {
    private readonly id: number;
    private readonly content: string;
    private readonly date: Date;
    private readonly creator: PublicUser;
    private readonly original: Post | null;

    private likes: Array<PublicUser>;
    private comments: Array<Post>;

    constructor (_id: number, _content: string, _date: Date, _creator: PublicUser, _original: Post | null) {
        this.id = _id;
        this.content = _content;
        this.date = _date;
        this.creator = _creator;
        this.original = _original;

        this.likes = new Array<PublicUser>();
        this.comments = new Array<Post>();
    }

    public toJson () {
        return {
            id: this.id,
            content: this.content,
            date: this.date,
            creator: this.creator,
            original: this.original,
            likes: this.likes,
            comments: this.comments
        }
    }

    public getId () {
        return this.id;
    }

    public getContent () {
        return this.content;
    }

    public getDate () {
        return this.date;
    }

    public getCreator () {
        return this.creator;
    }

    public getOriginal () {
        return this.original;
    }

    public getLikes () {
        return this.likes;
    }

    public getComments () {
        return this.comments;
    }

    public addLike (_user: PublicUser) {
        this.likes.push(_user);
    }

    public addComment (_post: Post) {
        this.comments.push(_post);
    }
}