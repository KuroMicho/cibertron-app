import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class IpcService {
    constructor(private readonly ngZone: NgZone) {}

    isElectron(): boolean {
        const userAgent = navigator.userAgent.toLowerCase();
        return userAgent.indexOf('electron') !== -1;
    }

    on(channel: string): Observable<any> {
        return new Observable(observer => {
            window.ipcRenderer.on(channel, (_event: any, payload: any) => {
                this.ngZone.run(() => observer.next(payload));
            });
        });
    }

    send(channel: string, ...args: any[]): Promise<{ status: string; message: string }> {
        if (!this.isElectron()) {
            return Promise.resolve({ status: 'error', message: 'not_electron' });
        }
        return window.ipcRenderer.send(channel, ...args);
    }

    invoke(channel: string, ...args: any[]): Promise<{ status: string; message: string }> {
        if (!this.isElectron()) {
            return Promise.resolve({ status: 'error', message: 'not_electron' });
        }
        return window.ipcRenderer.invoke(channel, ...args);
    }

    removeAllListeners(channel: string): void {
        if (!this.isElectron()) return;
        window.ipcRenderer.removeAllListeners(channel);
    }
}
