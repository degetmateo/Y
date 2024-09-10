import express from 'express';
import Server from "../Server";
import Postgres from '../database/Postgres';
import getTimeDifference from '../helpers/get_time_difference';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id?: number;
                username?: string;
            }
        }
    }
}

module.exports = (server: Server) => {
    server.app.get('/api/posts/global/:limit/:offset', server.authenticate, async (req: express.Request, res: express.Response) => {
        try {
            const id = req.user.id;
            const limit = parseInt(req.params.limit as string) || 20;
            const offset = parseInt(req.params.offset as string) || 0;
            await Postgres.query().begin(async sql => {
                await sql`
                    SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
                `;

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
                        p.id_member = m.id_member 
                    AND
                        p.id_post_replied is null
                    ORDER BY 
                        p.date_post DESC
                    LIMIT 
                        ${limit}
                    OFFSET 
                        ${offset};
                `;  

                // const queryPosts = await sql`
                //     SELECT 
                //         p.*,
                //         m.username_member,
                //         m.name_member,
                //         m.profile_pic_url_member,
                //         m.role_member,
                //         (SELECT COUNT(*) FROM upvote WHERE id_post = p.id_post) as upvotes_count_post,
                //         (SELECT COUNT(*) FROM post WHERE id_post_replied = p.id_post) as comments_count_post,
                //         (SELECT id_member_upvote FROM upvote WHERE id_post = p.id_post and id_member_upvote = ${id}) as is_upvoted,
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

                const posts = q.map(p => {
                    return {
                        id: p.id_post,
                        content: p.content_post,
                        date: getTimeDifference(new Date(p.date_post)),
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
            return res.json({ ok: false, error: { message: "Ha ocurrido un error." }});
        }
    });
}