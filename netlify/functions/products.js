export async function handler(event) {
  try {
    // Ambil parameter kategori (opsional)
    const category = event.queryStringParameters?.category;

    const SHEET_ID = "177kg9LvopYqir5PZS7YTd8IIOm4dwrGj45VRdMjIDl";
    const SHEET_NAME = "Sheet1";

    const url = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;
    const res = await fetch(url);
    const data = await res.json();

    // Filter produk READY
    let products = data.filter(
      p => p.STATUS && p.STATUS.toLowerCase() === "ready"
    );

    // Filter kategori jika ada
    if (category) {
      products = products.filter(
        p => p.KATEGORI?.toLowerCase() === category.toLowerCase()
      );
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(products)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
