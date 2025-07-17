const connectButton = document.getElementById('connect');
const disconnectButton = document.getElementById('disconnect');
const baudInput = document.getElementById('baudrate');
const statusSpan = document.getElementById('status');
const terminal = document.getElementById('terminal');

const tempStatsEls = {
    min: document.getElementById('temp-min'),
    max: document.getElementById('temp-max'),
    mean: document.getElementById('temp-mean')
};
const humStatsEls = {
    min: document.getElementById('hum-min'),
    max: document.getElementById('hum-max'),
    mean: document.getElementById('hum-mean')
};
const presStatsEls = {
    min: document.getElementById('pres-min'),
    max: document.getElementById('pres-max'),
    mean: document.getElementById('pres-mean')
};

Chart.register(window['chartjs-plugin-zoom']);

let port;
let reader;
let tempChart;
let humChart;
let presChart;
let sample = 1;

const stats = {
    temp: { min: null, max: null, sum: 0, count: 0 },
    hum: { min: null, max: null, sum: 0, count: 0 },
    pres: { min: null, max: null, sum: 0, count: 0 }
};

function updateStats(stat, value, els) {
    if (stat.min === null || value < stat.min) stat.min = value;
    if (stat.max === null || value > stat.max) stat.max = value;
    stat.sum += value;
    stat.count += 1;
    els.min.textContent = stat.min.toFixed(2);
    els.max.textContent = stat.max.toFixed(2);
    els.mean.textContent = (stat.sum / stat.count).toFixed(2);
}

function initCharts() {
    const zoomOptions = {
        pan: { enabled: true, mode: 'x' },
        zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' }
    };

    const ctxT = document.getElementById('tempChart').getContext('2d');
    tempChart = new Chart(ctxT, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Temperature (°C)', data: [], borderColor: 'red', fill: false }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: { zoom: zoomOptions },
            scales: { x: { title: { display: true, text: 'Sample' } }, y: { title: { display: true, text: '°C' } } }
        }
    });

    const ctxH = document.getElementById('humChart').getContext('2d');
    humChart = new Chart(ctxH, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Humidity (%)', data: [], borderColor: 'blue', fill: false }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: { zoom: zoomOptions },
            scales: { x: { title: { display: true, text: 'Sample' } }, y: { title: { display: true, text: '%' } } }
        }
    });

    const ctxP = document.getElementById('presChart').getContext('2d');
    presChart = new Chart(ctxP, {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Pressure (hPa)', data: [], borderColor: 'green', fill: false }] },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: { zoom: zoomOptions },
            scales: { x: { title: { display: true, text: 'Sample' } }, y: { title: { display: true, text: 'hPa' } } }
        }
    });
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
    if (!line.startsWith('THP')) return;
    const parts = line.split(',');
    if (parts.length !== 4) return;
    const temp = parseFloat(parts[1]);
    const hum = parseFloat(parts[2]);
    const pres = parseFloat(parts[3]);

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

    updateStats(stats.temp, temp, tempStatsEls);
    updateStats(stats.hum, hum, humStatsEls);
    updateStats(stats.pres, pres, presStatsEls);
}

connectButton.addEventListener('click', () => {
    if (!tempChart) initCharts();
    connect();
});

disconnectButton.addEventListener('click', () => {
    disconnect();
});
