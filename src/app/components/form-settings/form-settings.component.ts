import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { IpcService } from '../../services/ipc.service';
import { Settings, Terminal } from '../../types/app.types';

@Component({
    selector: 'app-form-settings',
    templateUrl: './form-settings.component.html',
    styleUrls: ['./form-settings.component.scss'],
})
export class FormSettingsComponent implements OnInit {
    @ViewChild('template') template: TemplateRef<any>;
    alert!: string;
    iconStatus!: boolean;
    loading!: boolean;
    settingsForm!: FormGroup;
    horizontalPosition: MatSnackBarHorizontalPosition = 'left';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(
        private readonly fb: FormBuilder,
        // private readonly dialogRef: MatDialogRef<FormSettingsComponent>,
        private readonly ipcService: IpcService,
        private readonly snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) readonly terminal: Terminal
    ) {}

    openSnackBar(): void {
        this.snackBar.openFromTemplate(this.template, {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 3000,
        });
    }

    ngOnInit(): void {
        this.settingsForm = this.onFormControl();
    }

    onFormControl(): FormGroup {
        return this.fb.group({
            panelControl: false,
            acceptTerms: [false, [Validators.required]],
        });
    }

    getErrorMessage(field: string): string | undefined {
        switch (field) {
            case 'acceptTerms':
                if (this.settingsForm.get('acceptTerms')?.hasError('required')) return 'Campo requerido';
                return '';
            default:
                return '';
        }
    }

    async onSaveSettings(data: Settings): Promise<void> {
        const { panelControl } = data;
        this.loading = true;
        try {
            const res = await this.ipcService.invoke('s_control_panel', +panelControl);
            if (res.status === 'error') {
                this.iconStatus = false;
                this.alert = res.message;
            }
            if (res.status === 'ok') {
                this.iconStatus = true;
                this.alert = res.message;
                // this.dialogRef.close();
            }
            this.loading = false;
            this.openSnackBar();
        } catch (err: string | any) {
            console.log(err);
            if (err) {
                this.iconStatus = false;
                this.alert = 'Terminal Desconectada';
                this.openSnackBar();
            }
            this.loading = false;
        }
    }
}
