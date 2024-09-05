import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.delete("/api/member/:username/unfollow", server.authenticate, async (req, res) => {
        try {
            const reqUser = req.user.username;
            const userToFollow = req.params.username;
            if (!reqUser || reqUser.length <= 0) return res.json({ ok: false, error: { message: 'Ha ocurrido un error.' } });
            if (!userToFollow || userToFollow.length <= 0) return res.json({ ok: false, error: { message: 'Ha ocurrido un error.' } });
            if (reqUser === userToFollow) return res.json({ ok: false, error: { message: "Ha ocurrido un error." } });
            await Postgres.query().begin(async sql => {
                await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;

                const queryUserRequest = await sql`
                    SELECT * FROM
                        member
                    WHERE
                        username_member = ${req.user.username};
                `;

                const queryUserParams = await sql`
                    SELECT * FROM
                        member
                    WHERE
                        username_member = ${req.params.username};
                `;

                await sql`
                    DELETE FROM
                        follow
                    WHERE
                        id_member_follower = ${queryUserRequest[0].id_member} and
                        id_member_followed = ${queryUserParams[0].id_member};
                `;
            });

            return res.json({ ok: true });
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: error.message } });
        }
    });
}