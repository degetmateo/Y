import Server from "../Server";

module.exports = (server: Server) => {
    server.app.post('/api/admin/user/update/username', server.authenticateAdministrator, (req, res) => {
       return; 
    });
}