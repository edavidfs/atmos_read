# Atmos Read

This is a simple static web application that reads temperature, humidity and pressure data from a serial port. The expected data format is `THP,tt.tt,hh.hh,pp.pp` where `tt.tt` is the temperature in °C, `hh.hh` is the humidity in % and `pp.pp` is the pressure in hPa.

Open `index.html` in a compatible browser (Chrome or Edge) and click **Connect** to choose the serial port. Set the desired baud rate before connecting. Each measurement is drawn on three separate charts (temperature, humidity and pressure) which include zoom and pan controls provided by the Chart.js Zoom plugin. Below every chart you can see simple statistics (minimum, maximum and mean) updated with the incoming values. The charts and terminal are visible even before establishing a connection. A connection status indicator and **Disconnect** button are also included.

The layout divides the page vertically so the controls occupy the top quarter, the charts fill the middle half and sit side by side, and the terminal uses the bottom quarter. Styling is provided by [Tailwind CSS](https://tailwindcss.com/) and custom CSS so everything fits on a single screen without scrolling. The chart canvases have their height fixed via CSS so they remain equal and do not grow as new measurements arrive.

The Web Serial API requires a secure context (HTTPS or localhost).

