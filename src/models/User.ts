import bcrypt from 'bcrypt';
import Post from "./Post";

export default class User {
    private readonly id: number;
    private readonly name: string;
    private readonly password: string;
    
    private token: string;
    private posts: Array<Post>;
    private followed: Array<PublicUser>;
    private followers: Array<PublicUser>;

    constructor (_id: number, _name: string, _password: string, _token: string) {
        this.id = _id;
        this.name = _name;
        this.password = _password;
        this.token = _token;

        this.posts = new Array<Post>();
        this.followed = new Array<PublicUser>();
        this.followers = new Array<PublicUser>();
    }

    public toJson (): PublicUser {
        return {
            id: this.id,
            name: this.name,
            posts: this.posts,
            followed: this.followed,
            followers: this.followers
        }
    }

    public async comparePassword (_password: string) {
        return await bcrypt.compare(_password, this.password);
    }

    public getId () {
        return this.id;
    }

    public getName () {
        return this.name;
    }

    public getPosts () {
        return this.posts;
    }

    public getFollowed () {
        return this.followed;
    }

    public getToken () {
        return this.token;
    }

    public setToken (_token: string) {
        this.token = _token;
    }

    public getFollowers () {
        return this.followers;
    }

    public addPost (_post: Post) {
        this.posts.push(_post);
    }

    public addFollowed (_user: PublicUser) {
        this.followed.push(_user);
    }

    public addFollower (_user: PublicUser) {
        this.followers.push(_user);
    }
}

export type PublicUser = {
    id: number,
    name: string,
    posts: Array<Post>,
    followed: Array<PublicUser>,
    followers: Array<PublicUser>    
}