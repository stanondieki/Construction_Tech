# Check system readiness for UjenziIQ

Write-Host "UjenziIQ System Readiness Check" -ForegroundColor Blue
Write-Host "===============================" -ForegroundColor Blue

# Check Python installation
try {
    $pythonVersion = python --version
    Write-Host "✓ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python: Not found or not in PATH" -ForegroundColor Red
    Write-Host "  Please install Python 3.8+ and make sure it's in your PATH" -ForegroundColor Yellow
}

# Check Node.js installation
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js: Not found or not in PATH" -ForegroundColor Red
    Write-Host "  Please install Node.js 18+ and make sure it's in your PATH" -ForegroundColor Yellow
}

# Check npm installation
try {
    $npmVersion = npm --version
    Write-Host "✓ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm: Not found or not in PATH" -ForegroundColor Red
    Write-Host "  npm is required and should be installed with Node.js" -ForegroundColor Yellow
}

# Check for backend directory
if (Test-Path "ujenziiq-backend") {
    Write-Host "✓ Backend directory: Found" -ForegroundColor Green
    
    # Check for manage.py
    if (Test-Path "ujenziiq-backend\manage.py") {
        Write-Host "  ✓ Django project: Found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Django project: manage.py not found" -ForegroundColor Red
    }
    
    # Check for virtual environment
    if (Test-Path "ujenziiq-backend\venv") {
        Write-Host "  ✓ Virtual environment: Found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Virtual environment: Not found" -ForegroundColor Yellow
        Write-Host "    Will be created on first run" -ForegroundColor Blue
    }
    
    # Check for requirements.txt
    if (Test-Path "ujenziiq-backend\requirements.txt") {
        Write-Host "  ✓ requirements.txt: Found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ requirements.txt: Not found" -ForegroundColor Red
        Write-Host "    Please create a requirements.txt file" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Backend directory: Not found" -ForegroundColor Red
    Write-Host "  Please make sure the ujenziiq-backend directory exists" -ForegroundColor Yellow
}

# Check for frontend directory
if (Test-Path "ujenziiq-frontend") {
    Write-Host "✓ Frontend directory: Found" -ForegroundColor Green
    
    # Check for package.json
    if (Test-Path "ujenziiq-frontend\package.json") {
        Write-Host "  ✓ Next.js project: Found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Next.js project: package.json not found" -ForegroundColor Red
    }
    
    # Check for node_modules
    if (Test-Path "ujenziiq-frontend\node_modules") {
        Write-Host "  ✓ node_modules: Found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ node_modules: Not found" -ForegroundColor Yellow
        Write-Host "    Will be installed on first run" -ForegroundColor Blue
    }
    
    # Check for .env.local
    if (Test-Path "ujenziiq-frontend\.env.local") {
        Write-Host "  ✓ Environment variables: Found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Environment variables: Not found" -ForegroundColor Yellow
        Write-Host "    Please create a .env.local file" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Frontend directory: Not found" -ForegroundColor Red
    Write-Host "  Please make sure the ujenziiq-frontend directory exists" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "To start the development environment, run:" -ForegroundColor Cyan
Write-Host ".\start-dev.ps1" -ForegroundColor Cyan

# Check for backend directory
if (Test-Path "ujenziiq-backend") {
    Write-Host "✓ Backend directory: Found" -ForegroundColor Green
    
    # Check for manage.py
    if (Test-Path "ujenziiq-backend\manage.py") {
        Write-Host "  ✓ Django project: Found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Django project: manage.py not found" -ForegroundColor Red
    }
    
    # Check for virtual environment
    if (Test-Path "ujenziiq-backend\venv") {
        Write-Host "  ✓ Virtual environment: Found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Virtual environment: Not found" -ForegroundColor Yellow
        Write-Host "    Will be created on first run" -ForegroundColor Blue
    }
    
    # Check for requirements.txt
    if (Test-Path "ujenziiq-backend\requirements.txt") {
        Write-Host "  ✓ requirements.txt: Found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ requirements.txt: Not found" -ForegroundColor Red
        Write-Host "    Please create a requirements.txt file" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Backend directory: Not found" -ForegroundColor Red
    Write-Host "  Please make sure the ujenziiq-backend directory exists" -ForegroundColor Yellow
}

# Check for frontend directory
if (Test-Path "ujenziiq-frontend") {
    Write-Host "✓ Frontend directory: Found" -ForegroundColor Green
    
    # Check for package.json
    if (Test-Path "ujenziiq-frontend\package.json") {
        Write-Host "  ✓ Next.js project: Found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Next.js project: package.json not found" -ForegroundColor Red
    }
    
    # Check for node_modules
    if (Test-Path "ujenziiq-frontend\node_modules") {
        Write-Host "  ✓ node_modules: Found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ node_modules: Not found" -ForegroundColor Yellow
        Write-Host "    Will be installed on first run" -ForegroundColor Blue
    }
    
    # Check for .env.local
    if (Test-Path "ujenziiq-frontend\.env.local") {
        Write-Host "  ✓ Environment variables: Found" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Environment variables: Not found" -ForegroundColor Yellow
        Write-Host "    Please create a .env.local file" -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Frontend directory: Not found" -ForegroundColor Red
    Write-Host "  Please make sure the ujenziiq-frontend directory exists" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "To start the development environment, run:" -ForegroundColor Cyan
Write-Host ".\start-dev.ps1" -ForegroundColor Cyan
