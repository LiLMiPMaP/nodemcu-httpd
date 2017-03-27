-- Turn solenoid OFF (up)
gpio.mode(0,gpio.OUTPUT)
gpio.write(0,0)

wifi.setmode(wifi.STATION)

-- Get Wi-Fi settings from flash?
wifi.sta.config("dsl", "0xdeadbeef", 1)

print('chip: ',node.chipid())
print('heap: ',node.heap())

-- Compile server code and remove original .lua files.
-- This only happens the first time afer the .lua files are uploaded.

for i, f in ipairs({'httpserver.lua', 'ss.lua'}) do
  if file.exists(f) then
      print('Compiling:', f)
      node.compile(f)
      file.remove(f)
      collectgarbage()
  end
end

collectgarbage()

-- Connect to the WiFi access point.
-- Once the device is connected, you may start the HTTP server.

local httpserver = dofile("httpserver.lc")

local joinCounter = 0
local joinMaxAttempts = 5
tmr.alarm(0, 3000, 1, function()
   local ip = wifi.sta.getip()
   if ip == nil and joinCounter < joinMaxAttempts then
      print('Connecting to WiFi Access Point ...')
      joinCounter = joinCounter +1
   else
      if joinCounter == joinMaxAttempts then
         print('Failed to connect to WiFi Access Point.')
         enduser_setup.start(function()
            -- Save Wi-Fi settings to flash?
            httpserver(80)
         end)
      else
        -- Uncomment to automatically start the server in port 80
        httpserver(80)
      end
      tmr.stop(0)
      joinCounter = nil
      joinMaxAttempts = nil
      collectgarbage()
   end
end)


function ls()
  for k,v in pairs(file.list()) do print(k,v) end
end
