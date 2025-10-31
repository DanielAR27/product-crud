# -*- coding: utf-8 -*-
"""
CONFIGURACIÓN DE SELECTORES - VALORES REALES DEL PROYECTO
Basado en la inspección del DOM realizada en la aplicación
"""

# ============================================================================
# URL Base
# ============================================================================

BASE_URL = "http://localhost:5173"

# ============================================================================
# SELECTORES DE FORMULARIO (Confirmados)
# ============================================================================

FORM_SELECTORS = {
    # Inputs del formulario - USAR By.ID
    'name_input': 'nombre',              # <input id="nombre" name="nombre" />
    'description_input': 'descripcion',  # NOTA: Falta confirmar si existe campo descripción
    'price_input': 'precio',             # <input id="precio" name="precio" type="number" />
    'stock_input': 'stock',              # <input id="stock" name="stock" type="number" />
    'stock_minimo_input': 'stock_minimo', # <input id="stock_minimo" name="stock_minimo" />
    
    # Botones - USAR By.ID o By.CLASS_NAME
    'new_button': 'btnNuevo',            # <button id="btnNuevo" class="btn-new">
    'save_button': 'btnGuardar',         # <button id="btnGuardar" class="btn-save"> (modo crear)
    'update_button': 'btnActualizar',    # <button id="btnActualizar" class="btn-save"> (modo editar)
    'cancel_button': 'btn-cancel',       # Por clase (sin ID)
}

# ============================================================================
# SELECTORES DE LISTA DE PRODUCTOS (Confirmados)
# ============================================================================

LIST_SELECTORS = {
    # Contenedor de productos
    'products_container': 'product-list',  # Clase del contenedor
    
    # Item individual de producto - CONFIRMADO
    'product_item': 'product-item',        # <div class="product-item ok-stock">
    
    # Dentro de cada producto
    'product_name': 'h3',                  # <h3> dentro del item (sin clase)
    'product_price': '.price',             # <span class="price">
    'product_stock': '.stock-value',       # <span class="stock-value">
    
    # Botones de acciones (SIN ID, usar clase)
    'edit_button': 'btn-edit',             # <button class="btn-edit">
    'delete_button': 'btn-delete',         # <button class="btn-delete">
    'adjust_stock_button': 'btn-adjust-stock', 
    
    # Estado de stock (clases CSS en el item)
    'ok_stock_class': 'ok-stock',          # producto.classList.contains('ok-stock')
    'low_stock_class': 'low-stock',        
    'out_of_stock_class': 'out-of-stock',
    
    # Badges de alerta
    'stock_badge_warning': '.stock-badge.warning',
    'stock_badge_critical': '.stock-badge.critical',
}

# ============================================================================
# SELECTORES DE FILTROS Y BÚSQUEDA (Confirmados)
# ============================================================================

FILTER_SELECTORS = {
    # Botón toggle dashboard
    'toggle_dashboard': 'btn-toggle-dashboard',  # <button class="btn-toggle-dashboard">
    
    # Botones de filtro (SIN ID, usar clase y texto)
    'filter_button_class': 'filter-btn',         # <button class="filter-btn">
    'filter_active_class': 'active',             # La clase 'active' indica filtro seleccionado
    
    # Textos de los filtros para identificarlos
    'filter_text_all': 'Todos',
    'filter_text_low_stock': 'Stock Bajo',
    'filter_text_no_stock': 'Sin Stock',
    'filter_text_critical': 'Críticos',
    
    # Búsqueda
    'search_input': 'input[placeholder="Buscar productos..."]',  # Por placeholder
    'search_button': 'btn-search',               # <button class="btn-search">
}

# ============================================================================
# SELECTORES DE DASHBOARD
# ============================================================================

DASHBOARD_SELECTORS = {
    'dashboard_container': 'inventory-dashboard',
    'metric_card': 'metric-card',
    'alert_critical': 'alert-critical',
    'alert_warning': 'alert-warning',
}

