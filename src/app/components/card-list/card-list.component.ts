import { Component, EventEmitter, Input, Output } from '@angular/core';

interface Terminal {
    id: number;
    name: string;
    ip: string;
    status: boolean;
    timer: string;
}

@Component({
    selector: 'app-card-list',
    templateUrl: './card-list.component.html',
    styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent {
    @Input() terminals: Terminal[];
    @Output() terminalId: EventEmitter<number> = new EventEmitter<number>();

    sendTerminal(id: number): void {
        this.terminalId.emit(id);
    }
}
