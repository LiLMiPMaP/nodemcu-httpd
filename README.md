
## Installation
1. FLASH FIRMWARE
  * Connect serial cable
  * Connect D3 to GND
  * ./flash

2. UPLOAD HTTP SERVER (REMOVE D3 from GND)
  * Connect serial cable
  * pip install pyserial
  * ./up
  
3. UPLOAD ALL FILES
  * Reboot SoundThing with button pressed
  * Connect to SoundThing_XXXXXX Wi-Fi
  * ./up2 192.168.4.1
  * Reboot SoundThing

4. CONNECT TO WI-FI
  * Open browser and go to http://192.168.4.1
  * Enter SSID/PASSWORD, press button
  * CONNECT BACK TO PREVIOUS SSID

## Install HTTP server
Clone the project and edit the Wi-Fi settings in `init.lua`. You can use the shell script `up` or execute the following:
```
$ python nodemcu-uploader/nodemcu-uploader.py upload init.lua httpserver.lua
```
This assumes you've cloned the `nodemcu-uploader` project (use `--recursive`) as well, which is added as a submodule:
```
$ git submodule init
$ git submodule update
```
After uploading, connect the serial console (`screen /dev/ttyUSB0 9600` under most *nix flavors) and reboot the device. The device will print its IP address in the console.

## Small HTTP server for NodeMCU
This small webserver supports the following HTTP verbs/methods:
* GET returns the contents of a file in flash
* PUT creates a new file in flash
* DELETE remove the file from flash
* POST executes the given lua script (may return a function that receives the payload)
* OPTIONS returns minimal CORS headers allowing POST from any origin

## Usage
Once those files have been uploaded you can manage your device with `curl`, for example to PUT new files on flash:
```
curl --upload-file example.lua http://serial.console.shows.ip/
```

To reboot your device (for example after uploading a new `init.lua` or `httpserver.lua`) use `curl` to POST anything to `/`:
```
curl --data anything http://serial.console.shows.ip/
```

## TODO
* Need a way to return flash contents/listing vs. `index.html`


