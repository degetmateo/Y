import Postgres from "../database/Postgres";
import getTimeDifference from "../helpers/get_time_difference";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/user/posts', server.authenticate, async (req:any, res) => {
        const queryPosts = await Postgres.query()`
            SELECT * FROM
                base_post
            WHERE
                username_base_user = ${req.user.username};
        `;

        const posts = queryPosts.map(p => {
            return {
                id: p.id,
                content: p.content,
                date: getTimeDifference(new Date(p.date)),
            }
        });
        
        res.json({
            ok: true,
            posts
        })
    })
}