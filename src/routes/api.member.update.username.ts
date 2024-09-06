import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.post('/api/member/update/username', server.authenticate, async (req, res) => {        
        try {
            const user = req.body.user;
            const username = req.body.username;
    
            if (username.length > 16) return res.json({ ok: false, error: { message: "Nombre de Usuario: Hasta 16 caracteres." } });
            if (username.length <= 0) return res.json({ ok: false, error: { message: "Nombre de Usuario: Minimo 1 caracter." } });
    
            const regexUsername = /^[a-zA-Z0-9_]+$/;
            const isValid = regexUsername.test(username);
            if (!isValid) return res.json({ ok: false, error: { message: 'Username: Solo numeros, letras y guiones bajos.' } });
        
            await Postgres.query().begin(async sql => {
                await sql `SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;
    
                const queryUserWithUsername = await sql`
                    SELECT * FROM
                        member
                    WHERE
                        username_member = ${username};
                `;

                if (queryUserWithUsername[0]) return res.json({ ok: false, error: { message: "Este nombre de usuario ya esta utilizado." } });

                await sql `
                    UPDATE
                        member
                    SET
                        username_member = ${username}
                    WHERE
                        id_member = ${user.id} and
                        username_member = ${user.username};
                `;
                
                return res.json({ ok: true });
            });
        } catch (error) {
            console.error(error)
            return res.json({ ok: false, error: { message: 'Ha ocurrido un problema. Intentalo mas tarde.' } });
        }
    })
}