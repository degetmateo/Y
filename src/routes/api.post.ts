import Postgres from "../database/Postgres";
import getTimeDifference from "../helpers/get_time_difference";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/api/post/:id_post', server.authenticate, async (req, res) => {
        try {
            const id_post = req.params.id_post;
            const id_user = req.user.id;
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
                        m.role_member,
                        (SELECT COUNT(*) FROM upvote WHERE id_post = p.id_post) as upvotes_count_post,
                        (SELECT COUNT(*) FROM post WHERE id_post_replied = p.id_post) as comments_count_post,
                        (SELECT id_member_upvote FROM upvote WHERE id_post = p.id_post and id_member_upvote = ${id_user}) as is_upvoted
                    FROM
                        post p, member m
                    WHERE 
                        p.id_post = ${id_post} and
                        p.id_member = m.id_member;
                `;
                if (!queryPost[0]) return res.json({ ok: false, error: { message: "Ha ocurrido un error." } });

                const p = queryPost[0];

                return res.json({ 
                    ok: true, 
                    post: {
                        id: p.id_post,
                        content: p.content_post,
                        date: getTimeDifference(new Date(p.date_post)),
                        date_original: new Date(p.date_post),
                        images: p.images,
                        comments_count: p.comments_count_post,
                        upvotes_count: p.upvotes_count_post,
                        is_upvoted: p.is_upvoted ? true : false,
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