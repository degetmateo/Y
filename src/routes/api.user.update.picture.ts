import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.post('/api/user/update/picture', server.authenticate, async (req, res) => {        
        const user = req.body.user;
        const image = req.body.image;

        try {
            await Postgres.query() `
                UPDATE 
                    member
                SET
                    profile_pic_url_member = ${image.url}
                WHERE
                    id_member = ${user.id} and
                    username_member = ${user.username};
            `;

            res.json({
                ok: true
            })
        } catch (error) {
            console.error(error)
            res.json({
                ok: false,
                error: {
                    message: 'Ocurrio un problema con la imagen.'
                }
            })
            return;
        }
    })
}