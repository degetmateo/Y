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
    server.app.put("/api/user/:username/follow", server.authenticate, async (req, res) => {
        const reqUser = req.user.username;
        const userToFollow = req.params.username;
        if (!reqUser || reqUser.length <= 0) return res.json({ ok: false, error: { message: 'Ha ocurrido un error.' } });
        if (!userToFollow || userToFollow.length <= 0) return res.json({ ok: false, error: { message: 'Ha ocurrido un error.' } });
        if (reqUser === userToFollow) return res.json({ ok: false, error: { message: "Ha ocurrido un error." } });

        try {
            await Postgres.query().begin(async sql => {
                const queryToFollowUser = await sql`
                    SELECT * FROM 
                        base_user
                    WHERE
                        username = ${userToFollow};
                `;

                const queryRequestUser = await sql`
                    SELECT * FROM 
                        base_user
                    WHERE
                        username = ${reqUser};
                `;

                if (!queryToFollowUser[0] || !queryRequestUser[0]) throw new Error('Postgres Error: Usuarios no encontrados.');

                await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;

                await sql`
                    INSERT INTO
                        follow
                    VALUES (
                        ${queryRequestUser[0].id},
                        ${queryRequestUser[0].username},
                        ${queryToFollowUser[0].id},
                        ${queryToFollowUser[0].username}
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