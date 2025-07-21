const connectButton = document.getElementById('connect');
const disconnectButton = document.getElementById('disconnect');
const baudInput = document.getElementById('baudrate');
const statusSpan = document.getElementById('status');
const terminal = document.getElementById('terminal');

let port;
let reader;
let tempChart;
let humChart;
let presChart;
let sample = 1;

// Register zoom plugin from the global ChartZoom variable loaded in index.html
if (window.ChartZoom) {
    Chart.register(window.ChartZoom);
}

function createChart(ctx, label, color) {
    return new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [{ label, data: [], borderColor: color, fill: false }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: {
                zoom: {
                    zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
                    pan: { enabled: true, mode: 'x' }
                }
            },
            scales: {
                x: { title: { display: true, text: 'Sample' } },
                y: { title: { display: true, text: 'Value' } }
            }
        }
    });
}

function initCharts() {
    tempChart = createChart(document.getElementById('tempChart').getContext('2d'), 'Temperature (°C)', 'red');
    humChart = createChart(document.getElementById('humChart').getContext('2d'), 'Humidity (%)', 'blue');
    presChart = createChart(document.getElementById('presChart').getContext('2d'), 'Pressure (hPa)', 'green');
}

async function connect() {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: parseInt(baudInput.value, 10) });
        readLoop();
        connectButton.disabled = true;
        disconnectButton.disabled = false;
        statusSpan.textContent = 'Connected';
        statusSpan.classList.remove('bg-danger');
        statusSpan.classList.add('bg-success');
    } catch (err) {
        console.error('Connection error', err);
    }
}

async function disconnect() {
    try {
        if (reader) {
            await reader.cancel();
        }
        if (port) {
            await port.close();
        }
    } catch (err) {
        console.error('Disconnection error', err);
    } finally {
        reader = null;
        port = null;
        connectButton.disabled = false;
        disconnectButton.disabled = true;
        statusSpan.textContent = 'Disconnected';
        statusSpan.classList.remove('bg-success');
        statusSpan.classList.add('bg-danger');
    }
}

async function readLoop() {
    const decoder = new TextDecoderStream();
    const inputDone = port.readable.pipeTo(decoder.writable);
    reader = decoder.readable.getReader();
    let buffer = '';
    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) {
                buffer += value;
                let lines = buffer.split(/\r?\n/);
                buffer = lines.pop();
                for (const line of lines) {
                    const clean = line.trim();
                    if (clean) {
                        terminal.textContent += clean + '\n';
                        terminal.scrollTop = terminal.scrollHeight;
                        parseLine(clean);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Read error', error);
    } finally {
        reader.releaseLock();
    }
}

function parseLine(line) {
    // Expected format: THP,tt.tt,hh.hh,pp.pp
    if (!line.startsWith('TPH')) return;
    const parts = line.split(',');
    if (parts.length !== 4) return;
    const temp = parseFloat(parts[1]);
    const hum = parseFloat(parts[3]);
    const pres = parseFloat(parts[2]);

    tempChart.data.labels.push(sample);
    humChart.data.labels.push(sample);
    presChart.data.labels.push(sample);
    sample += 1;

    tempChart.data.datasets[0].data.push(temp);
    humChart.data.datasets[0].data.push(hum);
    presChart.data.datasets[0].data.push(pres);

    tempChart.update('none');
    humChart.update('none');
    presChart.update('none');

    updateStats(tempChart.data.datasets[0].data, 'tempStats');
    updateStats(humChart.data.datasets[0].data, 'humStats');
    updateStats(presChart.data.datasets[0].data, 'presStats');
}

function updateStats(values, elementId) {
    const min = Math.min(...values).toFixed(2);
    const max = Math.max(...values).toFixed(2);
    const mean = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
    document.getElementById(elementId).textContent = `min: ${min} max: ${max} mean: ${mean}`;
}

connectButton.addEventListener('click', () => {
    connect();
});

disconnectButton.addEventListener('click', () => {
    disconnect();
});

// Initialize empty charts so they are visible even before connecting
initCharts();
