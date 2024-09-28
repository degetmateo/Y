import Postgres from "../database/Postgres";
import getTimeDifference from "../helpers/get_time_difference";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/api/post/:id_post/thread', server.authenticate, async (req, res) => {
        try {
            const id_post = req.params.id_post;
            const id_user = req.user.id;
            await Postgres.query().begin(async sql => {
                await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;
                const q = await sql`SELECT * FROM post WHERE id_post = ${id_post};`;
                const thread = new Array();
                const findPosts = async (_id) => {
                    const qPost = await sql`
                        SELECT
                            p.*,
                            m.username_member,
                            m.name_member,
                            m.profile_pic_url_member,
                            m.role_member,
                            (SELECT COUNT(*) FROM upvote WHERE id_post = p.id_post) as upvotes_count_post,
                            (SELECT COUNT(*) FROM post WHERE id_post_replied = p.id_post) as comments_count_post,
                            (SELECT id_member_upvote FROM upvote WHERE id_post = p.id_post and id_member_upvote = ${id_user}) as is_upvoted
                        FROM
                            post p, member m
                        WHERE
                            p.id_post = ${_id} AND
                            p.id_member = m.id_member;
                    `;
                    thread.push(qPost[0]);
                    if (qPost[0].id_post_replied) await findPosts(qPost[0].id_post_replied);
                };
                if (q[0].id_post_replied) await findPosts(q[0].id_post_replied);
                return res.json({
                    ok: true, 
                    thread: thread.map(p => {
                        return {
                            id: p.id_post,
                            content: p.content_post,
                            date: getTimeDifference(new Date(p.date_post)),
                            images: p.images_post,
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
                    })
                });
            });
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: "Ha ocurrido un error." } });
        }
    });
}