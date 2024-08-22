import Postgres from "../database/Postgres";
import getTimeDifference from "../helpers/get_time_difference";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/api/user/:username/posts/:limit/:offset', server.authenticate, async (req, res) => {
        const limit = parseInt(req.params.limit as string) || 20;
        const offset = parseInt(req.params.offset as string) || 0;

        const queryUserPosts = await Postgres.query()`
            SELECT * FROM
                post p, member m
            WHERE
                m.username_member = ${req.params.username} and
                p.id_member = m.id_member
            ORDER BY 
                p.date_post DESC
            LIMIT
                ${limit}
            OFFSET
                ${offset};
        `;
        
        if (!queryUserPosts[0]) {
            return res.json({
                ok: false,
                error: {
                    message: 'Not found.'
                }
            })
        }

        return res.json({
            ok: true,
            posts: queryUserPosts.map(post => {
                return {
                    id: post.id_post,
                    content: post.content_post,
                    date: getTimeDifference(new Date(post.date_post))
                }
            })
        });
    })
}