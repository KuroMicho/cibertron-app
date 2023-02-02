import express from 'express';
import http from 'http';
import { Server as IoServer } from 'socket.io';
import cors from 'cors';

export default class Server {
    public app: express.Application;
    public server: http.Server;
    public io: IoServer;
    public port: number | undefined;
    // private host: string | undefined;

    constructor() {
        this.app = express().use(cors());
        this.server = http.createServer(this.app);
        this.io = new IoServer(this.server);
        this.port = Number(process.env.EXPRESS_PORT) || 4000;
        // this.host = process.env.EXPRESS_HOST || 'localhost';
    }

    _setRoutes() {
        this.app.get('/', (req, res) => {
            res.send('<h1>nothing</h1>');
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
