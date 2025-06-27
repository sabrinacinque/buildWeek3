import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardComponent } from './card/card.component';
import { StoricoOrdiniComponent } from './storico-ordini/storico-ordini.component';
import { ContoFinaleModalComponent } from './conto-finale-modal/conto-finale-modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';




@NgModule({
  declarations: [
    CardComponent,
    StoricoOrdiniComponent,
    ContoFinaleModalComponent,
    ConfirmModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CardComponent,
    ContoFinaleModalComponent,
    ConfirmModalComponent
  ]
})
export class SharedModule { }
