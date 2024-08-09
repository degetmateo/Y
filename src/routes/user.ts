import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Server from "../Server";
import User from '../models/User';

module.exports = (server: Server) => {
    server.app.post('/user/auth', server.authenticate, async (req: express.Request, res: express.Response) => {
        console.log('USER AUTH', req.body)
        const name = req.body.user.name;

        if (!server.getUsers().find(u => u.getName() === name)) {
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

        const name = req.body.user.name;
        const password = req.body.user.password;

        const user = server.getUsers().find(u => u.getName() === name);

        if (!user) {
            res.json({
                ok: false,
                error: {
                    code: 'login',
                    message: 'Credenciales invalidas.'
                }
            })
            return;
        }

        if (!await user.comparePassword(password)) {
            res.json({
                ok: false,
                error: {
                    code: 'login',
                    message: 'Credenciales invalidas.'
                }
            })

            return;
        }

        const token = jwt.sign({ username: name }, process.env.SECRET_KEY, { expiresIn: '1h' });
        user.setToken(token);

        res.json({
            ok: true,
            user: {
                id: user.getId(),
                name: user.getName(),
                token: user.getToken()
            }
        })
    })


    server.app.post('/user/register', async (req: express.Request, res: express.Response) => {
        console.log('/USER REGISTER', req.body);

        const name = req.body.user.name;
        const password = req.body.user.password;

        if (server.getUsers().find(user => user.getName() === name)) {
            res.json({
                ok: false,
                error: {
                    code: 'user-register',
                    message: 'Ya existe un usuario con ese nombre.'
                }
            })
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userCount = server.getUsers().length;

        const token = jwt.sign({ username: name }, process.env.SECRET_KEY, { expiresIn: '1h' });
        const newUser = new User(userCount + 1, name, hashedPassword, token);
        server.getUsers().push(newUser);

        res.json({
            ok: true,
            user: {
                id: newUser.getId(),
                name: newUser.getName(),
                token: newUser.getToken()
            }
        })
    })
}