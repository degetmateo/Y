import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/api/user/:username', server.authenticate, async (req, res) => {
        const queryUser = await Postgres.query()`
            SELECT * FROM
                base_user bu, user_profile_picture pp
            WHERE
                bu.username = ${req.params.username} and
                bu.username = pp.username_base_user;
        `;

        const follow = await Postgres.query() `
            SELECT * FROM
                follow
            WHERE
                username_base_user_follower = ${req.user.username} and
                username_base_user_followed = ${req.params.username};
        `;
        
        if (!queryUser[0]) {
            return res.json({
                ok: false,
                error: {
                    message: 'Not found.'
                }
            })
        }

        const queryFollowedCount = await Postgres.query()`
            SELECT COUNT(id_base_user_followed) FROM
                follow
            WHERE
                username_base_user_follower = ${req.params.username};
        `;

        const queryFollowersCount = await Postgres.query()`
            SELECT COUNT(id_base_user_follower) FROM
                follow
            WHERE
                username_base_user_followed = ${req.params.username};
        `;

        const user = queryUser[0];
        res.json({
            ok: true,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                bio: user.bio,
                created_at: new Date(user.created_at),
                isFollowed: follow[0] ? true : false,
                follows: {
                    followed: queryFollowedCount[0].count,
                    followers: queryFollowersCount[0].count
                },
                profilePic: {
                    url: user.url,
                    crop: {
                        x: user.x,
                        y: user.y,
                        w: user.w,
                        h: user.h
                    }
                }
            }
        });
    })
}