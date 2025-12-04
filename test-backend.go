# ------------------------
# Raasystem Backend Test Script
# ------------------------

$baseUrl = "http://localhost:8000"

function Test-Endpoint {
    param (
        [string]$method = "GET",
        [string]$endpoint,
        [object]$body = $null
    )
    try {
        if ($body) {
            $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method $method -Body ($body | ConvertTo-Json) -ContentType "application/json"
        } else {
            $response = Invoke-RestMethod -Uri "$baseUrl$endpoint" -Method $method
        }
        Write-Host "✅ [$method] $endpoint → Success:`n$response`n"
    } catch {
        Write-Host "❌ [$method] $endpoint → Failed:`n$($_.Exception.Message)`n"
    }
}

# ------------------------
# Healthcheck
# ------------------------
Test-Endpoint -endpoint "/api/raaspay/health"

# ------------------------
# RBT Endpoints
# ------------------------
Test-Endpoint -endpoint "/api/rbt"
Test-Endpoint -method "GET" -endpoint "/api/rbt/value"
Test-Endpoint -method "GET" -endpoint "/api/rbt/composition"

# ------------------------
# RAAS Endpoints
# ------------------------
Test-Endpoint -method "GET" -endpoint "/api/raaskoin/price"

# ------------------------
# RST Endpoints
# ------------------------
Test-Endpoint -method "GET" -endpoint "/api/rst/portfolio"
Test-Endpoint -method "GET" -endpoint "/api/rst/price"

# ------------------------
# Stocks / Alpaca
# ------------------------
Test-Endpoint -method "GET" -endpoint "/api/stocks/price"

# ------------------------
# ICE (Commodities)
# ------------------------
Test-Endpoint -method "GET" -endpoint "/api/ice/markets"

# ------------------------
# Oracle
# ------------------------
Test-Endpoint -method "GET" -endpoint "/api/oracle/price"

Write-Host "All endpoints tested!"
