$ErrorActionPreference = "Stop"

$root = (Get-Location).Path
$outputDir = Join-Path $root "copilot-context"
$maxBundleBytes = 150KB

$excludedDirectories = @(
    "node_modules",
    ".git",
    ".next",
    "coverage",
    "dist",
    "dist-production",
    "build",
    ".turbo",
    ".cache",
    "copilot-context"
)

$excludedFiles = @(
    "tsconfig.tsbuildinfo",
    "package-lock.json",
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    "create-copilot-bundles.ps1",
    "create-copilot-bundles-powershell51.ps1"
)

$allowedExtensions = @(
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".json",
    ".md",
    ".css",
    ".scss",
    ".html",
    ".yml",
    ".yaml",
    ".sh",
    ".txt"
)

if (Test-Path $outputDir) {
    Remove-Item $outputDir -Recurse -Force
}

New-Item -ItemType Directory -Path $outputDir | Out-Null

function Get-ProjectRelativePath {
    param([string]$FullName)

    # Compatible with Windows PowerShell 5.1 / older .NET Framework.
    # Path.GetRelativePath is only available in newer .NET versions.
    $rootWithSeparator = $root.TrimEnd("\", "/") + [System.IO.Path]::DirectorySeparatorChar
    $rootUri = [System.Uri]::new($rootWithSeparator)
    $fileUri = [System.Uri]::new($FullName)
    $relativeUri = $rootUri.MakeRelativeUri($fileUri)
    return [System.Uri]::UnescapeDataString($relativeUri.ToString()).Replace("\", "/")
}

function Test-Excluded {
    param([System.IO.FileInfo]$File)

    if ($File.Name -in $excludedFiles) {
        return $true
    }

    $relative = Get-ProjectRelativePath $File.FullName
    $parts = $relative -split "/"

    foreach ($part in $parts) {
        if ($part -in $excludedDirectories) {
            return $true
        }
    }

    return $false
}

function Get-MarkdownLanguage {
    param([string]$Extension)

    switch ($Extension.ToLowerInvariant()) {
        ".ts"   { return "typescript" }
        ".tsx"  { return "tsx" }
        ".js"   { return "javascript" }
        ".jsx"  { return "jsx" }
        ".mjs"  { return "javascript" }
        ".cjs"  { return "javascript" }
        ".json" { return "json" }
        ".md"   { return "markdown" }
        ".css"  { return "css" }
        ".scss" { return "scss" }
        ".html" { return "html" }
        ".yml"  { return "yaml" }
        ".yaml" { return "yaml" }
        ".sh"   { return "bash" }
        default  { return "text" }
    }
}

$files = Get-ChildItem $root -Recurse -File |
    Where-Object {
        $_.Extension.ToLowerInvariant() -in $allowedExtensions -and
        -not (Test-Excluded $_)
    } |
    Sort-Object FullName

$script:bundleNumber = 1
$script:currentSize = 0
$script:currentContent = [System.Text.StringBuilder]::new()
$script:currentFiles = [System.Collections.Generic.List[string]]::new()
$bundleManifest = [System.Collections.Generic.List[object]]::new()

function Save-CurrentBundle {
    if ($script:currentFiles.Count -eq 0) {
        return
    }

    $name = "CONTEXT_{0:D2}.md" -f $script:bundleNumber
    $path = Join-Path $outputDir $name

    $header = @"
# Mapa APS: pacote de contexto $($script:bundleNumber)

Este pacote contem arquivos integrais do projeto.

Cada arquivo comeca com:

# FILE: caminho/original

e termina com:

# END FILE: caminho/original

Nao interprete a ausencia de um arquivo neste pacote como ausencia no projeto. Outros arquivos podem estar nos demais pacotes.

---

"@

    ($header + $script:currentContent.ToString()) |
        Set-Content -Path $path -Encoding UTF8

    $bundleManifest.Add([pscustomobject]@{
        Bundle = $name
        FileCount = $script:currentFiles.Count
        Files = @($script:currentFiles)
    })

    $script:bundleNumber++
    $script:currentSize = 0
    $script:currentContent = [System.Text.StringBuilder]::new()
    $script:currentFiles = [System.Collections.Generic.List[string]]::new()
}

foreach ($file in $files) {
    $relative = Get-ProjectRelativePath $file.FullName
    $language = Get-MarkdownLanguage $file.Extension
    $content = Get-Content $file.FullName -Raw -Encoding UTF8

    $entry = @"

# FILE: $relative

````$language
$content
````

# END FILE: $relative

---

"@

    $entryBytes = [System.Text.Encoding]::UTF8.GetByteCount($entry)

    if (
        $script:currentFiles.Count -gt 0 -and
        ($script:currentSize + $entryBytes) -gt $maxBundleBytes
    ) {
        Save-CurrentBundle
    }

    [void]$script:currentContent.Append($entry)
    $script:currentFiles.Add($relative)
    $script:currentSize += $entryBytes
}

Save-CurrentBundle

$index = [System.Text.StringBuilder]::new()

[void]$index.AppendLine("# Mapa APS: indice integral do snapshot")
[void]$index.AppendLine("")
[void]$index.AppendLine("## Decisao canonica obrigatoria")
[void]$index.AppendLine("")
[void]$index.AppendLine("O instrumento adult-dcnt-esf esta completo.")
[void]$index.AppendLine("")
[void]$index.AppendLine("A numeracao original e deliberadamente descontinua:")
[void]$index.AppendLine("")
[void]$index.AppendLine("- Bloco 1")
[void]$index.AppendLine("- Bloco 2")
[void]$index.AppendLine("- Bloco 6")
[void]$index.AppendLine("- Bloco 7")
[void]$index.AppendLine("- Bloco 8")
[void]$index.AppendLine("")
[void]$index.AppendLine("Nao existem Blocos 3, 4 ou 5 pendentes.")
[void]$index.AppendLine("")
[void]$index.AppendLine("O Bloco 8 representa genograma, ecomapa e observacoes clinicas.")
[void]$index.AppendLine("")
[void]$index.AppendLine("## Pacotes")
[void]$index.AppendLine("")

foreach ($bundle in $bundleManifest) {
    [void]$index.AppendLine("- $($bundle.Bundle): $($bundle.FileCount) arquivos")
}

[void]$index.AppendLine("")
[void]$index.AppendLine("## Arquivos por pacote")
[void]$index.AppendLine("")

foreach ($bundle in $bundleManifest) {
    [void]$index.AppendLine("### $($bundle.Bundle)")
    [void]$index.AppendLine("")

    foreach ($relative in $bundle.Files) {
        [void]$index.AppendLine("- $relative")
    }

    [void]$index.AppendLine("")
}

$index.ToString() |
    Set-Content -Path (Join-Path $outputDir "00_PROJECT_INDEX.md") -Encoding UTF8

$totalContextFiles = (Get-ChildItem $outputDir -File).Count

Write-Host ""
Write-Host "Pacotes criados com sucesso."
Write-Host "Pasta: $outputDir"
Write-Host "Total de arquivos de contexto: $totalContextFiles"
Write-Host ""
Get-ChildItem $outputDir -File |
    Sort-Object Name |
    Select-Object Name, Length
