const connectButton = document.getElementById('connect');
const baudInput = document.getElementById('baudrate');
let port;
let reader;
let chart;

function initChart() {
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                { label: 'Temperature (°C)', data: [], borderColor: 'red', fill: false },
                { label: 'Humidity (%)', data: [], borderColor: 'blue', fill: false },
                { label: 'Pressure (hPa)', data: [], borderColor: 'green', fill: false }
            ]
        },
        options: {
            animation: false,
            scales: {
                x: { title: { display: true, text: 'Sample' } },
                y: { title: { display: true, text: 'Value' } }
            }
        }
    });
}

async function connect() {
    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: parseInt(baudInput.value, 10) });
        readLoop();
        connectButton.disabled = true;
    } catch (err) {
        console.error('Connection error', err);
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
                    parseLine(line.trim());
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
    if (!line.startsWith('THP')) return;
    const parts = line.split(',');
    if (parts.length !== 4) return;
    const temp = parseFloat(parts[1]);
    const hum = parseFloat(parts[2]);
    const pres = parseFloat(parts[3]);
    const label = chart.data.labels.length + 1;
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(temp);
    chart.data.datasets[1].data.push(hum);
    chart.data.datasets[2].data.push(pres);
    chart.update();
}

connectButton.addEventListener('click', () => {
    if (!chart) initChart();
    connect();
});
