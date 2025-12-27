const fetch = require("node-fetch");

exports.handler = async (event) => {
  const body = JSON.parse(event.body || "{}");
  const target = body.target;

  const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbwi13McQGBeTAt_ev4KjCGnh2h6wnOyiPhhbmJl3_X4HKCFP45DR6MW8v3XwEGRtvwt/exec";

  const res = await fetch(SHEET_API_URL);
  const products = await res.json();

  let message = "📦 *DAFTAR PRODUK SYURASTORE*\n\n";

  products
    .filter(p => p.status?.toLowerCase() === "ready")
    .slice(0, 5)
    .forEach((p, i) => {
      message += `${i + 1}. *${p.name}*\n`;
      message += `💰 Rp ${p.price}\n`;
      message += `📂 ${p.category}\n\n`;
    });

  message += "Balas *NEXT* untuk produk lainnya\n";
  message += "Balas *ORDER* untuk memesan";

  await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: {
      Authorization: process.env.FONNTE_TOKEN,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      target,
      message
    })
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
