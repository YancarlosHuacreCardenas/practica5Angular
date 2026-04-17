import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Supplier } from '../models/supplier.model';
import { SupplierService } from '../services/supplier.service';
import { SupplierForm } from '../suppliers/supplier-form/supplier-form';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, FormsModule, SupplierForm],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css',
})
export class SupplierList implements OnInit {
  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  searchTerm = '';
  filterStatus: 'todos' | 'activos' | 'inactivos' = 'todos';

  showForm = false;
  selectedSupplier: Supplier | null = null;

  activeCount = 0;
  inactiveCount = 0;

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.loadSuppliers();
    this.subscribeToSupplierChanges();
  }

  subscribeToSupplierChanges(): void {
    this.supplierService.getSuppliers().subscribe((suppliers) => {
      this.suppliers = suppliers;
      this.applyFilters();
      this.updateCounts();
    });
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe((suppliers) => {
      this.suppliers = suppliers;
      this.applyFilters();
      this.updateCounts();
    });
  }

  updateCounts(): void {
    this.activeCount = this.supplierService.getActiveSuppliers().length;
    this.inactiveCount = this.supplierService.getInactiveSuppliers().length;
  }

  applyFilters(): void {
    let filtered = this.suppliers;

    // Filtrar por estado
    if (this.filterStatus === 'activos') {
      filtered = filtered.filter((s) => s.status === 'Activo');
    } else if (this.filterStatus === 'inactivos') {
      filtered = filtered.filter((s) => s.status === 'Inactivo');
    }

    // Filtrar por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.company_name.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term) ||
          s.phone.toLowerCase().includes(term) ||
          s.ruc.toLowerCase().includes(term)
      );
    }

    this.filteredSuppliers = filtered;
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(status: 'todos' | 'activos' | 'inactivos'): void {
    this.filterStatus = status;
    this.applyFilters();
  }

  openNewSupplierForm(): void {
    this.selectedSupplier = null;
    this.showForm = true;
  }

  editSupplier(supplier: Supplier): void {
    this.selectedSupplier = supplier;
    this.showForm = true;
  }

  onFormClose(): void {
    this.showForm = false;
    this.selectedSupplier = null;
  }

  onFormSave(supplierData: Omit<Supplier, 'id_supplier'>): void {
    if (this.selectedSupplier) {
      // Actualizar proveedor existente
      this.supplierService.updateSupplier(
        this.selectedSupplier.id_supplier,
        supplierData
      ).subscribe({
        next: () => {
          this.onFormClose();
        },
        error: (error) => {
          console.error('Error updating supplier:', error);
          alert('Error al actualizar el proveedor');
        }
      });
    } else {
      // Crear nuevo proveedor
      this.supplierService.addSupplier(supplierData).subscribe({
        next: () => {
          this.onFormClose();
        },
        error: (error) => {
          console.error('Error adding supplier:', error);
          alert('Error al crear el proveedor');
        }
      });
    }
  }

  deleteSupplier(supplierId: number): void {
    if (
      confirm(
        '¿Estás seguro de que deseas eliminar este proveedor? Será marcado como inactivo.'
      )
    ) {
      this.supplierService.deleteSupplier(supplierId).subscribe({
        next: () => {},
        error: (error) => {
          console.error('Error deleting supplier:', error);
          alert('Error al eliminar el proveedor');
        }
      });
    }
  }

  restoreSupplier(supplierId: number): void {
    if (confirm('¿Estás seguro de que deseas restaurar este proveedor?')) {
      this.supplierService.restoreSupplier(supplierId).subscribe({
        next: () => {},
        error: (error) => {
          console.error('Error restoring supplier:', error);
          alert('Error al restaurar el proveedor');
        }
      });
    }
  }
}
