param (
    [string]$PageName,
    [string]$TargetDir = "./src/app"
)

if (-not $PageName) {
    Write-Host "Por favor, proporciona un nombre para la página."
    exit
}

# Crear el directorio de destino si no existe
if (-not (Test-Path -Path $TargetDir)) {
    Write-Host "El directorio de destino no existe. Creando el directorio: $TargetDir"
    New-Item -Path $TargetDir -ItemType Directory -Force > $null
}

# Crear el directorio para la página dentro del directorio de destino
$PageDir = Join-Path -Path $TargetDir -ChildPath $PageName
New-Item -Path $PageDir -ItemType Directory -Force > $null
New-Item -Path "$PageDir\page.tsx" -ItemType File -Force > $null
New-Item -Path "$PageDir\$PageName.module.scss" -ItemType File -Force > $null

# Asegurarse de que la primera letra de $PageName sea mayúscula
$ComponentName = $PageName.Substring(0, 1).ToUpper() + $PageName.Substring(1)

# Agregar contenido base al archivo .tsx
$jsxContent = @"
import React from 'react';
import styles from './$ComponentName.module.scss';

function $ComponentName() {
    return <div className={styles.$ComponentName}>$ComponentName Page</div>;
}

export default $ComponentName;
"@

Set-Content -Path "$PageDir\page.tsx" -Value $jsxContent

# Agregar contenido al archivo .scss
$scssContent = @"
.$ComponentName {
    display: flex;
    align-items: center;
    justify-content: center;
}
"@

Set-Content -Path "$PageDir\$ComponentName.module.scss" -Value $scssContent

# Mostrar solo el mensaje deseado
Write-Host "Página $ComponentName y el archivo SCSS correspondiente creados en $PageDir con éxito."
