import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.delete('/api/post/:id_post/upvote/delete', server.authenticate, async (req, res) => {
        const id_post = req.params.id_post;
        const username_member = req.user.username;
        if (!id_post) return res.json({ ok: false, error: { message: "INVALID POST ID." } });
        if (!username_member || username_member.length > 16) return res.json({ ok: false, error: { message: "INVALID USERNAME." } }); 
        try {
            await Postgres.query().begin(async sql => {
                await sql`
                    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
                `;

                await sql`
                    SELECT
                        delete_upvote (
                            ${username_member},
                            ${id_post}          
                        );
                `;
            });

            return res.json({ ok: true });
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: "Ha ocurrido un error." } });
        }
    });
}