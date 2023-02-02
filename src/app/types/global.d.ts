import { IpcRenderer } from "../services/ipcRenderer";

declare global {
    interface Window {
        ipcRenderer: IpcRenderer;
    }
}