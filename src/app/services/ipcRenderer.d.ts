declare namespace Electron {
    interface IpcRendererEvent {
        sender: any;
        returnValue: any;
    }
}

interface IpcRenderer {
    send(channel: string, ...args: any): Promise<any>;
    on(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void): void;
    removeAllListeners(channel: string): void;
    invoke(channel: string, ...args: any): Promise<any>;
}

declare var ipcRenderer: IpcRenderer;