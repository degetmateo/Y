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
                member m
            WHERE
                m.username_member = ${req.user.username};
        `;
        
        res.json({
            ok: true,
            user: {
                id: queryUser[0].id_member,
                name: queryUser[0].name_member,
                username: queryUser[0].username_member,
                created_at: new Date(queryUser[0].date_creation_member),
                profilePic: {
                    url: queryUser[0].profile_pic_url_member
                }
            }
        })
    })


    server.app.post('/user/auth', server.authenticate, async (req: express.Request, res: express.Response) => {
        console.log('USER AUTH', req.body)
        const username = req.body.user.username;

        const queryUser = await Postgres.query() `
            SELECT * FROM
                member
            WHERE 
                username_member = ${username};
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

        return res.json({
            ok: true,
            user: {
                id: queryUser[0].id_member,
                username: queryUser[0].username_member,
                name: queryUser[0].name_member,
                token: queryUser[0].token_member,
                profilePic: {
                    url: queryUser[0].profile_pic_url_member,
                    crop: {
                        x: 0,
                        y: 0,
                        w: 0,
                        h: 0
                    }
                }
            }
        })
    })

    server.app.post('/user/login', async (req: express.Request, res: express.Response) => {
        console.log('/USER LOGIN', req.body);

        const username = req.body.user.username;
        const password = req.body.user.password;

        const queryUser = await Postgres.query()`
            SELECT * FROM member
            WHERE username_member = ${username};
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

        if (!await bcrypt.compare(password, queryUser[0].password_member)) {
            res.json({
                ok: false,
                error: {
                    code: 'login',
                    message: 'Credenciales invalidas.'
                }
            })

            return;
        }

        const token = jwt.sign({ username: queryUser[0].username_member }, process.env.SECRET_KEY, { expiresIn: '2h' });

        await Postgres.query() `
            UPDATE 
                member
            SET
                token_member = ${token}
            WHERE
                id_member = ${queryUser[0].id_member} and
                username_member = ${queryUser[0].username_member};
        `;

        res.json({
            ok: true,
            user: {
                id: queryUser[0].id_member,
                username: queryUser[0].username_member,
                token: token
            }
        })
    })


    server.app.post('/user/register', async (req: express.Request, res: express.Response) => {
        console.log('/USER REGISTER', req.body);

        const username = req.body.user.username;
        const password = req.body.user.password;
        
        if (!password || password.length <= 1) {
            res.json({
                ok: false,
                error: {
                    code: 'user-register',
                    message: 'Password: Mayor o igual a 1 caracter'
                }
            })

            return;
        }
        
        if (!username || username.length <= 3) {
            res.json({
                ok: false,
                error: {
                    code: 'user-register',
                    message: 'Username: Mayor o igual a 3 caracteres'
                }
            })

            return;
        }

        if (username.length > 16) {
            return res.json({
                ok: false,
                error: {
                    code: 'user-register',
                    message: 'Username & name: Menor o igual a 16 caracteres'
                }
            });
        }

        const regexUsername = /^[a-zA-Z0-9_]+$/;
        const isValid = regexUsername.test(username);

        if (!isValid) {
            res.json({
                ok: false,
                error: {
                    code: 'user-register',
                    message: 'Username: Solo numeros, letras y guiones bajos.'
                }
            })
        }

        const queryUser = await Postgres.query() `
            SELECT * FROM
                member
            WHERE
                username_member = ${username};
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
            SELECT insert_member (
                ${username},
                ${hashedPassword},
                ${new Date().toISOString()},
                ${token} 
            );
        `;

        const queryUser2 = await Postgres.query() `
            SELECT * FROM
                member
            WHERE
                username_member = ${username};
        `;

        res.json({
            ok: true,
            user: {
                id: queryUser2[0].id_member,
                username: queryUser2[0].username_member,
                token: queryUser2[0].token_member
            }
        })
    })
}