import { Component, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { filter } from 'rxjs';
import { FormMachineComponent } from './components/form-machine/form-machine.component';
import { IpcService } from './services/ipc.service';
import { Terminal } from './types/app.types';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
    // pong$: Observable<boolean>;
    formMachineRef: MatDialogRef<FormMachineComponent>;

    constructor(private readonly ipcService: IpcService, private dialog: MatDialog) {}

    terminals: Terminal[] = [
        {
            id: 1,
            name: 'Kevin',
            ip: '192.168.1.3',
            status: false,
            timer: '00:00:00',
        },
    ];

    // ngOnInit(): void {
    // this.listenReply();
    // }

    handleTerminal(id: number): void {
        console.log(id);
        const terminals = this.terminals.filter(terminal => terminal.id !== id);
        const terminalFiltered = this.terminals.filter(terminal => terminal.id === id)[0];
        terminalFiltered.status = true;
        this.ipcService.on('timer').subscribe(info => {
            terminalFiltered.timer = info.time;
        });
        this.terminals = [...terminals, terminalFiltered];
    }

    openDialogMachine() {
        this.formMachineRef = this.dialog.open(FormMachineComponent);

        this.formMachineRef
            .afterClosed()
            .pipe(filter(data => data))
            .subscribe(data => {
                this.terminals.push({ status: false, timer: '00:00:00', ...data });
            });
    }

    // listenReply(): void {
    //     if (!this.ipcService.isElectron()) return;
    //     this.pong$ = this.ipcService.on('reply').pipe(map((payload: any) => payload === 'pong'));
    // }

    // ping(): void {
    //     this.ipcService.send('message', 'ping');
    // }

    ngOnDestroy(): void {
        this.ipcService.removeAllListeners('timer');
    }
}
