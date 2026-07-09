# 聯絡表單後端（Cloudflare Workers + Resend）

接收 `網站/index.html` 聯絡表單送出的資料，透過 [Resend](https://resend.com) 寄信通知到指定信箱。對應 `網站運營/表單Email串接方案比較.pdf` 中的「自架輕量後端」路線。

## 事前準備

1. 安裝 Node.js（建議 18+）。
2. 到 [resend.com](https://resend.com) 免費註冊帳號，取得 API Key（開頭 `re_`）。
   - 若還沒有自己的網域，可先用 Resend 內建的 `onboarding@resend.dev` 測試寄信（收件者需與 Resend 帳號 email 相符，適合開發測試）。
   - 正式上線建議在 Resend 綁定並驗證自己的網域（例如 `cgumecstudio.tw`），之後就能用 `hello@cgumecstudio.tw` 之類的寄件位址寄給任何收件人。

## 本機開發

```bash
cd 網站/worker
npm install
cp .dev.vars.example .dev.vars
# 編輯 .dev.vars，貼上你的 RESEND_API_KEY
npm run dev
```

`wrangler dev` 預設會在 `http://localhost:8787` 啟動本機測試伺服器。

## 設定收件 / 寄件資訊

在 `wrangler.toml` 的 `[vars]` 區塊調整：

- `CONTACT_TO_EMAIL`：表單送出後要通知到哪個信箱。
- `CONTACT_FROM_EMAIL`：寄件顯示位址（需為已在 Resend 驗證的網域，測試期間可先用 `onboarding@resend.dev`）。
- `ALLOWED_ORIGIN`：正式上線後建議改成網站實際網域（例如 `https://cgumecstudio.tw`），避免其他網站盜用這支 API。

## 部署到 Cloudflare

```bash
cd 網站/worker
npx wrangler login          # 第一次使用需登入 Cloudflare 帳號
npx wrangler secret put RESEND_API_KEY   # 貼上 API Key（不會進 git）
npm run deploy
```

部署完成後，終端機會顯示一個網址，例如：

```
https://cgu-mec-studio-contact-form.<your-subdomain>.workers.dev
```

## 串接前端

把上面部署完成的網址填入 `網站/script.js` 最上方的 `CONTACT_ENDPOINT` 常數，例如：

```js
const CONTACT_ENDPOINT = "https://cgu-mec-studio-contact-form.<your-subdomain>.workers.dev";
```

之後表單送出就會真的打到這支 Worker，並由 Resend 寄信通知。
