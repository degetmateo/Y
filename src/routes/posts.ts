import express from 'express';
import Server from "../Server";
import Post from '../models/Post';

module.exports = (server: Server) => {
    server.app.get('/posts', server.authenticate, (req: express.Request, res: express.Response) => {
        console.log('/POSTS')
        res.json({
            ok: true,
            posts: server.getPosts()
        })
    })

    server.app.post('/post/create', server.authenticate, (req: express.Request, res: express.Response) => {
        console.log('POST CREATE', req.body)

        const posts = server.getPosts();
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
        const date = new Date()
        const creator = server.getUsers().find(u => u.getName() === user.name);
        if (!creator) return res.json({ ok:false, error: { code: 'auth', message: 'Error de autentificacion.' } });
        server.addPost(new Post(posts.length + 1, content, date, creator.toJson(), null));

        res.json({
            ok: true
        })
    })
}