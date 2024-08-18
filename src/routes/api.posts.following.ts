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
                        p.id,
                        p.id_base_user,
                        p.username_base_user,
                        p.content,
                        p.date,
                        p.id_post_original,
                        u.name,
                        pic.url,
                        pic.x,
                        pic.y,
                        pic.w
                    FROM
                        follow f, base_post p, base_user u, user_profile_picture pic
                    WHERE
                        f.username_base_user_follower = ${username} and
                        p.username_base_user = f.username_base_user_followed and
                        u.username = f.username_base_user_followed and
                        pic.username_base_user = u.username
                    ORDER BY
                        p.date DESC
                    LIMIT
                        50;
                `;
    
                const posts = queryFollowedUsersPosts.map(p => {
                    return {
                        id: p.id,
                        content: p.content,
                        date: getTimeDifference(new Date(p.date)),
                        creator: {
                            id: p.id_base_user,
                            name: p.name,
                            username: p.username_base_user,
                            profilePicture: {
                                url: p.url,
                                x: p.x,
                                y: p.y,
                                w: p.w,
                                h: p.w
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