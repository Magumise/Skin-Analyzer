@echo off
echo Starting Aurora Skin Analyzer Backend Server...
cd /d %~dp0
python manage.py migrate
python setup.py
python manage.py runserver 8000
pause 