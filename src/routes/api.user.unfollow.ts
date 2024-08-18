import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.delete("/api/user/:username/unfollow", server.authenticate, async (req, res) => {
        const reqUser = req.user.username;
        const userToFollow = req.params.username;
        if (!reqUser || reqUser.length <= 0) return res.json({ ok: false, error: { message: 'Ha ocurrido un error.' } });
        if (!userToFollow || userToFollow.length <= 0) return res.json({ ok: false, error: { message: 'Ha ocurrido un error.' } });
        if (reqUser === userToFollow) return res.json({ ok: false, error: { message: "Ha ocurrido un error." } });

        try {
            await Postgres.query().begin(async sql => {
                await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;

                await sql`
                    DELETE FROM
                        follow
                    WHERE
                        username_base_user_follower = ${req.user.username} and
                        username_base_user_followed = ${req.params.username};
                `;
            });

            return res.json({ ok: true });
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: error.message } });
        }
    });
}