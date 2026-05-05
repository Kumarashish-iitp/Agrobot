/* --- Responsive Sidebar Logic --- */
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.querySelector(".overlay");
    const main = document.querySelector(".main");

    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
    
    // Aesthetic shift effect for main content on large screens
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

/* --- Help Box Detailed Logic --- */
function toggleHelpBox() {
    const box = document.getElementById("helpBox");
    box.style.display = (box.style.display === "block") ? "none" : "block";
}

/* Close help box if user clicks outside */
window.addEventListener('click', function(e) {
    if (!document.getElementById('helpBox').contains(e.target) && !document.querySelector('.help-btn').contains(e.target)) {
        document.getElementById('helpBox').style.display = 'none';
    }
});


/* --- DOWNLOAD REPORT LOGIC --- */
const downloadBtn = document.querySelector(".download-report");
downloadBtn.addEventListener("click", function () {
    const moisture = document.getElementById("moisture").innerText;
    const temp = document.getElementById("temp").innerText;
    
    // Aesthetic touch: Include date/time in filename
    const now = new Date();
    const dateTime = now.toISOString().slice(0, 10) + "_" + now.getHours() + now.getMinutes();

    const report = `--- AgroBot Smart Report ---\nDate: ${now.toLocaleDateString()}\nTime: ${now.toLocaleTimeString()}\n------------------------------\nSensor ID: AGRO-102\nSoil Moisture: ${moisture} (Healthy)\nAvg Temperature: ${temp}`;
    
    const blob = new Blob([report], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `AgroBot_Report_${dateTime}.txt`;
    link.click();
});

/* --- WEATHER LOGIC: Smart & Aesthetic Enhancements --- */
const apiKey = "e90f559b8ace2ad8085d7fb17acfcc67";

function updateWeatherUI(data) {
    const tempVal = Math.round(data.main.temp);
    const humVal = data.main.humidity;
    const windKmH = (data.wind.speed * 3.6).toFixed(1);
    
    // HTML Update
    document.getElementById("temp").innerText = tempVal + "°C";
    document.getElementById("humidity").innerText = humVal + "%";
    document.getElementById("wind").innerText = windKmH + " km/h";
    
    // Status Text Update
    document.getElementById("temp-status").innerText = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    document.getElementById("hum-status").innerText = "Normal";
    document.getElementById("wind-status").innerText = data.weather[0].main;

    // **Smart Aesthetic Feature: Automatic Icon Changing**
    const tempIconSpan = document.getElementById("temp-icon");
    const weatherMain = data.weather[0].main.toLowerCase();

    if (weatherMain.includes("cloud")) {
        tempIconSpan.innerText = "☁️"; // Clouds
    } else if (weatherMain.includes("rain") || weatherMain.includes("drizzle")) {
        tempIconSpan.innerText = "🌧️"; // Rain
    } else if (weatherMain.includes("clear") || weatherMain.includes("sun")) {
        tempIconSpan.innerText = "☀️"; // Sun
    } else {
        tempIconSpan.innerText = "🌡️"; // Default
    }
}

function handleLocationError() {
    const cards = document.querySelectorAll(".weather-card h1");
    cards.forEach(card => card.innerText = "N/A");
    
    const statuses = document.querySelectorAll(".weather-card p");
    statuses.forEach(status => status.innerText = "Location denied.");
    document.getElementById("temp-icon").innerText = "🚫";
}

/* Automatic Fetch on Load */
window.onload = function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
                .then(res => res.json())
                .then(data => updateWeatherUI(data))
                .catch(() => handleLocationError());
        }, function() {
            handleLocationError();
        });
    } else {
        handleLocationError();
    }
};