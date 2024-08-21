import Postgres from "../database/Postgres";
import Server from "../Server";
import bcrypt from 'bcrypt';

module.exports = (server: Server) => {
    server.app.post('/api/admin/user/update/password', server.authenticateAdministrator, async (req, res) => {
        const username = req.body.user.username;
        const password = req.body.user.password;
        if (!username || !password) return res.json({ ok: false, error: { message: "Username & Password required." } });
        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            await Postgres.query().begin(async sql => {
                await sql`
                    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
                `;

                await sql`
                    UPDATE
                        member
                    SET
                        password_member = ${hashedPassword}
                    WHERE
                        username_member = ${username};
                `;

                return res.json({ ok: true });
            });
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: error.message } });
        }
    });
}