-- ============================================================================
-- MIGRACIÓN: Agregar campo stock_minimo a la tabla products
-- Proyecto: product-crud
-- Base de Datos: PostgreSQL
-- Fecha: 2025-10-29
-- ============================================================================

-- Descripción:
-- Esta migración agrega el campo 'stock_minimo' a la tabla products existente
-- para implementar el sistema de control de inventario y alertas de stock bajo

-- ============================================================================
-- PASO 1: Agregar columna stock_minimo
-- ============================================================================

ALTER TABLE products
ADD COLUMN stock_minimo INTEGER DEFAULT 5 NOT NULL;

-- Agregar constraint para validar que stock_minimo no sea negativo
ALTER TABLE products
ADD CONSTRAINT chk_stock_minimo CHECK (stock_minimo >= 0);

-- ============================================================================
-- PASO 2: Actualizar productos existentes (opcional)
-- ============================================================================

-- Establecer stock_minimo basado en el stock actual (estrategia conservadora)
-- Si el producto tiene mucho stock, usar 10% del stock actual como mínimo
-- Si tiene poco stock, usar valor por defecto de 5

UPDATE products
SET stock_minimo = CASE
  WHEN stock >= 100 THEN FLOOR(stock * 0.1)  -- 10% del stock para productos con mucho inventario
  WHEN stock >= 50 THEN FLOOR(stock * 0.15)  -- 15% para stock moderado
  WHEN stock >= 20 THEN 5                     -- Valor estándar para stock bajo
  ELSE 3                                       -- Mínimo absoluto para productos con muy poco stock
END
WHERE stock_minimo = 5;  -- Solo actualizar los que tienen el valor por defecto

-- ============================================================================
-- PASO 3: Crear índice para mejorar performance de consultas
-- ============================================================================

-- Índice para consultas de productos con stock bajo
CREATE INDEX idx_products_stock_bajo ON products (stock, stock_minimo)
WHERE stock < stock_minimo;

-- Índice para consultas generales de stock
CREATE INDEX idx_products_stock ON products (stock);

-- ============================================================================
-- PASO 4: Verificar migración
-- ============================================================================

-- Verificar estructura de la tabla
\d products;

-- Verificar algunos registros
SELECT id, name, stock, stock_minimo,
       CASE 
         WHEN stock < stock_minimo THEN '⚠ BAJO'
         WHEN stock = 0 THEN '❌ SIN STOCK'
         ELSE '✓ OK'
       END as estado
FROM products
LIMIT 10;

-- Contar productos por estado de stock
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN stock = 0 THEN 1 END) as sin_stock,
  COUNT(CASE WHEN stock < stock_minimo AND stock > 0 THEN 1 END) as stock_bajo,
  COUNT(CASE WHEN stock >= stock_minimo THEN 1 END) as stock_ok
FROM products;

-- ============================================================================
-- ROLLBACK (si es necesario deshacer la migración)
-- ============================================================================

/*
-- Para revertir los cambios:

-- Eliminar índices
DROP INDEX IF EXISTS idx_products_stock_bajo;
DROP INDEX IF EXISTS idx_products_stock;

-- Eliminar columna
ALTER TABLE products DROP COLUMN IF EXISTS stock_minimo;

-- Nota: Esto eliminará permanentemente la columna y sus datos
*/

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================

/*
1. Hacer backup de la base de datos antes de ejecutar:
   pg_dump -U postgres -d products_db > backup_before_migration.sql

2. Ejecutar esta migración:
   psql -U postgres -d products_db -f migration_add_stock_minimo.sql

3. Si usas Docker:
   docker exec -i postgres_container psql -U postgres -d products_db < migration_add_stock_minimo.sql

4. Verificar que la aplicación backend tiene los cambios necesarios en:
   - models/productModel.js
   - controllers/productController.js
   - routes/productRoutes.js

5. La columna stock_minimo tiene valor por defecto de 5, por lo que:
   - Productos existentes obtendrán automáticamente stock_minimo = 5
   - Nuevos productos usarán 5 si no se especifica otro valor

6. Los índices mejorarán el performance de:
   - Consultas de productos con stock bajo
   - Filtros por nivel de stock
   - Dashboard de inventario
*/
