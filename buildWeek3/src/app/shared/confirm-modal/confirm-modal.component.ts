// confirm-modal.component.ts - SEMPLICE
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Conferma';
  @Input() message: string = '';
  @Input() confirmText: string = 'Conferma';
  @Input() cancelText: string = 'Annulla';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onBackdropClick(): void {
    this.onCancel();
  }
}
