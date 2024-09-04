import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.post('/api/post/create', server.authenticate, async (req, res) => {
        try {
            const content = req.body.post.content as string;
            const images = req.body.post.images as Array<string>;
            if ((content && content.trim().length < 1) || !content) return res.json({ ok:false, error: {message:"Debes escribir algo."} });
            if (content.length > 400) return res.json({ ok: false, error: { message: 'Has superado el limite de caracteres (400).'} });
            if (images && images.length > 4) return res.json({ ok:false, error: { message: "POST IMAGES: Hasta 4." } });

            const user = req.body.user;
            const queryUserCreator = await Postgres.query() `
                SELECT * FROM
                    member
                WHERE
                    username_member = ${user.username};
            `;
            
            if (!queryUserCreator[0]) return res.json({ ok:false, error: { code: 'auth', message: 'Error de autentificacion.' } });
    
            await Postgres.query()`
                SELECT insert_post (
                    ${queryUserCreator[0].id_member},
                    ${content},
                    ${new Date().toISOString()},
                    ${images || []}
                );
            `;
    
            return res.json({ ok: true });
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: "Ha ocurrido un error. Intentalo mas tarde." } });
        }
    });
}