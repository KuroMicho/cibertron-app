import express from 'express';
import http from 'http';
import { Server as IoServer } from 'socket.io';

export default class Server {
    public app: express.Application;
    public server: http.Server;
    public io: IoServer;
    private port: string | number;

    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new IoServer(this.server);
        this.port = process.env.PORT || 4000;
    }

    _setRoutes() {
        this.app.get('/', (req, res) => {
            res.sendFile(__dirname, +'\\index.html');
        });
    }

    _listen() {
        this.server.listen(this.port, () => {
            console.log(`Server in port ${this.port}`);
        });
    }

    start() {
        this._setRoutes();
        this._listen();
    }
}
