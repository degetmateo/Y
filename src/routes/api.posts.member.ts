import Postgres from "../database/Postgres";
import getTimeDifference from "../helpers/get_time_difference";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/api/posts/member/:username/:limit/:offset', server.authenticate, async (req, res) => {
        try {
            let limit = parseInt(req.params.limit as string) || 20;
            const offset = parseInt(req.params.offset as string) || 0;
            const id = req.user.id;
            if (limit > 20 || limit < 1) limit = 20;
            await Postgres.query().begin(async sql => {
                await sql`
                    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
                `;

                // const queryUserPosts = await sql`
                //     SELECT 
                //         p.*,
                //         m.username_member,
                //         m.name_member,
                //         m.profile_pic_url_member,
                //         m.role_member,
                //         (SELECT COUNT(*) FROM post WHERE id_post_replied = p.id_post) as comments_count_post,
                //         COALESCE(json_agg(jsonb_build_object(
                //             'id_member_upvote', u.id_member_upvote,
                //             'id_member_post', u.id_member_post,
                //             'id_post', u.id_post
                //         )) FILTER (WHERE u.id_member_upvote IS NOT NULL), '[]') AS upvotes
                //     FROM
                //         post p
                //     JOIN
                //         member m ON p.id_member = m.id_member
                //     LEFT JOIN
                //         upvote u ON p.id_post = u.id_post
                //     WHERE
                //         m.username_member = ${req.params.username} and
                //         p.id_post_replied is null
                //     GROUP BY
                //         p.id_post, p.id_member, m.username_member, m.name_member, m.profile_pic_url_member, m.role_member
                //     ORDER BY 
                //         p.date_post DESC
                //     LIMIT 
                //         ${limit}
                //     OFFSET 
                //         ${offset};
                // `;


                const q = await sql`
                    SELECT
                        p.*,
                        m.username_member,
                        m.name_member,
                        m.profile_pic_url_member,
                        m.role_member,
                        (SELECT COUNT(*) FROM upvote WHERE id_post = p.id_post) as upvotes_count_post,
                        (SELECT COUNT(*) FROM post WHERE id_post_replied = p.id_post) as comments_count_post,
                        (SELECT id_member_upvote FROM upvote WHERE id_post = p.id_post and id_member_upvote = ${id}) as is_upvoted
                    FROM
                        post p, member m
                    WHERE
                        m.username_member = ${req.params.username} and
                        p.id_member = m.id_member and
                        p.id_post_replied is null
                    AND
                        p.id_post_replied is null
                    ORDER BY 
                        p.date_post DESC
                    LIMIT 
                        ${limit}
                    OFFSET 
                        ${offset};
                `;

                const posts = q.map(post => {
                    return {
                        id: post.id_post,
                        content: post.content_post,
                        upvotes: post.upvotes,
                        images: post.images,
                        date: getTimeDifference(new Date(post.date_post)),
                        comments_count: post.comments_count_post,
                        upvotes_count: post.upvotes_count_post,
                        is_upvoted: post.is_upvoted ? true : false
                    };
                });

                return res.json({ ok: true, posts });
            });
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: "Ha ocurrido un error." } });
        }
    });
}