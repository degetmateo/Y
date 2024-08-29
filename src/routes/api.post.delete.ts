import Postgres from "../database/Postgres";
import Server from "../Server";

declare global {
    namespace Express {
        interface Request {
            user?: {
                username?: string
            }
        }
    }
}

module.exports = (server: Server) => {
    server.app.delete('/api/post/:id/delete', server.authenticate, async (req, res) => {
        const id_post = req.params.id;
        const username = req.user.username;

        try {
            await Postgres.query().begin(async sql => {
                await sql `
                    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
                `;
    
                const queryPostUser = await sql`
                    SELECT * FROM
                        post p, member m
                    WHERE
                        p.id_post = ${id_post} and
                        m.username_member = ${username} and
                        p.id_member = m.id_member;
                `;
    
                if (!queryPostUser[0]) return res.json({ ok: false, error: { message: 'Error de autentificacion.' } });
    
                await sql`
                    DELETE FROM
                        upvote
                    WHERE
                        id_post = ${id_post};
                `;

                await sql`
                    DELETE FROM
                        post
                    WHERE
                        id_post = ${id_post};
                `;
    
                return res.json({ ok: true });
            });   
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: "Ha ocurrido un error." } });
        }
    });
}