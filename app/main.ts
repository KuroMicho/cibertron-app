import { BrowserWindow, ipcMain, app } from 'electron';
// import Store from 'electron-store';
import environment from './config/environment';
import SSH from './modules/ssh/ssh';
import Server from './server';
import { InfoTime, InfoUser } from './types/electron.types';
import { decrypt } from './utils/crypto';

class MainWindow {
    private window!: BrowserWindow;
    private env: string | undefined;
    private server!: Server;
    private client!: SSH;
    // private store: Store<Record<string, unknown>>;
    constructor() {
        this.env = environment.node_env;
        // this.store = new Store();
    }

    private init() {
        this.window = new BrowserWindow({
            width: 1280,
            height: 720,
            title: 'CiberCOL',
            resizable: true,
            fullscreenable: true,
            webPreferences: {
                devTools: this.env !== 'production' ? true : false,
                nodeIntegration: true,
                preload: `${app.getAppPath()}/preload.js`,
            },
        });

        if (this.env !== 'production') {
            this.window.loadURL('http://localhost:4200');
            this.window.webContents.openDevTools();
        } else {
            this.window.loadURL(`file://${__dirname}/index.html`);
        }
    }

    private setSocket(): void {
        this.server.io.on('connection', async socket => {
            console.log('A new client has connected.');
            // console.log('Connected sockets:', await this.server.io.fetchSockets());
            try {
                socket.on('info_user', (info: InfoUser) => {
                    const { username, ip } = info;
                    const address = this.decryptData({ iv: ip.iv, encryptedData: ip.encryptedData });
                    this.listenCredentials(address, username);
                });

                socket.on('disconnect', async () => {
                    socket.disconnect(true);
                    console.log('A client has disconnected.');
                    ipcMain.removeHandler('credentials');
                    ipcMain.removeHandler('s_control_panel');
                    // console.log('Connected sockets:', await this.server.io.fetchSockets());
                    const events = ipcMain.eventNames();
                    // console.log(events);
                    events.forEach(event => {
                        if (typeof event === 'string' && event !== 'error') {
                            ipcMain.removeAllListeners(event);
                        }
                    });
                });

                socket.on('info_time', (info: InfoTime) => {
                    const { ip, time } = info;
                    this.window.webContents.send('timer', { ip, time });
                });
            } catch (error) {
                console.error(error);
            }
        });
    }

    private load() {
        this.init();
        this.server = new Server();
        this.server.start();
        this.setSocket();
        this.window.show();
    }

    // listenPong() {
    //     ipcMain.on('message', (event, message) => {
    //         // let clicks = 0;
    //         if (message === 'ping') {
    //             event.reply('reply', 'pong');
    //         }
    //         // this.store.set('clicks', clicks++);
    //         // console.log(this.store.get('clicks'));
    //     });
    // }

    public decryptData(data: any): string | undefined {
        const result = decrypt(data);
        return result;
    }

    private listenSettingDisableControlPanel(): void | { message: string; status: string } {
        ipcMain.handle('s_control_panel', async (_, setting) => {
            try {
                await this.client.disableControlPanel(setting);
                return { message: 'Operacion exitosa', status: 'ok' };
            } catch (err: any | string) {
                return { message: 'Operacion fallida', status: 'error' };
            }
        });
    }

    private listenCredentials(
        address: string | undefined,
        username: string
    ): void | { message: string; status: string } {
        ipcMain.handle('credentials', async (_, credentials: any) => {
            try {
                if (credentials !== null) {
                    const { password, ip, name } = credentials;
                    if (address !== ip) throw new Error('Direccion IP no encontrada');
                    if (username !== name) throw new Error(`Cuenta ${name} no encontrada`);
                    this.client = new SSH(ip, name);
                    this.client.setPassword(password);
                    await this.client.setConnection();
                    return { message: 'Conexion exitosa', status: 'ok' };
                }
            } catch (err: any | string | { code: string; address: string }) {
                if (err.code == 'ECONNREFUSED') {
                    return { message: 'Conexion rechazada 💻 Revisa la contraseña', status: 'error' };
                } else {
                    return { message: err, status: 'error' };
                }
            }
        });
    }

    app() {
        if (require('electron-squirrel-startup')) app.quit();

        app.whenReady().then(() => {
            this.load();
            this.listenSettingDisableControlPanel();
        });

        app.on('window-all-closed', () => {
            app.quit();
        });
    }
}

const electron = new MainWindow();
electron.app();
