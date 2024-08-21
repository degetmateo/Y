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
    server.app.get('/api/posts/following', server.authenticate, async (req, res) => {
        const username = req.user.username;

        try {
            await Postgres.query().begin(async sql => {
                await sql`SET TRANSACTION ISOLATION LEVEL READ COMMITTED;`;
            
                const queryFollowedUsersPosts = await sql`
                    SELECT 
                        p.id_post,
                        p.id_member,
                        m2.username_member,
                        p.content_post,
                        p.date_post,
                        m2.name_member,
                        m2.profile_pic_url_member,
                        m2.role_member
                    FROM
                        follow f, post p, member m1, member m2
                    WHERE
                        m1.username_member = ${username} and
                        f.id_member_follower = m1.id_member and
                        p.id_member = f.id_member_followed and
                        m2.id_member = f.id_member_followed
                    ORDER BY
                        p.date_post DESC
                    LIMIT
                        50;
                `;
    
                const posts = queryFollowedUsersPosts.map(p => {
                    return {
                        id: p.id_post,
                        content: p.content_post,
                        date: getTimeDifference(new Date(p.date_post)),
                        role: p.role_member,
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