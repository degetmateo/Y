import Postgres from "../database/Postgres";
import Server from "../Server";
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

module.exports = (server: Server) => {
    server.app.post('/api/member/login', async (req: express.Request, res: express.Response) => {
        try {
            const username = req.body.user.username;
            const password = req.body.user.password;
            await Postgres.query().begin(async sql => {
                await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;
                const qMember = await sql`SELECT * FROM member WHERE username_member = ${username};`;
                if (!qMember[0]) return res.json({ ok: false, error: { message: "Ese usuario no existe." } });
                if (!await bcrypt.compare(password, qMember[0].password_member)) {
                    return res.json({ ok: false, error: { message: "Contraseña incorrecta." } });
                }
                const newToken = jwt.sign({ id_member: qMember[0].id_member, username_member: qMember[0].username_member }, process.env.SECRET_KEY, { expiresIn: "24h" });
                await sql`
                    UPDATE member
                    SET token_member = ${newToken}
                    WHERE id_member = ${qMember[0].id_member} and username_member = ${qMember[0].username_member};
                `;
                return res.json({ ok: true, 
                    user: {
                        id: qMember[0].id_member,
                        username: qMember[0].username_member,
                        token: newToken
                    } 
                });
            });
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: "Ha ocurrido un error. Inténtalo de nuevo más tarde." } });
        }
    });
}