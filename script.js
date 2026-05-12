
const BACKEND_URL = "https://agrobot-backend-rnu5.onrender.com";

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.querySelector(".overlay");
    const main = document.querySelector(".main");
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
    if (window.innerWidth > 900) {
        if (sidebar.classList.contains("active")) {
            main.style.marginLeft = "260px";
            main.style.width = "calc(100% - 260px)";
        } else {
            main.style.marginLeft = "0";
            main.style.width = "100%";
        }
    }
}

function toggleHelpBox() {
    const box = document.getElementById("helpBox");
    box.style.display = (box.style.display === "block") ? "none" : "block";
}

window.addEventListener('click', function (e) {
    if (!document.getElementById('helpBox').contains(e.target) &&
        !document.querySelector('.help-btn').contains(e.target)) {
        document.getElementById('helpBox').style.display = 'none';
    }
});


async function fetchLatestMoisture() {
    try {
        const res = await fetch(`${BACKEND_URL}/api/moisture/latest`);
        const json = await res.json();
        const moistureValue = json.data.moisturePercentage;
        document.getElementById("moisture").innerText = moistureValue + "%";
        const statusEl = document.querySelector(".moisture-card p");
        if (moistureValue < 30) {
            statusEl.innerText = "⚠️ Status: Too Dry!";
            statusEl.style.color = "#ef4444";
        } else if (moistureValue > 80) {
            statusEl.innerText = "💧 Status: Too Wet!";
            statusEl.style.color = "#3b82f6";
        } else {
            statusEl.innerText = "✅ Status: Healthy";
            statusEl.style.color = "#16a34a";
        }
    } catch (err) {
        console.error("Moisture fetch error:", err);
        document.getElementById("moisture").innerText = "N/A";
        document.querySelector(".moisture-card p").innerText = "⚠️ Backend not connected";
    }
}


let moistureChart = null;

async function fetchWeeklyData() {
    const graphPlaceholder = document.querySelector(".graph-placeholder");
    graphPlaceholder.innerHTML = `<canvas id="moistureChart"></canvas>`;
    graphPlaceholder.style.background = "white";
    graphPlaceholder.style.border = "none";
    graphPlaceholder.style.height = "300px";

    try {
        const res = await fetch(`${BACKEND_URL}/api/moisture/weekly`);
        const json = await res.json();
        const labels = json.data.map(item => item._id);
        const values = json.data.map(item => Math.round(item.averageMoisture));
        drawChart(labels, values);
    } catch (err) {
        console.error("Weekly fetch error:", err);
        drawChart(["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],[55,62,58,70,65,72,68],true);
    }
}

function drawChart(labels, values, isDemo = false) {
    const ctx = document.getElementById("moistureChart").getContext("2d");
    if (moistureChart) moistureChart.destroy();
    moistureChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: isDemo ? "Moisture % (Demo — Backend connect karo)" : "Avg Moisture %",
                data: values,
                borderColor: "#16a34a",
                backgroundColor: "rgba(22, 163, 74, 0.1)",
                borderWidth: 3,
                pointBackgroundColor: "#16a34a",
                pointRadius: 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { font: { family: "Poppins", size: 13 }, color: "#555" } },
                tooltip: { callbacks: { label: ctx => ` Moisture: ${ctx.parsed.y}%` } }
            },
            scales: {
                y: {
                    min: 0, max: 100,
                    ticks: { callback: val => val + "%", font: { family: "Poppins" } },
                    grid: { color: "rgba(0,0,0,0.05)" }
                },
                x: { ticks: { font: { family: "Poppins" } }, grid: { display: false } }
            }
        }
    });
}


document.querySelector(".download-report").addEventListener("click", function () {
    const moisture = document.getElementById("moisture").innerText;
    const temp = document.getElementById("temp").innerText;
    const now = new Date();
    const dateTime = now.toISOString().slice(0, 10) + "_" + now.getHours() + now.getMinutes();
    const report = `--- AgroBot Smart Report ---\nDate: ${now.toLocaleDateString()}\nTime: ${now.toLocaleTimeString()}\n------------------------------\nSensor ID: AGRO-102\nSoil Moisture: ${moisture}\nAvg Temperature: ${temp}`;
    const blob = new Blob([report], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `AgroBot_Report_${dateTime}.txt`;
    link.click();
});


const apiKey = "e90f559b8ace2ad8085d7fb17acfcc67";

function updateWeatherUI(data) {
    document.getElementById("temp").innerText = Math.round(data.main.temp) + "°C";
    document.getElementById("humidity").innerText = data.main.humidity + "%";
    document.getElementById("wind").innerText = (data.wind.speed * 3.6).toFixed(1) + " km/h";
    document.getElementById("temp-status").innerText = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    document.getElementById("hum-status").innerText = "Normal";
    document.getElementById("wind-status").innerText = data.weather[0].main;
    const weatherMain = data.weather[0].main.toLowerCase();
    const icon = document.getElementById("temp-icon");
    if (weatherMain.includes("cloud")) icon.innerText = "☁️";
    else if (weatherMain.includes("rain") || weatherMain.includes("drizzle")) icon.innerText = "🌧️";
    else if (weatherMain.includes("clear")) icon.innerText = "☀️";
    else icon.innerText = "🌡️";
}

function handleLocationError() {
    document.querySelectorAll(".weather-card h1").forEach(el => el.innerText = "N/A");
    document.querySelectorAll(".weather-card p").forEach(el => el.innerText = "Location denied.");
    document.getElementById("temp-icon").innerText = "🚫";
}


window.onload = function () {
    const chartScript = document.createElement("script");
    chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js";
    chartScript.onload = function () {
        fetchLatestMoisture();
        fetchWeeklyData();
        setInterval(fetchLatestMoisture, 30000);
    };
    document.head.appendChild(chartScript);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${apiKey}&units=metric`)
                .then(r => r.json())
                .then(updateWeatherUI)
                .catch(handleLocationError);
        }, handleLocationError);
    } else {
        handleLocationError();
    }
};
