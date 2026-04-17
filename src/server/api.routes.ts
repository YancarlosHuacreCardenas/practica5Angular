import { Router, Request, Response } from 'express';
import sql from 'mssql';
import { pool } from './db.config';

const router = Router();

// ==================== SUPPLIERS ====================

// GET todos los proveedores
router.get('/suppliers', async (req: Request, res: Response) => {
  try {
    const request = pool.request();
    const result = await request.query('SELECT * FROM Supplier');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener suppliers:', error);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

// GET proveedor por ID
router.get('/suppliers/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const request = pool.request();
    const id = parseInt(req.params['id'] as string);
    request.input('id', sql.Int, id);
    const result = await request.query('SELECT * FROM Supplier WHERE id_supplier = @id');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'Proveedor no encontrado' });
      return;
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error('Error al obtener proveedor:', error);
    res.status(500).json({ error: 'Error al obtener proveedor' });
  }
});

// POST nuevo proveedor
router.post('/suppliers', async (req: Request, res: Response) => {
  try {
    const { name, ruc, phone, address, tipo, status, company_name, contact_name, email } = req.body;

    const request = pool.request();
    request.input('name', sql.VarChar, name);
    request.input('ruc', sql.Char, ruc);
    request.input('phone', sql.Char, phone);
    request.input('address', sql.VarChar, address);
    request.input('tipo', sql.VarChar, tipo);
    request.input('status', sql.VarChar, status);
    request.input('company_name', sql.VarChar, company_name);
    request.input('contact_name', sql.VarChar, contact_name);
    request.input('email', sql.VarChar, email);

    const result = await request.query(`
      INSERT INTO Supplier (name, ruc, phone, address, tipo, status, company_name, contact_name, email)
      VALUES (@name, @ruc, @phone, @address, @tipo, @status, @company_name, @contact_name, @email);
      SELECT SCOPE_IDENTITY() as id_supplier;
    `);

    res.status(201).json({ id_supplier: result.recordset[0].id_supplier, ...req.body });
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
});

// PUT actualizar proveedor
router.put('/suppliers/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params['id'] as string);
    const { name, ruc, phone, address, tipo, status, company_name, contact_name, email } = req.body;

    const request = pool.request();
    request.input('id', sql.Int, id);
    request.input('name', sql.VarChar, name);
    request.input('ruc', sql.Char, ruc);
    request.input('phone', sql.Char, phone);
    request.input('address', sql.VarChar, address);
    request.input('tipo', sql.VarChar, tipo);
    request.input('status', sql.VarChar, status);
    request.input('company_name', sql.VarChar, company_name);
    request.input('contact_name', sql.VarChar, contact_name);
    request.input('email', sql.VarChar, email);

    await request.query(`
      UPDATE Supplier
      SET name = @name, ruc = @ruc, phone = @phone, address = @address,
          tipo = @tipo, status = @status, company_name = @company_name,
          contact_name = @contact_name, email = @email
      WHERE id_supplier = @id
    `);

    res.json({ id_supplier: id, ...req.body });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ error: 'Error al actualizar proveedor' });
  }
});

// DELETE proveedor
router.delete('/suppliers/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params['id'] as string);
    const request = pool.request();
    request.input('id', sql.Int, id);

    await request.query('DELETE FROM Supplier WHERE id_supplier = @id');

    res.json({ message: 'Proveedor eliminado' });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
});

// ==================== HEALTH CHECK ====================

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', database: 'Conectado a AgroPacayales' });
});

export default router;
