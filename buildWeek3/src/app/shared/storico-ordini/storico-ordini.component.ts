// storico-ordini.component.ts
import { Component, OnInit } from '@angular/core';
import { TavoloService, OrdineStorico, TavoloState } from '../../tavolo-service.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-storico-ordini',
  templateUrl: './storico-ordini.component.html',
  styleUrls: ['./storico-ordini.component.scss']
})
export class StoricoOrdiniComponent implements OnInit {

  tavoloState$: Observable<TavoloState>;
  riepilogoCategorie: { [categoria: string]: { quantita: number, totale: number } } = {};

  constructor(public tavoloService: TavoloService) {
    this.tavoloState$ = this.tavoloService.getTavoloState();
  }

  ngOnInit(): void {
    // Calcola riepilogo per categoria
    this.riepilogoCategorie = this.tavoloService.getRiepilogoPerCategoria();
  }

  // Metodi helper per il template
  formatTime(timestamp: Date): string {
    return this.tavoloService.formatOrderTime(timestamp);
  }

  // Ottieni emoji per categoria
  getCategoryEmoji(categoria: string): string {
    const emojiMap: { [key: string]: string } = {
      'Antipasti': '🥟',
      'Zuppe': '🍜',
      'Primi': '🍝',
      'Hosomaki': '🍣',
      'Uramaki': '🍱',
      'Temaki': '🍙',
      'Sushi': '🍚',
      'Secondi': '🐟',
      'Dolci': '🍡',
      'Bibite': '🍵'
    };
    return emojiMap[categoria] || '🍽️';
  }

  // Ottieni il colore per categoria
  getCategoryColor(categoria: string): string {
    const colorMap: { [key: string]: string } = {
      'Antipasti': '#ff6b6b',
      'Zuppe': '#4ecdc4',
      'Primi': '#45b7d1',
      'Hosomaki': '#96ceb4',
      'Uramaki': '#feca57',
      'Temaki': '#ff9ff3',
      'Sushi': '#54a0ff',
      'Secondi': '#5f27cd',
      'Dolci': '#f0932b',
      'Bibite': '#eb4d4b'
    };
    return colorMap[categoria] || '#d4af37';
  }

  // Metodo per andare al conto
  richiediConto(): void {
    this.tavoloService.richiediConto();
  }

  // TrackBy per performance delle liste
  trackByOrderId(index: number, ordine: OrdineStorico): string {
    return ordine.id;
  }
}
