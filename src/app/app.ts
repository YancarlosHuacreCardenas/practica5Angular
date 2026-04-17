import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerList } from './customer-list/customer-list';
import { SupplierList } from './suppliers/supplier-list';
import { SidebarComponent } from './sidebar/sidebar';
import { ProductList } from './product-list/product-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CustomerList, SupplierList, SidebarComponent, ProductList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  activeMenu = 'trabajadores';

  onMenuSelected(menuId: string) {
    this.activeMenu = menuId;
  }
}