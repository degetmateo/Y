import express from "express";
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import User from "./models/User";
import Post from "./models/Post";

export default class Server {
    private readonly port: number;
    public readonly app: express.Express;
    public readonly router: express.Router;

    private users: Array<User>;
    private posts: Array<Post>;

    constructor (port: number) {
        this.port = port;
        this.app = express();
        this.router = express.Router();

        this.users = new Array<User>();
        this.posts = new Array<Post>();

        this.app.set('port', this.port);
        this.app.use(express.static(path.join(__dirname + '/../public/')));
        this.app.use(express.json());

        this.routes();

        this.app.listen(this.port, () => {
            console.log('✅ | Server listening on port:', this.app.get('port'))
        });
    }

    private routes () {
        try {
            const files = fs.readdirSync(path.join(__dirname + '/routes/'));
            for (const file of files) {
                require(path.join(__dirname + '/routes/' + file))(this);
                console.log('✅ | Loaded:', file);
            }            
        } catch (error) {
            console.error('🟥 |', error);
        }
    }

    public authenticate (req, res: express.Response, next: express.NextFunction) {
        console.log('USER AUTH MIDDLEWARE')
        const header = req.headers['authorization'];
        const token = header && header.split(' ')[1];

        if (!token) {
            res.status(401).json({
                ok: false,
                error: {
                    code: 'auth',
                    message: 'Error en la autentificacion.'
                }
            })
            return;
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, username) => {
            if (err) return res.status(403).json({ ok: false, error: { code: 'auth', message: 'Error en la autentificacion.' } });
            req.user = { name: username };
            next();
        })
    }

    public getUsers () {
        return this.users;
    }

    public getPosts () {
        return this.posts.map(room => room.toJson());
    }

    public addPost (_post: Post) {
        this.posts.push(_post);
    }
}