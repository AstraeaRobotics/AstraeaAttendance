Set-Location $PSScriptRoot

Start-Process powershell -Argument @(
	"-NoExit",
	"-Command",
	"Set-Location '$PSScriptRoot'; npm start"
)

Start-Process powershell -ArgumentList @(
	"-NoExit",
	"-Command",
	"Set-Location '$PSScriptRoot'; npm run dev"
)

Start-Sleep -Seconds 3

Start-Process "http://localhost:5173"