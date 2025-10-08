@echo off
echo ============================================
echo Running Prisma Migration for Consultation Requests
echo ============================================
echo.

cd /d "%~dp0"

echo Checking database connection...
npx prisma db pull --force 2>nul
if errorlevel 1 (
    echo ERROR: Cannot connect to database. Please ensure MySQL is running.
    pause
    exit /b 1
)

echo.
echo Creating migration...
npx prisma migrate dev --name add_consultation_requests

echo.
echo Generating Prisma Client...
npx prisma generate

echo.
echo ============================================
echo Migration Complete!
echo ============================================
echo.
echo You can now start the backend server with: npm run start:dev
echo.
pause

