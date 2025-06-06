# Start UjenziIQ Development Environment

# Function to handle errors
function HandleError {
    Write-Host "Error: $($args[0])" -ForegroundColor Red
    exit 1
}

# Check if Python is installed
try {
    $pythonVersion = python --version
    Write-Host "Found Python: $pythonVersion" -ForegroundColor Green
} catch {
    HandleError "Python not found. Please install Python 3.8+ and try again."
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Found Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    HandleError "Node.js not found. Please install Node.js 18+ and try again."
}

# Define directories
$backendDir = "ujenziiq-backend"
$frontendDir = "ujenziiq-frontend"

# Start backend server
Write-Host "Setting up backend server..." -ForegroundColor Cyan
cd $backendDir

# Check for virtual environment
if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate

# Install dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Run migrations
Write-Host "Running database migrations..." -ForegroundColor Yellow
python manage.py migrate

# Start backend server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $backendDir; .\venv\Scripts\Activate; python manage.py runserver"

# Go back to root directory
cd ..

# Start frontend server
Write-Host "Setting up frontend server..." -ForegroundColor Cyan
cd $frontendDir

# Install dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install

# Start frontend server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $frontendDir; npm run dev"

# Go back to root directory
cd ..

Write-Host "UjenziIQ development environment is now running!" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8000/api/" -ForegroundColor Blue
Write-Host "Frontend App: http://localhost:3000/" -ForegroundColor Blue
Write-Host "Press Ctrl+C in each terminal window to stop the servers." -ForegroundColor Yellow
