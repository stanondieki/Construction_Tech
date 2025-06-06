#!/usr/bin/env pwsh

Write-Host "=== UjenziIQ System Check ===" -ForegroundColor Cyan

# Check if both servers are running
Write-Host "`nChecking server status..." -ForegroundColor Yellow

# Check frontend server
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Frontend server running (localhost:3000)" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend server not running (localhost:3000)" -ForegroundColor Red
    Write-Host "   Please run: cd ujenziiq-frontend; npm run dev" -ForegroundColor Yellow
}

# Check backend server
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/" -Method Head -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend server running (localhost:8000)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend server not running (localhost:8000)" -ForegroundColor Red
    Write-Host "   Please run: cd ujenziiq-backend; python manage.py runserver" -ForegroundColor Yellow
}

# Test registration endpoint
Write-Host "`nTesting registration endpoint..." -ForegroundColor Yellow

$testUser = @{
    username = "testuser_$(Get-Date -Format 'yyyyMMddHHmmss')"
    email = "test_$(Get-Date -Format 'yyyyMMddHHmmss')@example.com"
    password = "testpass123"
    password2 = "testpass123"
    first_name = "Test"
    last_name = "User"
    user_type = "worker"
} | ConvertTo-Json

try {
    $registrationResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/users/" -Method POST -Body $testUser -ContentType "application/json" -TimeoutSec 10
    Write-Host "✅ Registration endpoint working" -ForegroundColor Green
    Write-Host "   Created user: $($registrationResponse.username) (ID: $($registrationResponse.id))" -ForegroundColor Gray
} catch {
    Write-Host "❌ Registration endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
    
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Response: $errorBody" -ForegroundColor Yellow
    }
}

# Test login endpoint
Write-Host "`nTesting login endpoint..." -ForegroundColor Yellow

$loginData = @{
    email = $testUser | ConvertFrom-Json | Select-Object -ExpandProperty email
    password = "testpass123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/auth/jwt/create/" -Method POST -Body $loginData -ContentType "application/json" -TimeoutSec 10
    Write-Host "✅ Login endpoint working" -ForegroundColor Green
    Write-Host "   Token received (length: $($loginResponse.access.Length))" -ForegroundColor Gray
} catch {
    Write-Host "❌ Login endpoint failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Check environment variables
Write-Host "`nChecking environment configuration..." -ForegroundColor Yellow

if (Test-Path "ujenziiq-frontend\.env.local") {
    Write-Host "✅ .env.local file exists" -ForegroundColor Green
    
    $envContent = Get-Content "ujenziiq-frontend\.env.local"
    foreach ($line in $envContent) {
        if ($line -match "NEXT_PUBLIC_API_URL=(.*)") {
            Write-Host "   API URL: $($matches[1])" -ForegroundColor Gray
        }
        if ($line -match "NEXT_PUBLIC_APP_URL=(.*)") {
            Write-Host "   App URL: $($matches[1])" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "❌ .env.local file missing" -ForegroundColor Red
    Write-Host "   Should contain:" -ForegroundColor Yellow
    Write-Host "   NEXT_PUBLIC_API_URL=http://localhost:8000/api/" -ForegroundColor Yellow
    Write-Host "   NEXT_PUBLIC_APP_URL=http://localhost:3000" -ForegroundColor Yellow
}

# Check database
Write-Host "`nChecking database..." -ForegroundColor Yellow

if (Test-Path "ujenziiq-backend\db.sqlite3") {
    $dbSize = (Get-Item "ujenziiq-backend\db.sqlite3").Length
    Write-Host "✅ SQLite database exists ($dbSize bytes)" -ForegroundColor Green
} else {
    Write-Host "❌ SQLite database missing" -ForegroundColor Red
    Write-Host "   Run: cd ujenziiq-backend; python manage.py migrate" -ForegroundColor Yellow
}

# Test CORS
Write-Host "`nTesting CORS configuration..." -ForegroundColor Yellow

try {
    $corsResponse = Invoke-WebRequest -Uri "http://localhost:8000/api/users/" -Method Options -TimeoutSec 5 -ErrorAction Stop
    $corsHeaders = $corsResponse.Headers
    
    if ($corsHeaders["Access-Control-Allow-Origin"]) {
        Write-Host "✅ CORS configured" -ForegroundColor Green
        Write-Host "   Allowed origin: $($corsHeaders['Access-Control-Allow-Origin'])" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  CORS headers present but no Allow-Origin found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ CORS test failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "If all tests pass, the registration should work correctly." -ForegroundColor White
Write-Host "Visit http://localhost:3000/system-status for interactive testing." -ForegroundColor White
Write-Host "Visit http://localhost:3000/register to test registration manually." -ForegroundColor White

Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
