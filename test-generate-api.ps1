# Test de l'API de génération d'image

$body = @{
    prompt = "beautiful landscape"
    model = "schnell"
    numSteps = 4
    width = 512
    height = 512
} | ConvertTo-Json

Write-Host "🧪 Test de l'API de génération d'image..." -ForegroundColor Cyan
Write-Host "URL: http://localhost:3000/api/admin/generate-image" -ForegroundColor Yellow
Write-Host "Body: $body" -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/admin/generate-image" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing

    Write-Host "✅ Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body:" -ForegroundColor Red
        Write-Host $responseBody -ForegroundColor Red
    }
}
