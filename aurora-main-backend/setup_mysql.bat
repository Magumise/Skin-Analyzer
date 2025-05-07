@echo off
echo Setting up MySQL database for Aurora Skin Analyzer...

REM Use full path to MySQL
set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 9.3\bin\mysql.exe"

REM Check if MySQL exists at the specified path
if not exist %MYSQL_PATH% (
    echo MySQL not found at %MYSQL_PATH%
    echo Please check your MySQL installation path
    pause
    exit /b 1
)

REM Run the SQL script
%MYSQL_PATH% -u root -p < setup_mysql.sql

if %errorlevel% neq 0 (
    echo Failed to set up MySQL database. Please check your MySQL installation and root password.
    pause
    exit /b 1
)

echo MySQL database setup completed successfully!
pause 