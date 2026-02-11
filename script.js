// STOCK DATA (Yahoo Finance via RapidAPI-free proxy)
const tickers = ["QQQ", "SPY", "GLD", "SLV"];

async function loadStock(ticker) {
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    const stock = data.quoteResponse.result[0];

    const card = document.getElementById(ticker);

    const changeColor = stock.regularMarketChangePercent >= 0 ? "#4caf50" : "#ff5252";

    card.innerHTML = `
      <h2>${ticker}</h2>
      <div class="price">$${stock.regularMarketPrice.toFixed(2)}</div>
      <div class="change" style="color:${changeColor}">
        ${stock.regularMarketChangePercent.toFixed(2)}%
      </div>
      <div class="volume">Volume: ${stock.regularMarketVolume.toLocaleString()}</div>
    `;
  } catch (err) {
    console.error("Stock load error:", err);
  }
}

function loadAllStocks() {
  tickers.forEach(loadStock);
}

loadAllStocks();
setInterval(loadAllStocks, 60000);