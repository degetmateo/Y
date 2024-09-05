import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/api/member/:username', server.authenticate, async (req, res) => {
        try {
            await Postgres.query().begin(async sql => {
                await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;
                const qMemberParams = await sql`SELECT * FROM member WHERE username_member = ${req.params.username};`;
                const qMemberRequest = await sql`SELECT * FROM member WHERE username_member = ${req.user.username};`; 
                if (!qMemberParams[0] || !qMemberRequest[0]) return res.json({ ok: false, error: { message: "404: Recurso no encontrado." } });
                const qFollow = await sql`
                    SELECT * FROM follow
                    WHERE id_member_follower = ${qMemberRequest[0].id_member} and id_member_followed = ${qMemberParams[0].id_member};
                `;
                const qFollowedCount = await sql`
                    SELECT f.id_member_followed, m.name_member, m.username_member FROM
                        follow f, member m
                    WHERE
                        f.id_member_follower = ${qMemberParams[0].id_member} and
                        m.id_member = f.id_member_followed;
                `;
                const qFollowersCount = await sql`
                    SELECT f.id_member_follower, m.name_member, m.username_member FROM
                        follow f, member m
                    WHERE
                        f.id_member_followed = ${qMemberParams[0].id_member} and
                        m.id_member = f.id_member_follower;
                `;
                const member = qMemberParams[0];
                return res.json({ ok: true,
                    user: {
                        id: member.id_member,
                        name: member.name_member,
                        username: member.username_member,
                        bio: member.bio_member,
                        created_at: new Date(member.date_creation_member),
                        isFollowed: qFollow[0] ? true : false,
                        role: member.role_member,
                        follows: {
                            followed: qFollowedCount,
                            followers: qFollowersCount
                        },
                        profilePicture: {
                            url: member.profile_pic_url_member,
                        }
                    }
                });
            });
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: "Ha ocurrido un error. Inténtalo de nuevo más tarde." } });
        }
   });
}