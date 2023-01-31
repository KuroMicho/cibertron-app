import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Credentials } from '../../types/app.types';

@Component({
    selector: 'app-form-machine',
    templateUrl: './form-machine.component.html',
    styleUrls: ['./form-machine.component.scss'],
})
export class FormMachineComponent implements OnInit {
    machineForm!: FormGroup;
    loading!: boolean;

    constructor(
        private readonly fb: FormBuilder,
        private readonly dialogRef: MatDialogRef<FormMachineComponent> // @Inject(MAT_DIALOG_DATA) private readonly data: Credentials
    ) {}

    ngOnInit(): void {
        this.machineForm = this.onFormControl();
    }

    getErrorMessage(field: string): string | undefined {
        switch (field) {
            case 'name':
                if (this.machineForm.get('name')?.hasError('required')) return 'Campo requerido';
                return '';
            case 'ip':
                if (this.machineForm.get('ip')?.hasError('required')) return 'Campo requerido';
                if (this.machineForm.get('ip')?.hasError('pattern')) return 'IP invalida';
                return '';
            case 'password':
                if (this.machineForm.get('password')?.hasError('required')) return 'Campo requerido';
                return '';
            default:
                return '';
        }
    }

    onSubmit(data: Credentials): void {
        try {
            this.loading = true;
            const { ip, name } = data;
            this.dialogRef.close({ ip, name });
            this.clearForm();
        } catch (error) {
            console.error(error);
            this.loading = false;
        }
    }

    onFormControl(): FormGroup {
        return this.fb.group({
            name: ['', [Validators.required]],
            ip: ['', [Validators.required, Validators.pattern(/^(?:\d{1,3}\.){3}\d{1,3}$/)]],
            password: ['', [Validators.required]],
        });
    }

    clearForm(): void {
        this.machineForm.get('name')?.reset();
        this.machineForm.get('ip')?.reset();
        this.machineForm.get('password')?.reset();
    }
}
