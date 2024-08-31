import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.post('/post/create', server.authenticate, async (req, res) => {
        const content = req.body.post.content;
        const images = req.body.post.images;
        if (content.length < 1) return res.json({ ok:false, error: {message:"Debes escribir algo."} });
        try {
            if (content.length > 400) return res.json({ ok: false, error: { message: 'Has superado el limite de caracteres (400).'} });
            if (images.length > 4) return res.json({ ok:false, error: { message: "POST IMAGES: Hasta 4." } });
    
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
    })
}