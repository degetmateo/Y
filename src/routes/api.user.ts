import Postgres from "../database/Postgres";
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/api/user/:username', server.authenticate, async (req, res) => {
        const queryUserParams = await Postgres.query()`
            SELECT * FROM
                member m
            WHERE
                m.username_member = ${req.params.username};
        `;

        const queryUserRequest = await Postgres.query()`
            SELECT * FROM
                member m
            WHERE
                m.username_member = ${req.user.username};
        `;

        if (!queryUserParams[0] || !queryUserRequest[0]) return res.json({ ok: false, error: { message: '404: Not found.' } });

        const follow = await Postgres.query() `
            SELECT * FROM
                follow
            WHERE
                id_member_follower = ${queryUserRequest[0].id_member} and
                id_member_followed = ${queryUserParams[0].id_member};
        `;
        
        if (!queryUserParams[0]) {
            return res.json({
                ok: false,
                error: {
                    message: 'Not found.'
                }
            })
        }

        const queryFollowedCount = await Postgres.query()`
            SELECT COUNT(id_member_followed) FROM
                follow
            WHERE
                id_member_follower = ${queryUserParams[0].id_member};
        `;

        const queryFollowersCount = await Postgres.query()`
            SELECT COUNT(id_member_follower) FROM
                follow
            WHERE
                id_member_followed = ${queryUserParams[0].id_member};
        `;

        const user = queryUserParams[0];
        res.json({
            ok: true,
            user: {
                id: user.id_member,
                name: user.name_member,
                username: user.username_member,
                bio: user.bio_member,
                created_at: new Date(user.date_creation_member),
                isFollowed: follow[0] ? true : false,
                follows: {
                    followed: queryFollowedCount[0].count,
                    followers: queryFollowersCount[0].count
                },
                profilePic: {
                    url: user.profile_pic_url_member,
                    crop: {
                        x: 0,
                        y: 0,
                        w: 0,
                        h: 0
                    }
                }
            }
        });
    })
}