# Atmos Read

This is a simple static web application that reads temperature, humidity and pressure data from a serial port. The expected data format is `THP,tt.tt,hh.hh,pp.pp` where `tt.tt` is the temperature in °C, `hh.hh` is the humidity in % and `pp.pp` is the pressure in hPa.

Open `index.html` in a compatible browser (Chrome or Edge) and click **Connect** to choose the serial port. Set the desired baud rate before connecting. Each received measurement is plotted on three separate charts (temperature, humidity and pressure). Below every chart the current minimum, maximum and mean values are displayed. The charts can be zoomed and panned thanks to the Chart.js Zoom plugin (registered from the global `ChartZoom` of the CDN UMD build). The charts and terminal are visible even before connecting to the device. A connection status indicator and **Disconnect** button are included. Styling is provided by [Bootstrap](https://getbootstrap.com/) so everything fits on a single screen without scrolling.

The Web Serial API requires a secure context (HTTPS or localhost).

