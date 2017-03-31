-- curl -d '' 'http://192.168.100.169/ss.lua?p=11101001001000111&bpm=200'

local function stop()
  print("Stopped.")
  if timer then
    timer:unregister()
    timer = nil
  end
  gpio.write(0,0)
  pattern = nil
  collectgarbage()
end


local beat = 0
local ratio = 4

local function tap()
  if beat == 0 then
    gpio.write(0,tonumber(pattern:sub(1,1)))
    pattern = pattern:sub(2)
  elseif beat == 1 then
    gpio.write(0,0)
  end
  beat = beat + 1
  if beat >= ratio then
    beat = 0
    if pattern == "" then
      stop()
    end
  end
end


local function onReceive(connection, req)

  local p = req:match("p=([01]+)")
  if p then pattern = p end

  local r = req:match("r=([1-9])")
  if r then ratio = tonumber(r) end

  local bpm = req:match("bpm=([0-9]+)")
  if bpm and pattern then

    if not timer then
      print("Started bpm="..bpm)
      timer = tmr.create()
    else
      print("New bpm="..bpm)
      timer:unregister()
    end

    tap()
    timer:alarm(15000/(bpm*ratio), tmr.ALARM_AUTO, tap)
  else

    stop()
  end

  connection:send("HTTP/1.1 204 No Content\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Methods: POST,OPTIONS\r\nConnection: keep-alive\r\n\r\n")
  collectgarbage()
end


return function(connection, req)
  connection:on("receive", onReceive)
  onReceive(connection, req)
end
