@echo off
title Run BrakingPoint Frontend
rem Installing node packages
echo Installing node packages
start cmd /k npm i
pause
rem Starting frontend
echo Starting frontend
start cmd /k npm run dev
pause
