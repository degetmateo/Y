import express from 'express';
import Server from "../Server";
import Postgres from '../database/Postgres';

module.exports = (server: Server) => {
    server.app.get('/posts', server.authenticate, async (req: express.Request, res: express.Response) => {
        
        const queryPosts = await Postgres.query() `
            SELECT 
                bp.id,
                bp.id_base_user,
                bp.username_base_user,
                bp.content,
                bp.date,
                bp.id_post_original,
                bu.name,
                pp.url,
                pp.x,
                pp.y,
                pp.w
            FROM 
                base_post bp, base_user bu, user_profile_picture pp
            WHERE
                bp.id_base_user = bu.id and
                bp.username_base_user = bu.username and
                bu.id = pp.id_base_user and
                bu.username = pp.username_base_user
            ORDER BY
                bp.date;
        `;

        const posts = queryPosts.map(p => {
            return {
                id: p.id,
                content: p.content,
                date: getTimeDifference(new Date(p.date)),
                creator: {
                    id: p.id_base_user,
                    name: p.name,
                    username: p.username_base_user,
                    profilePicture: {
                        url: p.url,
                        x: p.x,
                        y: p.y,
                        w: p.w,
                        h: p.w
                    }
                }
            }
        });

        res.json({
            ok: true,
            posts
        })
    })

    function getTimeDifference (date: Date) {
        const now = new Date();
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
}