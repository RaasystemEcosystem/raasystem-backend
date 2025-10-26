@echo off
SETLOCAL

:: ------------------------
:: 🐳 Build and start backend Docker container
:: ------------------------
echo 🔹 Building and starting backend container...
docker-compose up --build -d backend

:: ------------------------
:: ⏳ Wait for backend to initialize
:: ------------------------
echo 🔹 Waiting for backend to be ready...
SET /A retries=0
:wait_loop
IF %retries% GEQ 30 (
    echo ❌ Backend did not respond after 30 seconds. Exiting.
    EXIT /B 1
)

:: Test connectivity
curl -s -o NUL -w "%{http_code}" http://localhost:8000/ > tmp_status.txt
SET /P status=<tmp_status.txt
IF "%status%"=="200" (
    echo ✅ Backend is ready!
) ELSE (
    SET /A retries+=1
    timeout /t 1 > NUL
    GOTO wait_loop
)

:: ------------------------
:: 🧪 Send test mint request
:: ------------------------
echo 🔹 Sending test mint request...
powershell -Command ^
  "try { $resp = Invoke-RestMethod -Uri 'http://localhost:8000/api/rrwa/mint' -Method POST; Write-Output '✅ Test mint response:'; $resp } catch { Write-Error '❌ Failed to connect to backend'; $_ }"

:: ------------------------
:: ℹ️ Finished
:: ------------------------
echo 🔹 Staging workflow complete.
docker-compose logs -f backend

ENDLOCAL
pause
