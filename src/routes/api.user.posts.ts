import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/api/user/:username/posts', server.authenticate, async (req, res) => {
        const queryUserPosts = await Postgres.query()`
            SELECT * FROM
                base_post p
            WHERE
                p.username_base_user = ${req.params.username};
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
                    id: post.id,
                    content: post.content,
                    date: post.date
                }
            })
        });
    })
}