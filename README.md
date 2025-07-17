# Atmos Read

This is a simple static web application that reads temperature, humidity and pressure data from a serial port. The expected data format is `THP,tt.tt,hh.hh,pp.pp` where `tt.tt` is the temperature in °C, `hh.hh` is the humidity in % and `pp.pp` is the pressure in hPa.

Open `index.html` in a compatible browser (Chrome or Edge) and click **Connect** to choose the serial port. Set the desired baud rate before connecting. Each received measurement is plotted on a chart. The page now includes a small terminal that shows all lines received from the device and a connection status indicator with a **Disconnect** button to close the port. The interface uses [Bootstrap](https://getbootstrap.com/) so the controls, chart and terminal fit on a single screen without scrolling.

The Web Serial API requires a secure context (HTTPS or localhost).

