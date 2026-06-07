#!/usr/bin/env pwsh
# Patch all Capacitor gradle files to use Java 17 instead of 21
# Run this after every "npx cap sync"

Write-Host "Patching Java version 21 -> 17 in Android project..."

$files = @(
    "android\app\capacitor.build.gradle",
    "android\capacitor-cordova-android-plugins\build.gradle",
    "node_modules\@capacitor\android\capacitor\build.gradle",
    "node_modules\@capacitor-mlkit\barcode-scanning\android\build.gradle",
    "node_modules\@capacitor-community\speech-recognition\android\build.gradle",
    "node_modules\@capacitor-community\text-to-speech\android\build.gradle"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        (Get-Content $file) -replace "VERSION_21", "VERSION_17" | Set-Content $file
        Write-Host "  Patched: $file"
    }
}

Write-Host "Done!"
