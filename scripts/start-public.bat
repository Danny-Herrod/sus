@echo off
title IMPOSTOR - Servidor Publico
color 0B
cls

echo.
echo  ============================================
echo       IMPOSTOR - El Juego del Engano
echo  ============================================
echo.
echo  Iniciando servidor publico con panel...
echo.
echo  Por favor espera...
echo.

REM Start the server with QR
start "IMPOSTOR Server" cmd /k "npm run start-public"

REM Wait 3 seconds for server to start
timeout /t 3 /nobreak >nul

REM Open dashboard in default browser
echo  Abriendo panel de control...
start http://localhost:3000/dashboard

echo.
echo  ============================================
echo       Servidor iniciado exitosamente!
echo  ============================================
echo.
echo  Panel de Control: http://localhost:3000/dashboard
echo  Juego:            http://localhost:3000
echo.
echo  Presiona cualquier tecla para cerrar esta ventana
echo  (El servidor seguira corriendo en la otra ventana)
echo.

pause >nul
