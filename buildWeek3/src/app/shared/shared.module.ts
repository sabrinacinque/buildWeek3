import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardComponent } from './card/card.component';
import { StoricoOrdiniComponent } from './storico-ordini/storico-ordini.component';
import { ContoFinaleModalComponent } from './conto-finale-modal/conto-finale-modal.component';




@NgModule({
  declarations: [
    CardComponent,
    StoricoOrdiniComponent,
    ContoFinaleModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CardComponent,
    ContoFinaleModalComponent  
  ]
})
export class SharedModule { }
