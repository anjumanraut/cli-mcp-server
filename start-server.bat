@echo off
:: Get the directory where the script is located
set SCRIPT_DIR=%~dp0

:: Navigate to the script directory
cd /d %SCRIPT_DIR%

:: Run the server with all arguments passed to this script
node src/index.js %*
