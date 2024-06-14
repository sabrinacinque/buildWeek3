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
  // Categoria attualmente selezionata per il filtro
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
      this.menu = data;
      this.filteredMenu = data;
    });
  }
  // Recupera un elemento del menu per ID
  getById(id: number) {
    this.menuSvc.getById(id).subscribe((data: iMenu) => {
      this.selectedMenuItem = data;
    });
  }
  // Crea un nuovo prodotto nel menu
  createProduct(modal: any) {
    this.menuSvc.create(this.newProduct).subscribe((data: iMenu) => {
      this.menu.push(data);
      this.filteredMenu = this.menu;
      Swal.fire({
        icon: 'success',
        title: 'Successo',
        text: 'Prodotto creato con successo!',
      });
      modal.close();
      this.newProduct = {};
    });
  } // Aggiorna un elemento del menu esistente

  update(item: iMenu) {
    this.menuSvc.update(item).subscribe(() => {
      const index = this.menu.findIndex((menuItem) => menuItem.id === item.id);
      if (index !== -1) {
        this.menu[index] = item;
        this.editMode[item.id] = false;
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
          this.filteredMenu = this.menu;
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
  // Filtra gli elementi del menu in base alla categoria o al titolo
  filterPosts(event: any) {
    const searchValue = event.target.value.toLowerCase();
    this.filteredMenu = this.menu.filter(
      (post) =>
        post.categoria.toLowerCase().includes(searchValue) ||
        post.titolo.toLowerCase().includes(searchValue)
    );
  }
}
