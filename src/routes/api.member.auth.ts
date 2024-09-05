import Postgres from "../database/Postgres";
import Server from "../Server";
import express from 'express';

module.exports = (server: Server) => {
    server.app.post('/api/member/auth', server.authenticate, async (req: express.Request, res: express.Response) => {
        try {
            const username = req.body.user.username;
            await Postgres.query().begin(async sql => {
                await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;
                const qMember = await sql`SELECT * FROM member WHERE username_member = ${username};`;
                if (!qMember[0]) throw new Error('AUTH ERROR.');
                return res.json({ ok: true, 
                    user: {
                        id: qMember[0].id_member,
                        username: qMember[0].username_member,
                        name: qMember[0].name_member,
                        token: qMember[0].token_member,
                        role: qMember[0].role_member,
                        profilePic: {
                            url: qMember[0].profile_pic_url_member,
                        }
                    }
                });
            });
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: "Ha ocurrido un error. Inténtalo de nuevo más tarde." } });
        }
    });
}