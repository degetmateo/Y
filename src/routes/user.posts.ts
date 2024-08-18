import Postgres from "../database/Postgres";
import getTimeDifference from "../helpers/get_time_difference";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/user/posts', server.authenticate, async (req:any, res) => {
        const queryPosts = await Postgres.query()`
            SELECT p.id_post, p.content_post, p.date_post FROM
                post p, member m
            WHERE
                m.username_member = ${req.user.username} and 
                p.id_member = m.id_member;
        `;

        const posts = queryPosts.map(p => {
            return {
                id: p.id_psot,
                content: p.content_post,
                date: getTimeDifference(new Date(p.date_post)),
            }
        });
        
        return res.json({
            ok: true,
            posts
        })
    })
}