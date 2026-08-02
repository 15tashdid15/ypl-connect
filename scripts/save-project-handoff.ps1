param(
    [Parameter(Mandatory = $true)]
    [string]$Title,

    [Parameter(Mandatory = $true)]
    [string]$Summary,

    [Parameter(Mandatory = $true)]
    [string]$NextTask,

    [string]$Tests = "Not recorded",

    [string]$ChangedFiles = "Not recorded",

    [string]$Risks = "None recorded",

    [switch]$Commit
)

$ErrorActionPreference = "Stop"

$repoRoot = (git rev-parse --show-toplevel).Trim()
if (-not $repoRoot) {
    throw "Run this script inside the ypl-connect Git repository."
}

Set-Location $repoRoot

$branch = (git branch --show-current).Trim()
$commit = (git rev-parse --short HEAD).Trim()
$status = git status --short

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss K"
$date = Get-Date -Format "yyyy-MM-dd"

$entry = @"
## $date — $Title

**Recorded at:** $timestamp  
**Branch:** ``$branch``  
**Commit before handoff update:** ``$commit``  

### Summary

$Summary

### Changed files

$ChangedFiles

### Commands and tests

$Tests

### Remaining risks

$Risks

### Exact next task

$NextTask

### Git status at capture time

``````text
$status
``````

---

"@

$logPath = Join-Path $repoRoot "docs/SESSION_LOG.md"
if (-not (Test-Path $logPath)) {
    throw "Missing docs/SESSION_LOG.md"
}

$existing = Get-Content $logPath -Raw
$header = "# YPL Connect — Session Log"
if (-not $existing.StartsWith($header)) {
    throw "Unexpected session log format."
}

$body = $existing.Substring($header.Length).TrimStart()
$newContent = $header + "`r`n`r`n" + $entry + $body
Set-Content -Path $logPath -Value $newContent -Encoding utf8

Write-Host "Session entry added to docs/SESSION_LOG.md"

if ($Commit) {
    git add PROJECT_CONTEXT.md AGENTS.md docs/SESSION_LOG.md scripts/save-project-handoff.ps1 .github/PULL_REQUEST_TEMPLATE.md
    git commit -m "docs: update project handoff"
    Write-Host "Created local handoff commit. This script does not push."
}
