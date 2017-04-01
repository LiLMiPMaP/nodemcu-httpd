return function(connection, req)

    local function close(c)
        c:close()

        wifi.setmode(wifi.STATION, true)

        --register callback: use previous state
        wifi.sta.eventMonReg(wifi.STA_GOTIP, function(previous_State)
            print("Restarting...")
            node.restart()
        end)

        print("wifi.sta.config")
        local station_cfg={}
        station_cfg.pwd=req:match("pw=([^ ]+)")
        station_cfg.ssid=req:match("ssid=([^&]+)")
        station_cfg.auto=true
        station_cfg.save=true
        wifi.sta.config(station_cfg)
    end

    local mac = wifi.sta.getmac()
    print(mac)
    connection:send("HTTP/1.1 200 OK\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Methods: POST,OPTIONS\r\nConnection: close\r\nContent-Length: 17\r\n\r\n"..mac, close)
end