# ============================================================================
# MENSAJES Y ALERTAS
# ============================================================================

MESSAGE_SELECTORS = {
    'error_message': '.error-message',
    'loading': '.loading',
    'empty_state': '.empty-state',
}

# ============================================================================
# TIEMPOS DE ESPERA
# ============================================================================

TIMEOUTS = {
    'implicit_wait': 10,      # Espera implícita en segundos
    'page_load': 30,          # Timeout de carga de página
    'element_wait': 10,       # Espera para encontrar elementos
    'short_wait': 2,          # Espera corta entre acciones
}

# ============================================================================
# DATOS DE PRUEBA
# ============================================================================

TEST_DATA = {
    'product_1': {
        'name': 'Laptop HP Test',
        'description': 'Laptop para pruebas automatizadas',  # Si no existe el campo, se omite
        'price': '1500',
        'stock': '50',
        'stock_minimo': '10'
    },
    'product_2': {
        'name': 'Mouse Logitech',
        'description': 'Mouse inalámbrico',
        'price': '250',
        'stock': '3',  # Stock bajo (< stock_minimo)
        'stock_minimo': '10'
    },
    'product_3': {
        'name': 'Teclado Mecánico',
        'description': 'Teclado RGB',
        'price': '800',
        'stock': '0',  # Sin stock
        'stock_minimo': '5'
    }
}

# ============================================================================
# CONFIGURACIÓN DEL NAVEGADOR
# ============================================================================

BROWSER_CONFIG = {
    'browser': 'chrome',  # 'chrome' o 'firefox'
    'headless': False,    # True para ejecutar sin ventana (útil en CI/CD)
    'maximize': True,     # Maximizar ventana
    'screenshot_on_error': True,
}

# ============================================================================
# ESTRATEGIAS DE BÚSQUEDA (Para referencia)
# ============================================================================

"""
CÓMO USAR ESTOS SELECTORES EN SELENIUM:

1. Por ID:
   driver.find_element(By.ID, FORM_SELECTORS['name_input'])
   Ejemplo: driver.find_element(By.ID, 'nombre')

2. Por CLASS_NAME (una sola clase):
   driver.find_element(By.CLASS_NAME, LIST_SELECTORS['product_item'])
   Ejemplo: driver.find_element(By.CLASS_NAME, 'product-item')

3. Por CSS_SELECTOR (para múltiples clases o selectores complejos):
   driver.find_element(By.CSS_SELECTOR, '.product-item.ok-stock')
   driver.find_element(By.CSS_SELECTOR, 'button.btn-edit')

4. Por TAG_NAME (cuando solo necesitas el tag):
   product.find_element(By.TAG_NAME, 'h3')

5. Por XPATH (cuando necesitas búsqueda compleja):
   driver.find_element(By.XPATH, "//button[contains(text(), 'Editar')]")

EJEMPLOS ESPECÍFICOS DE ESTE PROYECTO:

# Llenar formulario
driver.find_element(By.ID, 'nombre').send_keys('Producto Test')
driver.find_element(By.ID, 'precio').send_keys('100')
driver.find_element(By.ID, 'stock').send_keys('50')
driver.find_element(By.ID, 'stock_minimo').send_keys('10')
driver.find_element(By.ID, 'btnGuardar').click()

# Buscar productos
products = driver.find_elements(By.CLASS_NAME, 'product-item')

# Encontrar botón editar dentro de un producto
edit_btn = product.find_element(By.CLASS_NAME, 'btn-edit')

# Buscar producto por nombre usando XPATH
product = driver.find_element(By.XPATH, "//h3[contains(text(), 'Laptop HP')]")

# Filtrar productos
filter_btn = driver.find_element(By.XPATH, "//button[contains(text(), 'Stock Bajo')]")
filter_btn.click()

# Buscar productos con stock bajo (por clase CSS)
low_stock_products = driver.find_elements(By.CSS_SELECTOR, '.product-item.low-stock')
"""