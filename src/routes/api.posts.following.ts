import Postgres from "../database/Postgres";
import getTimeDifference from "../helpers/get_time_difference";
import Server from "../Server";

declare global {
    namespace Express {
      interface Request {
        user?: {
          username?: string
        }
      }
    }
  }

module.exports = (server: Server) => {
    server.app.get('/api/posts/following/:limit/:offset', server.authenticate, async (req, res) => {        
        try {
            const username = req.user.username;
            const limit = parseInt(req.params.limit as string) || 20;
            const offset = parseInt(req.params.offset as string) || 0;
            await Postgres.query().begin(async sql => {
                await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;

                const queryFollowedUsersPosts = await sql`
                    SELECT 
                        p.*,
                        m2.username_member,
                        m2.name_member,
                        m2.profile_pic_url_member,
                        m2.role_member,
                        COALESCE(json_agg(jsonb_build_object(
                            'id_member_upvote', u.id_member_upvote,
                            'id_member_post', u.id_member_post,
                            'id_post', u.id_post
                        )) FILTER (WHERE u.id_member_upvote IS NOT NULL), '[]') AS upvotes
                    FROM
                        follow f
                    JOIN
                        member m1 ON m1.username_member = ${username} 
                    JOIN
                        post p ON p.id_member = f.id_member_followed
                    JOIN
                        member m2 ON m2.id_member = f.id_member_followed
                    LEFT JOIN
                        upvote u ON p.id_post = u.id_post
                    WHERE
                        f.id_member_follower = m1.id_member and
                        p.id_post_replied is null
                    GROUP BY
                        p.id_post, p.id_member, m2.username_member, m2.name_member, m2.profile_pic_url_member, m2.role_member
                    ORDER BY
                        p.date_post DESC
                    LIMIT
                        ${limit}
                    OFFSET
                        ${offset};
                `;
    
                const posts = queryFollowedUsersPosts.map(p => {
                    return {
                        id: p.id_post,
                        content: p.content_post,
                        date: getTimeDifference(new Date(p.date_post)),
                        role: p.role_member,
                        upvotes: p.upvotes,
                        images: p.images,
                        creator: {
                            id: p.id_member,
                            name: p.name_member,
                            username: p.username_member,
                            role: p.role_member,
                            profilePicture: {
                                url: p.profile_pic_url_member,
                            }
                        }
                    }
                });
        
                res.json({
                    ok: true,
                    posts
                });
            });             
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: error.message } });   
        }
    });
}