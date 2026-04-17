export interface Product {
  idProducto: number;
  nombreProducto: string;
  idCategoria: number;
  precio: number;
  unidadMedida: string;
  idProveedor: number;
  stockDisponible: number;
  estado: string; // 'Activo' | 'Inactivo'
}