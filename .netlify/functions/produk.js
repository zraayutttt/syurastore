export async function handler(event) {
  try {
    // ❌ Tolak selain POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed"
      };
    }

    // 🔹 Ambil target dari body
    const body = JSON.parse(event.body || "{}");
    const target = body.target;

    if (!target) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "target kosong" })
      };
    }

    // 🔹 Google Sheet (opensheet)
    const SHEET_ID = "177kg9LvopYqir5PZS7YTd8IIOm4dwrGj45VRdMjIDl";
    const SHEET_NAME = "Sheet1";
    const url = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

    const res = await fetch(url);
    const data = await res.json();

    // 🔹 Filter READY
    const products = data.filter(
      p => p.STATUS && p.STATUS.toLowerCase() === "ready"
    );

    if (products.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Tidak ada produk ready" })
      };
    }

    // 🔹 Susun pesan
    let message = "📦 *DAFTAR PRODUK PREMIUM*\n\n";

    products.forEach((p, i) => {
      message += `*${i + 1}. ${p.NAMA}*\n`;
      message += `💰 Rp${p.HARGA}\n`;
      message += `📝 ${p.DESKRIPSI}\n\n`;
    });

    message += "👉 Balas *ANGKA* untuk order";

    // 🔹 Kirim via Fonnte
    await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": process.env.FONNTE_TOKEN,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        target,
        message
      })
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString()
    };
  }
}
