import express from 'express';
import path from 'path';
import Server from "../Server";

module.exports = (server: Server) => {
    server.app.get('/', (_, res: express.Response) => {
        res.sendFile(path.join(__dirname + '/../../public/app.html'));
    });
}