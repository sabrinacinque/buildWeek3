import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { iMenu } from '../../Models/i-menu';
import { MenuService } from '../../menu.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // Array che contiene tutti gli elementi del menu
  menu: iMenu[] = [];
  // Array per gli elementi del menu filtrati in base alla ricerca o alla categoria
  filteredMenu: iMenu[] = [];
  // Elemento del menu selezionato per la visualizzazione o modifica dettagliata
  selectedMenuItem: iMenu | null = null;
  // Oggetto per tenere traccia dello stato di modifica di ogni elemento del menu
  editMode: { [key: number]: boolean } = {};
  // 🆕 NUOVO: Filtri separati
  searchText: string = '';
  searchCategory: string = '';
  // Struttura dati per un nuovo prodotto da aggiungere al menu
  newProduct: Partial<iMenu> = {};
  // Array delle categorie disponibili per gli elementi del menu
  categories: string[] = [
    'Antipasti',
    'Zuppe',
    'Primi',
    'Hosomaki',
    'Uramaki',
    'Temaki',
    'Sushi',
    'Secondi',
    'Dolci',
    'Bibite',
  ];
  // Riferimento al modal per la creazione di un nuovo prodotto
  @ViewChild('createProductModal') createProductModal!: TemplateRef<any>;

  constructor(private menuSvc: MenuService, private modalService: NgbModal) {}

  ngOnInit() {
    this.getAll();
  }

  // Recupera tutti gli elementi del menu dal server
  getAll() {
    this.menuSvc.getAll().subscribe((data: iMenu[]) => {
      // 🔧 SISTEMATO: Ordina sempre per ID crescente
      this.menu = data.sort((a, b) => a.id - b.id);
      this.filteredMenu = [...this.menu]; // Copia ordinata
    });
  }

  // Recupera un elemento del menu per ID
  getById(id: number) {
    this.menuSvc.getById(id).subscribe((data: iMenu) => {
      this.selectedMenuItem = data;
    });
  }



  // 🔧 SISTEMATO: Aggiorna un elemento del menu mantenendo ordine
  update(item: iMenu) {
    this.menuSvc.update(item).subscribe(() => {
      const index = this.menu.findIndex((menuItem) => menuItem.id === item.id);
      if (index !== -1) {
        // 🔧 AGGIORNA l'item esistente nella sua posizione
        this.menu[index] = { ...item };
        this.editMode[item.id] = false;
        // 🔧 RIAPPLICA filtri mantenendo ordine
        this.applyFilters();
        Swal.fire({
          icon: 'success',
          title: 'Successo',
          text: 'Prodotto modificato con successo!',
        });
      }
    });
  }

  // Elimina un elemento del menu
  delete(id: number) {
    Swal.fire({
      title: 'Sei sicuro?',
      text: 'Non potrai annullare questa azione!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sì, cancellalo!',
      cancelButtonText: 'Annulla',
    }).then((result) => {
      if (result.isConfirmed) {
        this.menuSvc.delete(id).subscribe(() => {
          this.menu = this.menu.filter((item) => item.id !== id);
          this.applyFilters(); // Usa applyFilters invece di copiare
          Swal.fire('Cancellato!', "L'elemento è stato cancellato.", 'success');
        });
      }
    });
  }

  // Attiva o disattiva la modalità di modifica per un elemento del menu
  toggleEditMode(id: number) {
    this.editMode[id] = !this.editMode[id];
    if (!this.editMode[id]) {
      const item = this.menu.find((menuItem) => menuItem.id === id);
      if (item) {
        this.update(item);
      }
    }
  }

  // Apre il modal per la creazione di un nuovo prodotto
  openCreateModal(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  // 🔧 SISTEMATO: Filtro per testo
  filterByText(event: any) {
    this.searchText = event.target.value.toLowerCase();
    this.applyFilters();
  }

  // 🆕 NUOVO: Filtro per categoria
  filterByCategory(event: any) {
    this.searchCategory = event.target.value;
    this.applyFilters();
  }

  // 🆕 NUOVO: Applica entrambi i filtri
  applyFilters() {
    this.filteredMenu = this.menu.filter((item) => {
      const matchText = !this.searchText ||
        item.titolo.toLowerCase().includes(this.searchText) ||
        item.ingredienti.toLowerCase().includes(this.searchText);

      const matchCategory = !this.searchCategory ||
        item.categoria === this.searchCategory;

      return matchText && matchCategory;
    });
  }

  // 🆕 NUOVO: Reset filtri
  resetFilters() {
    this.searchText = '';
    this.searchCategory = '';
    this.filteredMenu = [...this.menu];
  }

  
  // Aggiungi questo metodo nel dashboard.component.ts
onImageSelect(event: any, item: iMenu) {
  const file = event.target.files[0];
  if (file) {
    // Per ora salva solo il nome del file
    // In futuro potresti implementare l'upload su server
    item.img = file.name;
    
    // Opzionale: Preview dell'immagine
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // Potresti salvare il base64 per preview
      console.log('Image loaded:', e.target.result);
    };
    reader.readAsDataURL(file);
  }
}


// Aggiungi queste proprietà
imagePreview: string | null = null;

// Metodo per gestire l'upload dell'immagine nel modal
onModalImageSelect(event: any) {
  const file = event.target.files[0];
  if (file) {
    // Validazione file
    if (file.size > 5 * 1024 * 1024) { // 5MB max
      alert('File troppo grande! Massimo 5MB');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      alert('Seleziona solo file immagine!');
      return;
    }
    
    // Salva il nome del file nel newProduct
    this.newProduct.img = file.name;
    
    // Crea preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Modifica il metodo createProduct per resettare la preview
createProduct(modal: any) {
  this.menuSvc.create(this.newProduct).subscribe((data: iMenu) => {
    this.menu.push(data);
    this.menu.sort((a, b) => a.id - b.id);
    this.applyFilters();
    Swal.fire({
      icon: 'success',
      title: 'Successo',
      text: 'Prodotto creato con successo!',
    });
    modal.close();
    this.newProduct = {}; // Reset form
    this.imagePreview = null; // Reset preview
  });
}
}
