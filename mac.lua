return function(connection,r)
  local mac = wifi.sta.getmac()
  if not mac then mac = wifi.ap.getmac() end
  local function close(c) c:close() end
  connection:send("HTTP/1.1 200 No Content\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Methods: POST,OPTIONS\r\nConnection: close\r\n\r\n" .. mac, close)
  collectgarbage()
end
