import Postgres from "../database/Postgres";
import getTimeDifference from "../helpers/get_time_difference";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/api/user/:username/posts', server.authenticate, async (req, res) => {
        const queryUserPosts = await Postgres.query()`
            SELECT * FROM
                post p, member m
            WHERE
                m.username_member = ${req.params.username} and
                p.id_member = m.id_member;
        `;
        
        if (!queryUserPosts[0]) {
            return res.json({
                ok: false,
                error: {
                    message: 'Not found.'
                }
            })
        }

        res.json({
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