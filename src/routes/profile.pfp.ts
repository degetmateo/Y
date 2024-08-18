import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.post('/profile/pfp', server.authenticate, async (req, res) => {
        console.log('PROFILE PFP')
        
        const user = req.body.user;
        const image = req.body.image;
        console.log(image.view)

        const validateImage = (image.url) &&
        (image.view.w == image.view.h) && 
        (image.view.x != undefined && image.view.y != undefined) &&
        (image.view.x != null && image.view.y != null) &&
        (!isNaN(image.view.x) && !isNaN(image.view.y) && !isNaN(image.view.w) && !isNaN(image.view.h)) && 
        (image.view.x >= 0 && image.view.y >= 0);

        if (!validateImage) {
            res.json({
                ok: false,
                error: {
                    message: 'Ocurrio un problema con la imagen. Cropped.'
                }
            })
            return;
        }

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

            return res.json({
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