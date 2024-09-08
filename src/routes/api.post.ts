import Postgres from "../database/Postgres";
import getTimeDifference from "../helpers/get_time_difference";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/api/post/:id_post', server.authenticate, async (req, res) => {
        const id_post = req.params.id_post;
        try {
            await Postgres.query().begin(async sql => {
                await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;
                const queryPost = await sql`
                    SELECT
                        p.id_post,
                        p.id_member,
                        p.content_post,
                        p.date_post,
                        p.images,
                        m.name_member,
                        m.username_member,
                        m.profile_pic_url_member,
                        m.role_member
                    FROM 
                        post p, member m
                    WHERE 
                        p.id_post = ${id_post} and
                        p.id_member = m.id_member;
                `;
                if (!queryPost[0]) return res.json({ ok: false, error: { message: "Ha ocurrido un error." } });
                const queryUpvotes = await sql`
                    SELECT * FROM
                        upvote
                    WHERE
                        id_post = ${id_post};
                `;
                const p = queryPost[0];
                return res.json({ 
                    ok: true, 
                    post: {
                        id: p.id_post,
                        content: p.content_post,
                        date: getTimeDifference(new Date(p.date_post)),
                        date_original: new Date(p.date_post),
                        upvotes: queryUpvotes,
                        images: p.images,
                        creator: {
                            id: p.id_member,
                            name: p.name_member,
                            username: p.username_member,
                            role: p.role_member,
                            profilePicture: {
                                url: p.profile_pic_url_member
                            }
                        }
                    }
                });
            });
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: "Ha ocurrido un error." } });
        }
    });
}