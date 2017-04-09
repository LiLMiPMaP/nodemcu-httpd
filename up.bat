set ARGS="--start_baud 115200 --baud 9600"
python nodemcu-uploader/nodemcu-uploader.py %ARGS% upload init.lua httpserver.lua && python nodemcu-uploader/nodemcu-uploader.py %ARGS% node restart

