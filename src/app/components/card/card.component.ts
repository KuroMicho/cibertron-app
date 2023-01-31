import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { IpcService } from '../../services/ipc.service';
import { Credentials } from '../../types/app.types';
import { FormSettingsComponent } from '../form-settings/form-settings.component';

interface Terminal {
    id: number;
    name: string;
    ip: string;
    status: boolean;
    timer: string;
}

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
})
export class CardComponent {
    @ViewChild('template') template: TemplateRef<any>;
    @Input() terminal!: Terminal;
    @Output() terminalId: EventEmitter<number> = new EventEmitter<number>();

    alert!: string;
    iconStatus!: boolean;
    loading!: boolean;
    horizontalPosition: MatSnackBarHorizontalPosition = 'left';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    formSettingsRef: MatDialogRef<FormSettingsComponent>;

    constructor(
        private readonly ipcService: IpcService,
        private readonly snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {}

    openSnackBar(): void {
        this.snackBar.openFromTemplate(this.template, {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 3000,
        });
    }

    async onTerminal(): Promise<void> {
        this.loading = true;
        const credentials: Credentials = {
            ip: this.terminal.ip,
            name: this.terminal.name,
            password: '3134',
        };
        try {
            const res = await this.ipcService.invoke('credentials', credentials);
            if (res.status === 'error') {
                this.iconStatus = false;
                this.alert = res.message;
            }
            if (res.status === 'ok') {
                this.iconStatus = true;
                this.alert = res.message;
                this.terminalId.emit(this.terminal.id);
            }

            this.loading = false;
            this.openSnackBar();
        } catch (err: string | any) {
            if (err) {
                this.iconStatus = false;
                this.alert = 'Terminal Desconectada';
                this.openSnackBar();
            }
            this.loading = false;
        }
    }

    onSettings(): void {
        this.formSettingsRef = this.dialog.open(FormSettingsComponent, { data: this.terminal });
    }
}
