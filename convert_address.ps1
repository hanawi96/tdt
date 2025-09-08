# PowerShell script to convert vietnamAddress.json to JavaScript
# This avoids CORS issues when loading the data

Write-Host "Converting vietnamAddress.json to JavaScript..." -ForegroundColor Green

try {
    # Read JSON file
    $jsonPath = "data\vietnamAddress.json"
    $jsPath = "data\vietnamAddressFull.js"
    
    if (-not (Test-Path $jsonPath)) {
        Write-Host "Error: $jsonPath not found!" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Reading JSON file..." -ForegroundColor Yellow
    $jsonContent = Get-Content $jsonPath -Raw -Encoding UTF8
    
    # Parse JSON to validate it
    $data = $jsonContent | ConvertFrom-Json
    Write-Host "Found $($data.Count) provinces" -ForegroundColor Green
    
    # Create JavaScript content
    $jsContent = @"
// Dữ liệu địa chỉ Việt Nam đầy đủ
// Auto-generated from vietnamAddress.json to avoid CORS issues
// Generated on: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

const VIETNAM_ADDRESS_DATA_FULL = $jsonContent;

// Export for use in main script
window.VIETNAM_ADDRESS_DATA_FULL = VIETNAM_ADDRESS_DATA_FULL;

console.log('✅ Loaded', VIETNAM_ADDRESS_DATA_FULL.length, 'provinces from vietnamAddressFull.js');
"@
    
    # Write to JavaScript file
    Write-Host "Writing JavaScript file..." -ForegroundColor Yellow
    $jsContent | Out-File -FilePath $jsPath -Encoding UTF8
    
    # Get file sizes
    $jsonSize = (Get-Item $jsonPath).Length / 1KB
    $jsSize = (Get-Item $jsPath).Length / 1KB
    
    Write-Host "✅ Conversion completed successfully!" -ForegroundColor Green
    Write-Host "JSON file: $([math]::Round($jsonSize, 1)) KB" -ForegroundColor Cyan
    Write-Host "JS file: $([math]::Round($jsSize, 1)) KB" -ForegroundColor Cyan
    Write-Host "Now you can use the full address data without CORS issues." -ForegroundColor Green
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
