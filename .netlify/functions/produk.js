exports.handler = async (event) => {
  try {
    // =============================
    // 1. AMBIL DATA DARI FLOW
    // =============================
    const body = JSON.parse(event.body || "{}");
    const target = body.target;

    if (!target) {
      return {
        statusCode: 400,
        body: "Target tidak ada"
      };
    }

    console.log("TARGET WA:", target);

    // =============================
    // 2. AMBIL DATA GOOGLE SHEET
    // =============================
    const SHEET_ID = "177kg9LvopYqir5PZS7YTd8IIOm4dwrGj45VRdMjIDl";
    const SHEET_NAME = "Sheet1";
    const sheetUrl = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

    const sheetRes = await fetch(sheetUrl);
    const sheetData = await sheetRes.json();

    // =============================
    // 3. FILTER PRODUK READY
    // =============================
    const products = sheetData.filter(
      (p) => p.STATUS && p.STATUS.toLowerCase() === "ready"
    );

    if (products.length === 0) {
      return {
        statusCode: 200,
        body: "Tidak ada produk ready"
      };
    }

    // =============================
    // 4. FORMAT PESAN WHATSAPP
    // =============================
    let message = "📦 *DAFTAR PRODUK PREMIUM*\n\n";

    products.forEach((p, i) => {
      message += `*${i + 1}. ${p.NAMA}*\n`;
      message += `💰 Harga: Rp${p.HARGA}\n`;
      message += `📝 ${p.DESKRIPSI}\n\n`;
    });

    message += "👉 Balas *ANGKA* untuk order";

    console.log("PESAN SIAP DIKIRIM");

    // =============================
    // 5. KIRIM KE WHATSAPP VIA FONNTE
    // =============================
    const waRes = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.FONNTE_TOKEN}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        target: target,
        message: message
      })
    });

    const waResult = await waRes.text();
    console.log("RESPON FONNTE:", waResult);

    // =============================
    // 6. RESPONSE KE FLOW
    // =============================
    return {
      statusCode: 200,
      body: "Pesan produk terkirim"
    };

  } catch (error) {
    console.error("ERROR:", error);
    return {
      statusCode: 500,
      body: error.toString()
    };
  }
};
