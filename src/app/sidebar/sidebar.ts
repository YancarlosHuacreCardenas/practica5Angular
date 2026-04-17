import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  activeMenu = 'trabajadores';
  @Output() menuSelected = new EventEmitter<string>();

  menuItems = [
    { id: 'panel', label: 'Panel General', icon: 'fa-chart-line' },
    { id: 'siembras', label: 'Siembras', icon: 'fa-leaf' },
    { id: 'parcelas', label: 'Parcelas', icon: 'fa-map' },
    { id: 'cultivos', label: 'Cultivos', icon: 'fa-wheat' },
    { id: 'calendario', label: 'Calendario', icon: 'fa-calendar-alt' },
    { id: 'reportes', label: 'Reportes', icon: 'fa-file-chart-line' },
    { id: 'trabajadores', label: 'Trabajadores', icon: 'fa-users' },
    { id: 'productos', label: 'Productos', icon: 'fa-box' },
    { id: 'proveedores', label: 'Proveedores', icon: 'fa-truck' },
    { id: 'alertas', label: 'Alertas', icon: 'fa-bell' }
  ];

  selectMenu(menuId: string) {
    this.activeMenu = menuId;
    this.menuSelected.emit(menuId);
  }
}
