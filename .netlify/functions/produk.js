exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const target = body.target;

    if (!target) {
      return {
        statusCode: 400,
        body: "Target tidak ada"
      };
    }

    // 🔹 GOOGLE SHEET
    const SHEET_ID = "177kg9LvopYqir5PZS7YTd8IIOm4dwrGj45VRdMjIDl";
    const SHEET_NAME = "Sheet1";
    const sheetUrl = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

    // ✅ fetch bawaan Netlify
    const res = await fetch(sheetUrl);
    const data = await res.json();

    // 🔹 FILTER STATUS READY
    const products = data.filter(
      p => p.STATUS && p.STATUS.toLowerCase() === "ready"
    );

    if (products.length === 0) {
      return {
        statusCode: 200,
        body: "Tidak ada produk ready"
      };
    }

    // 🔹 FORMAT PESAN
    let message = "📦 *DAFTAR PRODUK PREMIUM*\n\n";

    products.forEach((p, i) => {
      message += `*${i + 1}. ${p.NAMA}*\n`;
      message += `💰 Harga: Rp${p.HARGA}\n`;
      message += `📝 ${p.DESKRIPSI}\n\n`;
    });

    message += "👉 Balas *ANGKA* untuk order";

    // 🔹 KIRIM WA VIA FONNTE
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
      body: "Pesan produk terkirim"
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.toString()
    };
  }
};
