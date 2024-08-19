import Postgres from "../database/Postgres";
import Server from "../Server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';

module.exports = (server: Server) => {
    server.app.post('/user/register', async (req: express.Request, res: express.Response) => {
        console.log('/USER REGISTER', req.body);

        const username = req.body.user.username;
        const password = req.body.user.password;
        
        if (!password || password.length <= 1) return res.json({ ok: false, error: { message: 'Password: Mayor o igual a 1 caracter' } });
        
        if (!username || username.length <= 3) {
            return res.json({
                ok: false,
                error: {
                    code: 'user-register',
                    message: 'Username: Mayor o igual a 3 caracteres'
                }
            });
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
            return res.json({
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
            return res.json({
                ok: false,
                error: {
                    code: 'user-register',
                    message: 'Ya existe un usuario con ese nombre de usuario.'
                }
            });
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

        return res.json({
            ok: true,
            user: {
                id: queryUser2[0].id_member,
                username: queryUser2[0].username_member,
                token: queryUser2[0].token_member
            }
        })
    })
}