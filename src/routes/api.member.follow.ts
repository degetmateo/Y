import Postgres from "../database/Postgres";
import Server from "../Server";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id?: number;
                username?: string;
            }
        }
    }
}

module.exports = (server: Server) => {
    server.app.put("/api/member/:username/follow", server.authenticate, async (req, res) => {
        try {
            const reqUser = req.user.username;
            const userToFollow = req.params.username;
            if (!reqUser || reqUser.length <= 0) return res.json({ ok: false, error: { message: 'Ha ocurrido un error.' } });
            if (!userToFollow || userToFollow.length <= 0) return res.json({ ok: false, error: { message: 'Ha ocurrido un error.' } });
            if (reqUser === userToFollow) return res.json({ ok: false, error: { message: "Ha ocurrido un error." } });
            
            await Postgres.query().begin(async sql => {
                await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;
                
                const queryToFollowUser = await sql`
                    SELECT * FROM 
                        member
                    WHERE
                        username_member = ${userToFollow};
                `;

                const queryRequestUser = await sql`
                    SELECT * FROM 
                        member
                    WHERE
                        username_member = ${reqUser};
                `;

                if (!queryToFollowUser[0] || !queryRequestUser[0]) throw new Error('Postgres Error: Usuarios no encontrados.');

                await sql`
                    INSERT INTO
                        follow
                    VALUES (
                        ${queryRequestUser[0].id_member},
                        ${queryToFollowUser[0].id_member}
                    );
                `;
            });

            return res.json({ ok: true });
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: error.message } });
        }
    });
}