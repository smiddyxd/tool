$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$pythonExe = Join-Path $scriptDir ".venv\Scripts\python.exe"
$requirements = Join-Path $scriptDir "requirements.txt"
$bridgeScript = Join-Path $scriptDir "screen_bridge.py"

function Get-BridgePort {
    param([string]$Path)

    $content = Get-Content $Path -Raw
    $match = [regex]::Match($content, 'HTTP_PORT\s*=\s*(\d+)')
    if (-not $match.Success) {
        throw "Unable to determine HTTP_PORT from $Path"
    }

    return [int]$match.Groups[1].Value
}

function Stop-StaleBridgeListeners {
    param([int]$Port)

    $netstatLines = netstat -ano | Select-String "127.0.0.1:$Port"
    $pids = @()

    foreach ($line in $netstatLines) {
        $parts = ($line.ToString().Trim() -split '\s+') | Where-Object { $_ }
        if ($parts.Length -lt 5) {
            continue
        }

        if ($parts[3] -ne 'LISTENING') {
            continue
        }

        $pid = $parts[-1]
        if ($pid -and $pid -ne "$PID") {
            $pids += $pid
        }
    }

    $pids = $pids | Sort-Object -Unique
    foreach ($pid in $pids) {
        Write-Host "Stopping process listening on port $Port (PID $pid)..."
        taskkill /PID $pid /F | Out-Host
    }
}

$bridgePort = Get-BridgePort $bridgeScript
Stop-StaleBridgeListeners $bridgePort

if (-not (Test-Path $pythonExe)) {
    Write-Host "Creating virtual environment..."
    python -m venv (Join-Path $scriptDir ".venv")
}

Write-Host "Ensuring dependencies are installed..."
& $pythonExe -m pip install -r $requirements | Out-Host

Write-Host "Starting screen bridge on port $bridgePort..."
& $pythonExe $bridgeScript
