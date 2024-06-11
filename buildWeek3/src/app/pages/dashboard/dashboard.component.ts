import { Component, OnInit } from '@angular/core';
import { iMenu } from '../../Models/i-menu';
import { MenuService } from '../../menu.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  menu: iMenu[] = [];
  filteredMenu: iMenu[] = [];
  selectedMenuItem: iMenu | null = null;
  editMode: { [key: number]: boolean } = {};
  searchCategory: string = '';
  newProduct: Partial<iMenu> = {};
  categories: string[] = ['Antipasti', 'Zuppe', 'Primi', 'Hosomaki', 'Uramaki', 'Temaki', 'Sushi', 'Secondi', 'Dolci', 'Bibite'];

  constructor(private menuSvc: MenuService) {}

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.menuSvc.getAll().subscribe((data: iMenu[]) => {
      this.menu = data;
      this.filteredMenu = data;
    });
  }

  getById(id: number) {
    this.menuSvc.getById(id).subscribe((data: iMenu) => {
      this.selectedMenuItem = data;
    });
  }

  createProduct() {
    this.menuSvc.create(this.newProduct).subscribe((data: iMenu) => {
      this.menu.push(data);
      this.filteredMenu = this.menu;
      Swal.fire({
        icon: 'success',
        title: 'Successo',
        text: 'Prodotto creato con successo!',
      });
      // Chiudi il modale
      const modal = document.getElementById('createProductModal') as HTMLElement;
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      // Reset the newProduct object
      this.newProduct = {};
    });
  }

  update(item: iMenu) {
    this.menuSvc.update(item).subscribe(() => {
      const index = this.menu.findIndex(menuItem => menuItem.id === item.id);
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

  delete(id: number) {
    Swal.fire({
      title: 'Sei sicuro?',
      text: "Non potrai annullare questa azione!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sì, cancellalo!',
      cancelButtonText: 'Annulla'
    }).then((result) => {
      if (result.isConfirmed) {
        this.menuSvc.delete(id).subscribe(() => {
          this.menu = this.menu.filter(item => item.id !== id);
          this.filteredMenu = this.menu;
          Swal.fire(
            'Cancellato!',
            'L\'elemento è stato cancellato.',
            'success'
          );
        });
      }
    });
  }

  toggleEditMode(id: number) {
    this.editMode[id] = !this.editMode[id];
    if (!this.editMode[id]) {
      const item = this.menu.find(menuItem => menuItem.id === id);
      if (item) {
        this.update(item);
      }
    }
  }

  filterByCategory() {
    if (this.searchCategory.trim()) {
      this.filteredMenu = this.menu.filter(item => item.categoria.toLowerCase().includes(this.searchCategory.trim().toLowerCase()));
    } else {
      this.filteredMenu = this.menu;
    }
  }

  openCreateModal() {
    const modal = new bootstrap.Modal(document.getElementById('createProductModal') as HTMLElement);
    modal.show();
  }
}
