# Atmos Read

This is a simple static web application that reads temperature, humidity and pressure data from a serial port. The expected data format is `THP,tt.tt,hh.hh,pp.pp` where `tt.tt` is the temperature in °C, `hh.hh` is the humidity in % and `pp.pp` is the pressure in hPa.

Open `index.html` in a compatible browser (Chrome or Edge) and click **Connect** to choose the serial port. Set the desired baud rate before connecting. Incoming measurements are plotted on a single line chart with three datasets for temperature, humidity and pressure. The chart automatically adjusts its axes to the received values and is visible even before connecting. A connection status indicator and **Disconnect** button are included along with a small terminal that shows each received line.

The layout divides the page vertically so the controls occupy the top quarter, the chart fills the middle half, and the terminal uses the bottom quarter. Styling is provided by [Bootstrap](https://getbootstrap.com/) and custom CSS so everything fits on a single screen without scrolling.

The Web Serial API requires a secure context (HTTPS or localhost).

