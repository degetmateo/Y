import Postgres from "../database/Postgres";
import Server from "../Server";
import bcrypt from 'bcrypt';

module.exports = (server: Server) => {
    server.app.post('/api/member/update/password', server.authenticate, async (req, res) => {
        try {
            const password = req.body.user.password;
            const newPassword = req.body.user.new_password;
            if (!password || password.length <= 0) return res.json({ ok: false, error: { message: "Debes ingresar tu PASSWORD." } });
            if (!newPassword || newPassword.length <= 5) return res.json({ ok: false, error: { message: "Debes ingresar una PASSWORD mas larga." } });
            
            await Postgres.query().begin(async sql => {
                await sql`
                    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
                `;
    
                const queryUser = await sql`
                    SELECT * FROM
                        member
                    WHERE
                        username_member = ${req.user.username};
                `;
    
                if (!queryUser[0]) return res.json({ ok: false, error: { message: "Error de Autentificacion." } });
                if (!await bcrypt.compare(password, queryUser[0].password_member)) 
                    return res.json({ ok: false, error: { message: 'PASSWORD incorrecta.' } });
            
                const newHashedPassword = await bcrypt.hash(newPassword, 10);
    
                await sql`
                    UPDATE
                        member
                    SET
                        password_member = ${newHashedPassword}
                    WHERE
                        username_member = ${queryUser[0].username_member} and
                        id_member = ${queryUser[0].id_member};    
                `;
    
                return res.json({ ok: true });
            });            
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: "SQL error." } });   
        }
    });
}