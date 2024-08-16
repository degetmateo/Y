import express from "express";
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import Postgres from "./database/Postgres";

export default class Server {
    private readonly port: number;
    public readonly app: express.Express;
    public readonly router: express.Router;

    constructor (port: number) {
        this.port = port;
        this.app = express();
        this.router = express.Router();

        this.app.set('port', this.port);
        this.app.use('/public', express.static(path.join(__dirname + '/../public/')));
        this.app.use(express.json());

        this.routes();
        Postgres.init();

        this.app.listen(this.port, () => {
            console.log('✅ | Server listening on port:', this.app.get('port'))
        });
    }

    private routes() {
        try {
            const files = fs.readdirSync(path.join(__dirname + '/routes/'));
            for (const file of files) {
                require(path.join(__dirname + '/routes/' + file))(this);
                console.log('✅ | Loaded:', file);
            }

            this.app.use('/*', (_, res) => {
                res.sendFile(path.join(__dirname + '/../public/app.html'));
            });
        } catch (error) {
            console.error('🟥 |', error);
        }
    }

    public authenticate (req, res: express.Response, next: express.NextFunction) {
        const header = req.headers['authorization'];
        const token = header && header.split(' ')[1];
        
        if (!token) {
            res.json({
                ok: false,
                error: {
                    code: 'auth',
                    message: 'Error en la autentificacion.'
                }
            })
            return;
        }

        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) return res.json({ ok: false, error: { code: 'auth', message: 'Error en la autentificacion.' } });
            // const newToken = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: '2h' });
            req.user = { username: user.username }
            next();
        })
    }
}