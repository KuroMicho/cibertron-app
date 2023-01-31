import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ipcRenderer', {
    on: (channel: any, listener: any) => ipcRenderer.on(channel, listener),
    send: (channel: any, ...args: any[]) => ipcRenderer.send(channel, ...args),
    removeAllListeners: (channel: any) => ipcRenderer.removeAllListeners(channel),
    invoke: (channel: any, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
});
