import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.post('/api/post/create', server.authenticate, async (req, res) => {
        try {
            const content = req.body.post.content as string;
            const images = req.body.post.images as Array<string>;
            const id_replied_post = req.body.post.id_replied_post || null;
            const user = req.body.user;
            if ((content && content.trim().length < 1) || !content) return res.json({ ok:false, error: {message:"Debes escribir algo."} });
            if (content.length > 400) return res.json({ ok: false, error: { message: 'Has superado el limite de caracteres (400).'} });
            if (images && images.length > 4) return res.json({ ok:false, error: { message: "POST IMAGES: Hasta 4." } });

            await Postgres.query().begin(async sql => {
                await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;
                const qCreator = await sql`
                    SELECT * FROM member WHERE username_member = ${user.username};
                `;
                if (!qCreator[0]) throw new Error("Ha ocurrido un error.");
                await sql`
                    SELECT insert_post (
                        ${qCreator[0].id_member},
                        ${content},
                        ${new Date().toISOString()},
                        ${images || []},
                        ${id_replied_post}
                    );
                `;
            });
    
            return res.json({ ok: true });
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: "Ha ocurrido un error. Inténtalo mas tarde." } });
        }
    });
}