import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material.module';
import { FormMachineComponent } from './components/form-machine/form-machine.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CardListComponent } from './components/card-list/card-list.component';
import { CardComponent } from './components/card/card.component';
import { FormSettingsComponent } from './components/form-settings/form-settings.component';

@NgModule({
    declarations: [AppComponent, FormMachineComponent, ToolbarComponent, CardListComponent, CardComponent, FormSettingsComponent],
    imports: [BrowserModule, BrowserAnimationsModule, MaterialModule, ReactiveFormsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
