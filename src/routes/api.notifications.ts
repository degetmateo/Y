import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/api/notifications/:offset', server.authenticate, async (req, res) => {
        try {
            const LIMIT = 20;
            const OFFSET = req.params.offset;
            const id = req.user.id;
            await Postgres.query().begin(async sql => {
                await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;
                const q = await sql`
                    SELECT 
                        n.*,
                        p.*,
                        m.name_member,
                        m.username_member,
                        m.profile_pic_url_member,
                        m.role_member 
                    FROM 
                        notification n
                    JOIN 
                        member m ON m.id_member = n.id_member_target_notification
                    LEFT JOIN 
                        post p ON (n.type_notification IN ('comment', 'upvote') AND n.id_post_target_notification = p.id_post)
                    WHERE 
                        n.id_member = ${id}
                    ORDER BY 
                        date_notification DESC
                    LIMIT 
                        ${LIMIT}
                    OFFSET 
                        ${OFFSET};
                `;

                return res.json({ 
                    ok: true, 
                    notifications: q.map(n => {
                        return {
                            id: n.id_notification,
                            date: n.date_notification,
                            type: n.type_notification,
                            target_member: {
                                id: n.id_member_target_notification,
                                name: n.name_member,
                                username: n.username_member,
                                role: n.role_member,
                                pic: n.profile_pic_url_member
                            },
                            target_post: {
                                id: n.id_post_target_notification,
                                id_post_replied: n.id_post_replied,
                                content: n.content_post,
                                date: n.date_post,
                                images: n.images
                            }
                        }
                    })
                });
            });

        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: "Ha ocurrido un error." } });
        }
    });
}