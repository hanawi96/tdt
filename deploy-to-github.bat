@echo off
echo ========================================
echo    DEPLOY TUI DAU TAM TO GITHUB
echo ========================================
echo.

echo [1/6] Initializing Git repository...
git init
if %errorlevel% neq 0 (
    echo ERROR: Failed to initialize git repository
    pause
    exit /b 1
)

echo [2/6] Adding remote repository...
git remote add origin https://github.com/hanawi96/tdt.git
if %errorlevel% neq 0 (
    echo WARNING: Remote might already exist, continuing...
)

echo [3/6] Configuring Git user (if needed)...
git config user.name "hanawi96"
git config user.email "hanawi96@users.noreply.github.com"

echo [4/6] Adding all files...
git add .
if %errorlevel% neq 0 (
    echo ERROR: Failed to add files
    pause
    exit /b 1
)

echo [5/6] Committing changes...
git commit -m "Initial commit - Tui Dau Tam website with Cloudflare Worker integration"
if %errorlevel% neq 0 (
    echo ERROR: Failed to commit changes
    pause
    exit /b 1
)

echo [6/6] Pushing to GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo ERROR: Failed to push to GitHub
    echo.
    echo POSSIBLE SOLUTIONS:
    echo 1. Make sure you have GitHub access token configured
    echo 2. Try: git push -u origin master (if main branch doesn't exist)
    echo 3. Check if repository exists: https://github.com/hanawi96/tdt.git
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    SUCCESS! CODE PUSHED TO GITHUB
echo ========================================
echo.
echo Repository URL: https://github.com/hanawi96/tdt
echo.
echo NEXT STEPS:
echo 1. Go to https://pages.cloudflare.com
echo 2. Create new project from Git
echo 3. Select hanawi96/tdt repository
echo 4. Deploy with default settings
echo.
pause
