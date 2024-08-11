import express from 'express';
import Server from "../Server";
import Postgres from '../database/Postgres';

module.exports = (server: Server) => {
    server.app.get('/posts', server.authenticate, async (req: express.Request, res: express.Response) => {
        
        const queryPosts = await Postgres.query() `
            SELECT bp.id, bp.id_base_user, bp.username_base_user, bp.content, bp.date, bp.id_post_original, bu.name FROM 
                base_post bp, base_user bu
            WHERE
                bp.id_base_user = bu.id and
                bp.username_base_user = bu.username;
        `;

        const posts = queryPosts.map(p => {
            return {
                id: p.id,
                content: p.content,
                date: getTimeDifference(new Date(p.date)),
                creator: {
                    id: p.id_base_user,
                    name: p.name,
                    username: p.username_base_user
                }
            }
        });

        res.json({
            ok: true,
            posts
        })
    })

    function getTimeDifference (date: Date) {
        const now = new Date(new Date().setHours(new Date().getHours()+3));
        let dif = now.getTime() - date.getTime();
    
        const seconds = Math.floor(dif / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
    
        const daysInYear = 365.25;
        const daysInMonth = 30.44; 
    
        const years = Math.floor(days / daysInYear);
        const months = Math.floor(days / daysInMonth);
    
        return {
            years,
            months,
            days,
            hours,
            minutes,
            seconds
        }
    }

    server.app.post('/post/create', server.authenticate, async (req: express.Request, res: express.Response) => {
        console.log('POST CREATE', req.body)

        const content = req.body.post.content;

        if (content.length > 400) {
            return res.json({
                ok: false,
                error: {
                    code: 'post',
                    message: 'Has superado el limite de caracteres (400).'
                }
            })
        }
        const user = req.body.user;
        
        const queryUserCreator = await Postgres.query() `
            SELECT * FROM
                base_user bu
            WHERE
                bu.username = ${user.username};
        `;
        
        if (!queryUserCreator[0]) return res.json({ ok:false, error: { code: 'auth', message: 'Error de autentificacion.' } });
        
        const queryPostCount = await Postgres.query() `
            SELECT * FROM base_post;
        `;

        await Postgres.query() `
            INSERT INTO
                base_post
            VALUES (
                ${queryPostCount.length+1},
                ${queryUserCreator[0].id},
                ${queryUserCreator[0].username},
                ${content},
                ${new Date()},
                null
            );
        `;

        res.json({
            ok: true
        })
    })
}