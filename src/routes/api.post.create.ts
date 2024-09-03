import Server from "../Server";

module.exports = (server: Server) => {
    server.app.post('/api/post/create', server.authenticate, async (req, res) => {
        try {
            const _post = req.body.post;
            const _content = _post.content;
            const _images = _post.images;
            const _username = req.user.username;
            return res.json({ ok: true });
        } catch (error) {
            console.error(error);
            return res.json({ ok: false, error: { message: error.message } });
        }
    });
}