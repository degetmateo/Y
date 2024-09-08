import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/api/post/:id_post/comments/count', server.authenticate, async (req, res) => {
        try {
            const id_post = req.params.id_post;
            if (!id_post) throw new Error("TYPE ERROR.");
            await Postgres.query().begin(async sql => {
                await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;
                const q = await sql`SELECT COUNT(*) FROM post WHERE id_post_replied = ${id_post};`;
                return res.json({ ok: true, count: q[0].count });
            });
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: "Ha ocurrido un error. Inténtalo de nuevo más tarde." } });
        }
    });
}