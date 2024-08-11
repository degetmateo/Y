import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Server from "../Server";
import Postgres from '../database/Postgres';

module.exports = (server: Server) => {
    server.app.get('/user', server.authenticate, async (req:any, res) => {
        console.log(req.user)

        const queryUser = await Postgres.query()`
            SELECT * FROM
                base_user
            WHERE
                username = ${req.user.username.username};
        `
        
        res.json({
            ok: true,
            user: {
                id: queryUser[0].id,
                name: queryUser[0].name,
                username: queryUser[0].username,
                created_at: new Date(queryUser[0].created_at)
            }
        })
    })


    server.app.post('/user/auth', server.authenticate, async (req: express.Request, res: express.Response) => {
        console.log('USER AUTH', req.body)
        const username = req.body.user.username;

        const queryUser = await Postgres.query() `
            SELECT * FROM
                base_user bu
            WHERE 
                bu.username = ${username};
        `;

        if (!queryUser[0]) {
            return res.json({
                ok: false,
                error: {
                    code: 'auth',
                    message: 'No existe un usuario con ese nombre.'
                }
            })
        }

        res.json({
            ok: true
        })
    })

    server.app.post('/user/login', async (req: express.Request, res: express.Response) => {
        console.log('/USER LOGIN', req.body);

        const username = req.body.user.username;
        const password = req.body.user.password;

        const queryUser = await Postgres.query()`
            SELECT * FROM base_user bu
            WHERE bu.username = ${username};
        `;

        if (!queryUser[0]) {
            res.json({
                ok: false,
                error: {
                    code: 'login',
                    message: 'Credenciales invalidas.'
                }
            })
            return;
        }

        if (!await bcrypt.compare(password, queryUser[0].password)) {
            res.json({
                ok: false,
                error: {
                    code: 'login',
                    message: 'Credenciales invalidas.'
                }
            })

            return;
        }

        const token = jwt.sign({ username: queryUser[0].username }, process.env.SECRET_KEY, { expiresIn: '2h' });

        await Postgres.query() `
            UPDATE 
                base_user
            SET
                token = ${token}
            WHERE
                id = ${queryUser[0].id} and
                username = ${queryUser[0].username};
        `;

        res.json({
            ok: true,
            user: {
                id: queryUser[0].id,
                username: queryUser[0].username,
                token: token
            }
        })
    })


    server.app.post('/user/register', async (req: express.Request, res: express.Response) => {
        console.log('/USER REGISTER', req.body);

        const name = req.body.user.name;
        const username = req.body.user.username;
        const password = req.body.user.password;

        if (name.length > 16 || username.length > 16) {
            res.json({
                ok: false,
                error: {
                    code: 'user-register',
                    message: 'NOMBRE O USUARIO DEMASIADO LARGO FLACO'
                }
            })

            return;
        }

        const queryUser = await Postgres.query() `
            SELECT * FROM
                base_user bu
            WHERE
                bu.username = ${username};
        `;

        if (queryUser[0]) {
            res.json({
                ok: false,
                error: {
                    code: 'user-register',
                    message: 'Ya existe un usuario con ese nombre de usuario.'
                }
            })
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: '2h' });

        await Postgres.query() `
            SELECT insert_base_user (
                ${username},
                ${name},
                ${hashedPassword},
                ${new Date().toISOString()},
                ${token} 
            );
        `;

        const queryUser2 = await Postgres.query() `
            SELECT * FROM
                base_user bu
            WHERE
                bu.username = ${username};
        `;

        res.json({
            ok: true,
            user: {
                id: queryUser2[0].id,
                username: queryUser2[0].username,
                token: queryUser2[0].token
            }
        })
    })
}