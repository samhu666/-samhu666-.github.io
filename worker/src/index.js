// Cloudflare Worker：接收網站聯絡表單並透過 Resend 寄信通知
function json(body, status, corsHeaders) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const SERVICE_LABELS = {
  modeling: "3D 建模與工程圖",
  automation: "機電整合與自動化",
  simulation: "模擬分析與數據處理",
  prototype: "3D 列印與原型製作",
  other: "其他 / 尚未確定",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed" }, 405, corsHeaders);
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ ok: false, error: "請求格式錯誤" }, 400, corsHeaders);
    }

    const { name, email, service, message, website } = data || {};

    // honeypot：一般使用者看不到這個欄位，機器人才會填
    if (website) {
      return json({ ok: true }, 200, corsHeaders);
    }

    if (!name || !email || !message) {
      return json({ ok: false, error: "姓名、Email、專案內容為必填" }, 400, corsHeaders);
    }

    if (!EMAIL_PATTERN.test(email)) {
      return json({ ok: false, error: "Email 格式不正確" }, 400, corsHeaders);
    }

    const serviceLabel = SERVICE_LABELS[service] || service || "未指定";

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `FS MEC STUDIO 網站表單 <${env.CONTACT_FROM_EMAIL}>`,
        to: env.CONTACT_TO_EMAIL,
        reply_to: email,
        subject: `[網站洽詢] ${name} - ${serviceLabel}`,
        html: `
          <h2>新的網站洽詢</h2>
          <p><strong>姓名：</strong>${escapeHtml(name)}</p>
          <p><strong>Email：</strong>${escapeHtml(email)}</p>
          <p><strong>需求類型：</strong>${escapeHtml(serviceLabel)}</p>
          <p><strong>專案內容：</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
        `,
      }),
    });

    if (!resendResponse.ok) {
      return json({ ok: false, error: "寄信失敗，請稍後再試" }, 502, corsHeaders);
    }

    return json({ ok: true }, 200, corsHeaders);
  },
};
