# -*- coding: utf-8 -*-
"""
Script de Diagnóstico - Verificar Selectores
Ejecuta este script ANTES de las pruebas completas
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def diagnostico():
    """Verificar que todos los selectores funcionan"""
    print("\n" + "="*70)
    print("DIAGNÓSTICO DE SELECTORES")
    print("="*70)
    
    # Iniciar navegador
    driver = webdriver.Chrome()
    driver.maximize_window()
    
    try:
        # Cargar aplicación
        print("\n1. Cargando aplicación...")
        driver.get("http://localhost:5173")
        time.sleep(2)
        print("   ✓ Aplicación cargada")
        
        # Verificar inputs
        print("\n2. Verificando inputs del formulario...")
        
        try:
            nombre = driver.find_element(By.ID, 'nombre')
            print("   ✓ Input nombre encontrado")
        except:
            print("   ✗ Input nombre NO encontrado")
        
        try:
            precio = driver.find_element(By.ID, 'precio')
            print("   ✓ Input precio encontrado")
        except:
            print("   ✗ Input precio NO encontrado")
        
        try:
            stock = driver.find_element(By.ID, 'stock')
            print("   ✓ Input stock encontrado")
        except:
            print("   ✗ Input stock NO encontrado")
        
        try:
            stock_minimo = driver.find_element(By.ID, 'stock_minimo')
            print("   ✓ Input stock_minimo encontrado")
        except:
            print("   ✗ Input stock_minimo NO encontrado")
        
        # Verificar botones
        print("\n3. Verificando botones...")
        
        try:
            btn_nuevo = driver.find_element(By.ID, 'btnNuevo')
            print("   ✓ Botón Nuevo encontrado")
        except:
            print("   ✗ Botón Nuevo NO encontrado")
        
        try:
            btn_guardar = driver.find_element(By.ID, 'btnGuardar')
            print("   ✓ Botón Guardar encontrado")
        except:
            print("   ✗ Botón Guardar NO encontrado")
        
        # Verificar productos
        print("\n4. Verificando lista de productos...")
        
        try:
            products = driver.find_elements(By.CLASS_NAME, 'product-item')
            print(f"   ✓ {len(products)} producto(s) encontrado(s)")
            
            if len(products) > 0:
                print("\n5. Verificando botones en primer producto...")
                first_product = products[0]
                
                try:
                    btn_edit = first_product.find_element(By.CLASS_NAME, 'btn-edit')
                    print("   ✓ Botón Editar encontrado")
                except:
                    print("   ✗ Botón Editar NO encontrado")
                
                try:
                    btn_delete = first_product.find_element(By.CLASS_NAME, 'btn-delete')
                    print("   ✓ Botón Eliminar encontrado")
                except:
                    print("   ✗ Botón Eliminar NO encontrado")
                
                try:
                    name = first_product.find_element(By.TAG_NAME, 'h3')
                    print(f"   ✓ Nombre del producto: {name.text}")
                except:
                    print("   ✗ Nombre del producto NO encontrado")
        except:
            print("   ✗ No se encontraron productos")
        
        # Prueba de creación
        print("\n6. PRUEBA: Crear un producto de prueba...")
        try:
            nombre.send_keys("Producto Diagnóstico")
            precio.send_keys("100")
            stock.send_keys("50")
            stock_minimo.send_keys("10")
            
            btn_guardar.click()
            time.sleep(2)
            
            # Verificar que se creó
            products_after = driver.find_elements(By.CLASS_NAME, 'product-item')
            print(f"   ✓ Producto creado. Total productos: {len(products_after)}")
            
            # Tomar screenshot
            driver.save_screenshot('./screenshots/diagnostico_success.png')
            print("   📸 Screenshot guardado: diagnostico_success.png")
            
        except Exception as e:
            print(f"   ✗ Error al crear producto: {str(e)}")
            driver.save_screenshot('./screenshots/diagnostico_error.png')
        
        print("\n" + "="*70)
        print("DIAGNÓSTICO COMPLETADO")
        print("="*70)
        print("\nSi todos los elementos se encontraron ✓, puedes ejecutar las pruebas.")
        print("Si hay errores ✗, revisa los selectores en test_config.py")
        
    finally:
        input("\nPresiona ENTER para cerrar el navegador...")
        driver.quit()

if __name__ == '__main__':
    diagnostico()