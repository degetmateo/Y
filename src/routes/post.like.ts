import Server from "../Server";

module.exports = (server: Server) => {
    server.app.post('/post/like',  server.authenticate, (req, res) => {
        
    })
}