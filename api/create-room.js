export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const apiKey = process.env.DAILY_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "Missing DAILY_API_KEY" });
      return;
    }

    const { conversationId } = req.body || {};
    if (!conversationId) {
      res.status(400).json({ error: "Missing conversationId" });
      return;
    }

    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        name: `rpg-${conversationId}-${Date.now()}`,
        properties: {
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      res.status(500).json({ error: "Daily API error", detail: errorText });
      return;
    }

    const data = await response.json();
    res.status(200).json({ roomUrl: data?.url });
  } catch (error) {
    res.status(500).json({ error: "Server error", detail: String(error) });
  }
}
