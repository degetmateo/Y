import express from 'express';
import Server from "../Server";
import Postgres from '../database/Postgres';
import getTimeDifference from '../helpers/get_time_difference';

module.exports = (server: Server) => {
    server.app.get('/api/posts/global', server.authenticate, async (req: express.Request, res: express.Response) => {
        const queryPosts = await Postgres.query() `
            SELECT 
                p.id_post,
                p.id_member,
                m.username_member,
                p.content_post,
                p.date_post,
                m.name_member,
                m.profile_pic_url_member
            FROM 
                post p, member m
            WHERE
                p.id_member = m.id_member
            ORDER BY
                p.date_post DESC
            LIMIT
                50;
        `;

        const posts = queryPosts.map(p => {
            return {
                id: p.id_post,
                content: p.content_post,
                date: getTimeDifference(new Date(p.date_post)),
                creator: {
                    id: p.id_member,
                    name: p.name_member,
                    username: p.username_member,
                    profilePicture: {
                        url: p.profile_pic_url_member,
                        x: 0,
                        y: 0,
                        w: 0,
                        h: 0
                    }
                }
            }
        });

        res.json({
            ok: true,
            posts
        })
    })
}