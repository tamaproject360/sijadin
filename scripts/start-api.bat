@echo off
cd /d D:\APP-WEB\sijadin\apps\api
call venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
