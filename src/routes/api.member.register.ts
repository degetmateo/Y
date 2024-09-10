import Postgres from "../database/Postgres";
import Server from "../Server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import express from 'express';

module.exports = (server: Server) => {
    server.app.post('/api/member/register', async (req: express.Request, res: express.Response) => {
        try {
            const username = req.body.user.username as string;
            const password = req.body.user.password as string;            
            if (!password || password.length <= 1) return res.json({ ok: false, error: { message: 'Password: Mayor o igual a 1 caracter.' } });
            if (!username || username.length <= 3) return res.json({ ok: false, error: { message: 'Username: Mayor o igual a 3 caracteres' } });
            if (username.length > 16) return res.json({ ok: false, error: {  message: 'Username & name: Menor o igual a 16 caracteres' } });    
            
            const regexUsername = /^[a-zA-Z0-9_]+$/;
            const isValid = regexUsername.test(username);
            if (!isValid) return res.json({ ok: false, error: { message: 'Username: Solo numeros, letras y guiones bajos.' } });
            
            await Postgres.query().begin(async sql => {
                await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;
                const qMember = await sql`SELECT * FROM member WHERE username_member = ${username};`;
                if (qMember[0]) return res.json({ ok:false, error: { message: "Nombre de usuario no disponible." } });
                const hashedPassword = await bcrypt.hash(password, 10);
                await sql`
                SELECT insert_member (
                        ${username},
                        ${hashedPassword},
                        ${new Date().toISOString()},
                        null
                    );
                `;
                const qRegisteredMember = await sql`SELECT * FROM member WHERE username_member = ${username};`;
                const token = jwt.sign({ id_member: qRegisteredMember[0].id_member, username_member: qRegisteredMember[0].username_member }, process.env.SECRET_KEY, { expiresIn: '24h' });
                await sql`
                    UPDATE
                        member
                    SET
                        token = ${token}
                    WHERE
                        id_member = ${qRegisteredMember[0].id_member};
                `;
                return res.json({ ok: true,
                    user: {
                        id: qRegisteredMember[0].id_member,
                        username: qRegisteredMember[0].username_member,
                        token: token
                    }
                });
            });           
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: "Ha ocurrido un error. Inténtalo de nuevo más tarde." } });
        }
   });
}