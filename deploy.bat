@echo off
echo 🚀 Starting deployment for Shambil Pride Academy Management System...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js version check passed: 
node --version

REM Install dependencies
echo 📦 Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)

echo 📦 Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)

REM Build applications
echo 🔨 Building client application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build client application
    pause
    exit /b 1
)

echo 🔨 Building server application...
cd ..\server
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build server application
    pause
    exit /b 1
)

REM Copy database to dist folder
echo 📁 Copying database to production folder...
if exist "database" (
    xcopy database dist\database /E /I /Y >nul 2>&1
    echo ✅ Database copied successfully
) else (
    echo ⚠️ Database folder not found. Make sure to initialize the database.
)

REM Create production environment file if it doesn't exist
if not exist ".env.production" (
    echo 📝 Creating production environment file...
    copy .env .env.production >nul
    echo ⚠️ Please update .env.production with production values before deploying
)

echo.
echo ✅ Build completed successfully!
echo 📂 Deployment files are ready in:
echo    - Client: client\build\
echo    - Server: server\dist\

echo.
echo 🌐 Deployment Options:
echo 1. Vercel: Run 'vercel' in the project root
echo 2. Heroku: Run 'git push heroku main'
echo 3. Railway: Run 'railway up'
echo 4. Manual: Copy files to your server

echo.
echo ✅ Shambil Pride Academy Management System is ready for deployment!
echo 📚 Features included:
echo    - 30 Classes (KG to SS3 Science ^& Arts)
echo    - 37 Subjects (Complete Nigerian curriculum)
echo    - Enhanced messaging system
echo    - Class position calculation
echo    - Multi-role authentication
echo    - Results management

cd ..
pause