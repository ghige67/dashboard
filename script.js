/* CLOCK */
function updateClock() {
    const now = new Date();

    const time = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    });

    const date = now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric"
    });

    document.getElementById("dateLine").textContent = date;
    document.getElementById("timeLine").textContent = time;
}
setInterval(updateClock, 1000);
updateClock();

/* SEARCH */
document.getElementById("searchBox").addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const q = e.target.value.trim();
        if (q) window.open("https://www.google.com/search?q=" + encodeURIComponent(q));
    }
});

document.getElementById("searchBtn").addEventListener("click", () => {
    const q = document.getElementById("searchBox").value.trim();
    if (q) window.open("https://www.google.com/search?q=" + encodeURIComponent(q));
});

/* WEATHER — FIXED VERSION */
async function loadWeather(id, lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph`;
        const res = await fetch(url);
        const data = await res.json();

        const w = data.current_weather;

        const emoji =
            w.temperature < 32 ? "❄️" :
            w.temperature < 60 ? "🌤️" :
            w.temperature < 80 ? "☀️" : "🔥";

        document.getElementById(id).textContent =
            `${emoji} ${w.temperature}°F — Wind ${Math.round(w.windspeed)} mph`;

    } catch {
        document.getElementById(id).textContent = "Unavailable";
    }
}

loadWeather("weather-chicago", 41.8781, -87.6298);
loadWeather("weather-nyc", 40.7128, -74.0060);
loadWeather("weather-tucson", 32.2226, -110.9747);

/* RSS NEWS */
async function loadRSSSectionJSON(title, url, count, container) {
    try {
        const api = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(url);
        const res = await fetch(api);
        const data = await res.json();

        if (!data.items || data.items.length === 0) throw new Error();

        const items = data.items.slice(0, count);

        const section = document.createElement("div");
        section.className = "news-section";
        section.innerHTML = `<h3>${title}</h3>`;

        items.forEach(item => {
            const div = document.createElement("div");
            div.className = "rss-item";
            div.innerHTML = `
                <strong>${item.title}</strong><br>
                <a href="${item.link}" target="_blank" style="color:#4da3ff;">Read more</a>
            `;
            section.appendChild(div);
        });

        container.appendChild(section);

    } catch {
        const error = document.createElement("div");
        error.textContent = `${title}: Unable to load news.`;
        container.appendChild(error);
    }
}

async function loadAllNews() {
    const container = document.getElementById("rss-combined");
    container.innerHTML = "";

    await loadRSSSectionJSON("National US News", "https://feeds.npr.org/1003/rss.xml", 2, container);
    await loadRSSSectionJSON("Chicago", "https://abc7chicago.com/feed/", 2, container);
    await loadRSSSectionJSON("Tucson", "https://www.kgun9.com/news/local-news.rss", 2, container);
    await loadRSSSectionJSON("Financial", "https://www.marketwatch.com/rss/topstories", 2, container);
}
loadAllNews();
