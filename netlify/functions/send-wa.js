export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  const { target, message } = JSON.parse(event.body || "{}");

  if (!target || !message) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "target & message wajib diisi" })
    };
  }

  try {
    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": process.env.FONNTE_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        target,
        message
      })
    });

    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
