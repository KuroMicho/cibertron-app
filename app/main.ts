import environment from './config/environment';
import path from 'path';
import { spawn } from 'child_process';
import { BrowserWindow, ipcMain, app, autoUpdater } from 'electron';
import SSH from './modules/ssh/ssh';
import Server from './server';
import { Credentials, InfoTime, InfoUser } from './types/electron.types';
import { decrypt } from './utils/crypto';
// import Store from 'electron-store';

function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawnProcess = function (command: any, args: any) {
        let spawnedProcess: any;

        try {
            spawnedProcess = spawn(command, args, { detached: true });
        } catch (error) {
            console.log(error);
        }

        return spawnedProcess;
    };

    const spawnUpdate = function (args: any) {
        return spawnProcess(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit();
            return true;
    }
}

class MainWindow {
    private window!: BrowserWindow;
    private env: string | undefined;
    private server!: Server;
    private client!: SSH;
    // private store: Store<Record<string, unknown>>;
    constructor() {
        this.env = environment.node_env || 'production';
        // this.store = new Store();
    }

    _init() {
        app.setAppUserModelId('com.squirrel.cibertron.Cibertron');

        this.window = new BrowserWindow({
            width: 1280,
            height: 720,
            title: 'Cibertron',
            webPreferences: {
                devTools: this.env !== 'production' ? true : false,
                preload: path.join(__dirname, 'preload.js'),
            },
        });

        if (this.env !== 'production') {
            this.window.loadURL('http://localhost:4200');
            this.window.webContents.openDevTools();
        } else {
            this.window.setMenu(null);
            this.window.loadURL(`file://${__dirname}/index.html`);
        }
    }

    _sendStatusToWindow(text: string) {
        this.window.webContents.send('message', text);
        console.log(text);
    }

    _onUpdates() {
        autoUpdater.setFeedURL({
            url: 'https://github.com/KuroMicho/cibertron-app/releases/latest',
            serverType: 'json',
        });
        autoUpdater.on('checking-for-update', () => {
            this._sendStatusToWindow('Checking for update...');
        });
        autoUpdater.on('update-available', (info: any) => {
            this._sendStatusToWindow('Update available.');
        });
        autoUpdater.on('update-not-available', (info: any) => {
            this._sendStatusToWindow('Update not available.');
        });
        autoUpdater.on('error', err => {
            this._sendStatusToWindow('Error in auto-updater. ' + err);
        });
        autoUpdater.on('before-quit-for-update', (info: any) => {
            console.log(info);
            // let log_message = 'Download speed: ' + progressObj.bytesPerSecond;
            // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
            // log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')';
            // this._sendStatusToWindow(log_message);
        });
        autoUpdater.on('update-downloaded', (info: any) => {
            this._sendStatusToWindow('Update downloaded');
            setTimeout(function () {
                autoUpdater.quitAndInstall();
            }, 5000);
        });
    }

    _setSocket() {
        this.server.io.on('connection', socket => {
            console.log('A new client has connected.');
            // console.log('Connected sockets:', await this.server.io.fetchSockets());
            try {
                this.listenSettingDisableControlPanel();

                socket.on('info_user', (info: InfoUser) => {
                    const { username, ip } = info;
                    const address = this.decryptData({ iv: ip.iv, encryptedData: ip.encryptedData });
                    this.listenCredentials(address, username);
                });

                socket.on('disconnect', () => {
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

    _load() {
        this._init();
        this.server = new Server();
        this.server.start();
        this._setSocket();
        this._onUpdates();
        this.window.show();
    }

    decryptData(data: any): string | undefined {
        const result = decrypt(data);
        return result;
    }

    listenSettingDisableControlPanel(): void | { message: string; status: string } {
        ipcMain.handle('s_control_panel', async (_, setting: number) => {
            try {
                await this.client.disableControlPanel(setting);
                return { message: 'Operacion exitosa', status: 'ok' };
            } catch (err: any | string) {
                return { message: 'Operacion fallida', status: 'error' };
            }
        });
    }

    listenCredentials(address: string | undefined, username: string): void | { message: string; status: string } {
        ipcMain.handle('credentials', async (_, credentials: Credentials) => {
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
        if (handleSquirrelEvent()) {
            // squirrel event handled and app will exit in 1000ms, so don't do anything else
            return;
        }

        app.whenReady().then(() => {
            this._load();
            autoUpdater.checkForUpdates();
        });

        app.on('window-all-closed', function () {
            if (process.platform !== 'darwin') app.quit();
        });
    }
}

const electron = new MainWindow();
electron.app();
