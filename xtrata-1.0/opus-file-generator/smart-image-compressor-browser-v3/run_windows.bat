@echo off
cd /d "%~dp0"
py -m pip install -r requirements.txt
py web_image_compressor.py
pause
