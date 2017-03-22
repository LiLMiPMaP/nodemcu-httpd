-- curl -d '' 'http://192.168.100.169/ss.lua?p=11101001001000111&bpm=200'
return function(connection, req)

  local ratio = req:match("r=([1-9])")
  if not ration then
    ratio = 2
  end

  local p = req:match("p=([01]*)")
  if p then

    print(p)
    local bpm = req:match("bpm=([0-9]+)")
    if not timer then
      timer = tmr.create()
    else
      timer:unregister()
    end

    local beat = 0

    local function tap()
        print(beat)
        if beat == 0 then
          gpio.write(0,tonumber(p:sub(1,1)))
          p = p:sub(2)
        elseif beat == 1 then
          gpio.write(0,0)
        end
        beat = beat + 1
        if beat >= ratio then
          beat = 0
          if p == "" then
            timer:stop()
          end
        end
    end

    if not bpm then
      bpm = 120
    end

    timer:alarm(15000/(bpm*ratio), tmr.ALARM_AUTO, tap)
  else

    timer:stop()
  end

  connection:send("HTTP/1.1 204 No Content\r\n\r\n", function(c) c:close() end)
end
