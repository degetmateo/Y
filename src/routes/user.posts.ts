import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/user/posts', server.authenticate, async (req:any, res) => {
        const queryPosts = await Postgres.query()`
            SELECT * FROM
                base_post
            WHERE
                username_base_user = ${req.user.username.username} 
        `;
        
        res.json({
            ok: true,
            posts: queryPosts
        })
    })
}