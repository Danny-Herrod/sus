# 🐛 Guía de Depuración - Avatares

## Problema: Los avatares no se ven

### Pasos para solucionar:

1. **Verificar que avatares.js se carga correctamente**
   - Abre http://localhost:3000/test-avatar.html
   - Deberías ver todos los avatares listados
   - Si ves errores, el archivo no se está cargando

2. **Limpiar localStorage**
   - Abre http://localhost:3000/clear-storage.html
   - Haz clic en "Limpiar Todo"
   - Vuelve a la página principal

3. **Verificar la consola del navegador**
   - Abre DevTools (F12)
   - Ve a la pestaña "Console"
   - Busca errores en rojo
   - Los mensajes importantes incluyen:
     - "avatares.js no está cargado correctamente"
     - "defaultAvatars is not defined"
     - "Avatar grid element not found"

4. **Verificar que los archivos están en orden**
   ```
   public/
   ├── avatares.js          ✓ Debe existir
   ├── script.js            ✓ Debe existir
   ├── index.html           ✓ Debe cargar avatares.js ANTES de script.js
   └── styles.css           ✓ Debe existir
   ```

5. **Verificar el orden de carga en index.html**
   Los scripts deben estar en este orden:
   ```html
   <script src="/socket.io/socket.io.js"></script>
   <script src="avatares.js"></script>  <!-- PRIMERO -->
   <script src="script.js"></script>    <!-- DESPUÉS -->
   ```

## Soluciones rápidas:

### Opción 1: Borrar caché del navegador
1. Presiona Ctrl+Shift+Del
2. Selecciona "Caché" e "Imágenes y archivos en caché"
3. Haz clic en "Borrar datos"
4. Recarga la página (Ctrl+F5)

### Opción 2: Usar modo incógnito
- Abre una ventana de incógnito
- Visita http://localhost:3000
- Los avatares deberían funcionar

### Opción 3: Verificar red
- Abre DevTools (F12)
- Ve a la pestaña "Network"
- Recarga la página
- Busca "avatares.js"
- Debe aparecer con status 200
- Si aparece 404, el archivo no está donde debería

## Características de los avatares:

✅ **Lo que debería funcionar:**
- Avatar aleatorio asignado automáticamente
- Grid de 48 avatares emoji para elegir
- Upload de foto personalizada (opcional)
- Avatares guardados en localStorage
- Avatares visibles en el lobby junto al nombre

❌ **Problemas conocidos:**
- Si cargas la página muy rápido, puede que avatares.js no se cargue a tiempo
- Si tienes datos viejos en localStorage, puede haber conflictos
- Las fotos muy grandes pueden causar problemas (recomendado < 1MB)

## Tests incluidos:

1. **test-avatar.html** - Verifica que avatares.js funciona
2. **clear-storage.html** - Limpia localStorage si hay problemas

## Contacto:
Si los avatares siguen sin funcionar después de estos pasos, revisa:
1. La consola del navegador
2. La pestaña Network en DevTools
3. Que el servidor esté corriendo en el puerto 3000
