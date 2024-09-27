import { Request } from "express";
import Postgres from "../database/Postgres";
import getTimeDifference from "../helpers/get_time_difference";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/api/post/:id_post/comments', server.authenticate, async (req: Request, res) => {
        try {
            const id_post = req.params.id_post;
            const id_user = req.user.id;
            if (!id_post) throw new Error("TYPE ERROR.");
            await Postgres.query().begin(async sql => {
                await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;
                // const q = await sql`
                //         SELECT 
                //             p.*,
                //             m.username_member,
                //             m.name_member,
                //             m.profile_pic_url_member,
                //             m.role_member,
                //             (SELECT COUNT(*) FROM post WHERE id_post_replied = p.id_post) as comments_count_post,
                //             COALESCE(json_agg(jsonb_build_object(
                //                 'id_member_upvote', u.id_member_upvote,
                //                 'id_member_post', u.id_member_post,
                //                 'id_post', u.id_post
                //             )) FILTER (WHERE u.id_member_upvote IS NOT NULL), '[]') AS upvotes
                //         FROM 
                //             post p
                //         JOIN 
                //             member m ON p.id_member = m.id_member
                //         LEFT JOIN 
                //             upvote u ON p.id_post = u.id_post
                //         WHERE
                //             p.id_post_replied = ${id_post}
                //         GROUP BY 
                //             p.id_post, p.id_member, m.username_member, m.name_member, m.profile_pic_url_member, m.role_member
                //         ORDER BY 
                //             p.date_post DESC;
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
                        (SELECT id_member_upvote FROM upvote WHERE id_post = p.id_post and id_member_upvote = ${id_user}) as is_upvoted
                    FROM
                        post p, member m
                    WHERE
                        p.id_member = m.id_member AND
                        p.id_post_replied = ${id_post}
                    ORDER BY 
                        p.date_post DESC
                `;  

                const posts = q.map(p => {
                    return {
                        id: p.id_post,
                        content: p.content_post,
                        date: getTimeDifference(new Date(p.date_post)),
                        upvotes: p.upvotes,
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

                return res.json({ ok: true, posts });
            });
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: "Ha ocurrido un error. Inténtalo de nuevo más tarde." } });
        }
    });
}