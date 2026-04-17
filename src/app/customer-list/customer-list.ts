import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../models/customer.model';
import { CustomerService } from '../services/customer.service';
import { CustomerForm } from '../customers/customer-form/customer-form';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomerForm],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
})
export class CustomerList implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm = '';
  filterStatus: 'todos' | 'activos' | 'inactivos' = 'todos';

  showForm = false;
  selectedCustomer: Customer | null = null;

  activeCount = 0;
  inactiveCount = 0;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.subscribeToCustomerChanges();
  }

  subscribeToCustomerChanges(): void {
    this.customerService.getCustomers().subscribe((customers) => {
      this.customers = customers;
      this.applyFilters();
      this.updateCounts();
    });
  }

  updateCounts(): void {
    this.activeCount = this.customerService.getActiveCustomers().length;
    this.inactiveCount = this.customerService.getInactiveCustomers().length;
  }

  applyFilters(): void {
    let filtered = this.customers;

    if (this.filterStatus === 'activos') {
      filtered = filtered.filter((c) => c.status === 'ACTIVO');
    } else if (this.filterStatus === 'inactivos') {
      filtered = filtered.filter((c) => c.status === 'INACTIVO');
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.nameCustomer.toLowerCase().includes(term) ||
          c.lastnameCustomer.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.documentNumber.toLowerCase().includes(term) ||
          c.phone.toLowerCase().includes(term)
      );
    }

    this.filteredCustomers = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(status: 'todos' | 'activos' | 'inactivos'): void {
    this.filterStatus = status;
    this.applyFilters();
  }

  openNewCustomerForm(): void {
    this.selectedCustomer = null;
    this.showForm = true;
  }

  editCustomer(customer: Customer): void {
    this.selectedCustomer = { ...customer };
    this.showForm = true;
  }

  onFormClose(): void {
    this.showForm = false;
    this.selectedCustomer = null;
  }

  onFormSave(customerData: Customer): void {
    if (this.selectedCustomer && this.selectedCustomer.idCustomer) {
      this.customerService.updateCustomer(
        this.selectedCustomer.idCustomer,
        customerData
      ).subscribe({
        next: () => {
          this.onFormClose();
        },
        error: (error) => {
          console.error('Error updating customer:', error);
          alert('Error al actualizar el cliente');
        }
      });
    } else {
      this.customerService.addCustomer(customerData).subscribe({
        next: () => {
          this.onFormClose();
        },
        error: (error) => {
          console.error('Error adding customer:', error);
          alert('Error al crear el cliente');
        }
      });
    }
  }

  deleteCustomer(customerId: number): void {
    if (
      confirm(
        'Estas seguro de que deseas eliminar este cliente? Sera marcado como inactivo.'
      )
    ) {
      this.customerService.deleteCustomer(customerId).subscribe({
        next: () => {},
        error: (error) => {
          console.error('Error deleting customer:', error);
          alert('Error al eliminar el cliente');
        }
      });
    }
  }

  restoreCustomer(customerId: number): void {
    if (confirm('Estas seguro de que deseas restaurar este cliente?')) {
      this.customerService.restoreCustomer(customerId).subscribe({
        next: () => {},
        error: (error) => {
          console.error('Error restoring customer:', error);
          alert('Error al restaurar el cliente');
        }
      });
    }
  }
}