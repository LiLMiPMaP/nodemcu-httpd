-- Turn solenoid OFF (up)
gpio.mode(0,gpio.OUTPUT)
gpio.write(0,0)

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

-- Once the device is connected, you may start the HTTP server.
local httpserver = dofile("httpserver.lc")

function ls()
  for k,v in pairs(file.list()) do print(k,v) end
end

-- Check the reset button state
gpio.mode(7,gpio.INT,gpio.PULLUP)
if gpio.read(7) == 0 then


  wifi.setmode(wifi.STATIONAP, false)
  local mac = wifi.ap.getmac()
  print("Starting enduser_setup "..mac)
  wifi.ap.config({ssid="SoundThing_"..mac:sub(10):gsub(":",""), auth=wifi.OPEN})

  -- enduser_setup.manual(true)
  -- enduser_setup.start(
  --   function()
  --     print("Connected to wifi as:" .. wifi.sta.getip())
  --     -- Start our server on another port
  --     httpserver(8080)
  --   end,
  --   function(err, str)
  --     print("enduser_setup: Err #" .. err .. ": " .. str)
  --   end,
  --   print -- debug
  --   )

  httpserver(80, 'setup.html')

  -- tap
  gpio.write(0,1)
  tmr.create():alarm(50, tmr.ALARM_SINGLE, function() gpio.write(0,0) end)
  return
else

  -- Get Wi-Fi settings from flash?
  wifi.setmode(wifi.STATION)
  wifi.sta.autoconnect(1)
  --wifi.sta.config("dsl", "0xdeadbeef", 1)
end

--gpio.trig(7,"down",function() print("down") end)

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
