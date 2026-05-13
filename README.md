# 🌱 AgroBot — Soil Moisture Monitoring Dashboard

A smart agriculture web dashboard that displays **real-time soil moisture data** from an ESP8266 sensor, along with **live local weather information**.

🔗 **Live Demo:** [kumarashish-iitp.github.io/Agrobot](https://kumarashish-iitp.github.io/Agrobot/)

---

## 📸 Overview

AgroBot helps farmers and agriculture students monitor soil conditions remotely from any device. Instead of manually checking soil, the dashboard shows live moisture levels, status alerts, a 7-day trend chart, and current weather — all in one place.

---

## ✨ Features

- 💧 **Live Soil Moisture** — fetches real-time data from backend every 30 seconds
- 🌡️ **Live Weather** — temperature, humidity, wind speed via OpenWeatherMap API
- 📊 **7-Day Trend Chart** — weekly moisture average displayed as a line graph (Chart.js)
- ⚠️ **Smart Status Alerts** — Too Dry / Healthy / Too Wet with colour coding
- 📥 **Download Report** — generates a plain-text report with current readings
- 📱 **Fully Responsive** — works on desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Charts | Chart.js (CDN) |
| Weather | OpenWeatherMap API |
| Hosting | GitHub Pages |
| Backend | Node.js, Express.js (separate repo) |
| Database | MongoDB Atlas |
| Sensor | ESP8266 + Soil Moisture Sensor |

---

## 🗂️ Project Structure

```
Agrobot/
├── index.html        # Main dashboard page
├── style.css         # All styling and responsive layout
├── script.js         # API calls, chart logic, weather integration
└── Agrobot logo.jpeg # Project logo
```

---

## 🔌 API Integration

This frontend connects to the AgroBot backend for soil data:

| Endpoint | Method | Description |
|---|---|---|
| `/api/moisture` | GET | Fetch all moisture readings (latest first) |
| `/api/moisture/weekly` | GET | Fetch 7-day average moisture trend |

Weather data is fetched from:
```
https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={key}&units=metric
```

---

## ⚙️ Setup & Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/kumarashish-iitp/Agrobot.git

# 2. Open in browser — no build step needed!
open index.html
```

> ⚠️ For live soil moisture data, the backend must be running. Update `BACKEND_URL` in `script.js` with your backend URL.

---

---

## 📄 License

This project was built as a Capstone-I project for the **Hybrid UG Program in Computer Science & Data Analytics** at **IIT Patna**.

---

> Made with ❤️ by Team AgroBot — IIT Patna
