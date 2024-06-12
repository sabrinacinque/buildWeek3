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
  menu: iMenu[] = [];
  filteredMenu: iMenu[] = [];
  selectedMenuItem: iMenu | null = null;
  editMode: { [key: number]: boolean } = {};
  searchCategory: string = '';
  newProduct: Partial<iMenu> = {};
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

  @ViewChild('createProductModal') createProductModal!: TemplateRef<any>;

  constructor(private menuSvc: MenuService, private modalService: NgbModal) {}

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
  }

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

  toggleEditMode(id: number) {
    this.editMode[id] = !this.editMode[id];
    if (!this.editMode[id]) {
      const item = this.menu.find((menuItem) => menuItem.id === id);
      if (item) {
        this.update(item);
      }
    }
  }

  openCreateModal(content: TemplateRef<any>) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  filterPosts(event: any) {
    const searchValue = event.target.value.toLowerCase();
    this.filteredMenu = this.menu.filter(
      (post) =>
        post.categoria.toLowerCase().includes(searchValue) ||
        post.titolo.toLowerCase().includes(searchValue)
    );
  }
}
