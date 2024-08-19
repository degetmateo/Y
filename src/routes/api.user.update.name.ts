import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.post('/api/user/update/name', server.authenticate, async (req, res) => {        
        const user = req.body.user;
        const name = req.body.name;

        if (name.length > 16) return res.json({ ok: false, error: { message: "Nombre: Hasta 16 caracteres." } });
        if (name.length <= 0) return res.json({ ok: false, error: { message: "Nombre: Minimo 1 caracter." } });

        try {
            await Postgres.query().begin(async sql => {
                await sql `SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;
    
                await sql `
                    UPDATE
                        member
                    SET
                        name_member = ${name}
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