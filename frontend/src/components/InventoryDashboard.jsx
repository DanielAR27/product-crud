import { useState, useEffect } from 'react';
import * as api from '../services/api';
import '../styles/InventoryDashboard.css';

/**
 * Componente Dashboard de Inventario
 * Muestra métricas generales del inventario y alertas
 */
const InventoryDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos del dashboard
  useEffect(() => {
    loadDashboard();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(loadDashboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await api.getInventoryDashboard();
      setDashboard(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !dashboard) {
    return <div className="dashboard-loading">Cargando métricas...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  if (!dashboard) {
    return null;
  }

  return (
    <div className="inventory-dashboard">
      <h2>Dashboard de Inventario</h2>
      
      {/* Alertas críticas */}
      {dashboard.productos_sin_stock > 0 && (
        <div className="alert alert-critical">
          <strong>{dashboard.productos_sin_stock}</strong> 
          {dashboard.productos_sin_stock === 1 ? ' producto' : ' productos'} sin stock
        </div>
      )}
      
      {dashboard.productos_stock_bajo > 0 && (
        <div className="alert alert-warning">
          <strong>{dashboard.productos_stock_bajo}</strong> 
          {dashboard.productos_stock_bajo === 1 ? ' producto' : ' productos'} con stock bajo
        </div>
      )}

      {/* Métricas principales */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon"></div>
          <div className="metric-content">
            <div className="metric-value">{dashboard.total_productos}</div>
            <div className="metric-label">Total Productos</div>
          </div>
        </div>

        <div className="metric-card ok">
          <div className="metric-icon"></div>
          <div className="metric-content">
            <div className="metric-value">{dashboard.productos_stock_ok}</div>
            <div className="metric-label">Stock OK</div>
            <div className="metric-percentage">{dashboard.porcentaje_stock_ok}%</div>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon"></div>
          <div className="metric-content">
            <div className="metric-value">{dashboard.productos_stock_bajo}</div>
            <div className="metric-label">Stock Bajo</div>
            <div className="metric-percentage">{dashboard.porcentaje_stock_bajo}%</div>
          </div>
        </div>

        <div className="metric-card critical">
          <div className="metric-icon"></div>
          <div className="metric-content">
            <div className="metric-value">{dashboard.productos_sin_stock}</div>
            <div className="metric-label">Sin Stock</div>
            <div className="metric-percentage">{dashboard.porcentaje_sin_stock}%</div>
          </div>
        </div>
      </div>

      {/* Métricas secundarias */}
      <div className="secondary-metrics">
        <div className="metric-row">
          <span className="metric-row-label">Total Unidades:</span>
          <span className="metric-row-value">{Number(dashboard.total_unidades_inventario || 0).toLocaleString()}</span>
        </div>
        
        <div className="metric-row">
          <span className="metric-row-label">Valor Total Inventario:</span>
          <span className="metric-row-value value-highlight">
            ${Number(dashboard.valor_total_inventario || 0).toFixed(2)}
          </span>
        </div>
        
        <div className="metric-row">
          <span className="metric-row-label">Promedio Stock:</span>
          <span className="metric-row-value">{Number(dashboard.promedio_stock || 0).toFixed(1)}</span>
        </div>
        
        <div className="metric-row">
          <span className="metric-row-label">Rango Stock:</span>
          <span className="metric-row-value">
            Min: {dashboard.stock_minimo_actual} | Max: {dashboard.stock_maximo_actual}
          </span>
        </div>
      </div>

      {/* Indicador de salud del inventario */}
      <div className="inventory-health">
        <div className="health-label">Salud del Inventario:</div>
        <div className="health-bar">
          <div 
            className="health-bar-fill ok"
            style={{ width: `${dashboard.porcentaje_stock_ok}%` }}
          />
          <div 
            className="health-bar-fill warning"
            style={{ width: `${dashboard.porcentaje_stock_bajo}%` }}
          />
          <div 
            className="health-bar-fill critical"
            style={{ width: `${dashboard.porcentaje_sin_stock}%` }}
          />
        </div>
        <div className="health-legend">
          <span className="legend-item ok">OK ({dashboard.porcentaje_stock_ok}%)</span>
          <span className="legend-item warning">Bajo ({dashboard.porcentaje_stock_bajo}%)</span>
          <span className="legend-item critical">Sin ({dashboard.porcentaje_sin_stock}%)</span>
        </div>
      </div>

      <button className="btn-refresh" onClick={loadDashboard} disabled={loading}>
        {loading ? 'Actualizando...' : 'Actualizar'}
      </button>
    </div>
  );
};

export default InventoryDashboard;