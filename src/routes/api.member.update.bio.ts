import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.post('/api/member/update/bio', server.authenticate, async (req, res) => {        
        try {
            const user = req.body.user;
            const bio = req.body.bio;
    
            if (bio.length > 400) {
                return res.json({ ok: false, error: { message: "Biografia: Menor a 400 caracteres." } });
            }
            
            await Postgres.query().begin(async sql => {
                await sql `
                    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
                `;
    
                await sql `
                    UPDATE
                        member
                    SET
                        bio_member = ${bio}
                    WHERE
                        id_member = ${user.id} and
                        username_member = ${user.username};
                `;
            });

            res.json({ ok: true });
        } catch (error) {
            console.error(error)
            return res.json({ ok: false, error: { message: 'Ha ocurrido un problema. Intentalo mas tarde.' } });
        }
    })
}