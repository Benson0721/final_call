# Final Call 第三關｜入境申報快問快答

為「Runway Go! 2026 桃機活力嘉年華」Final Call 第三關製作的平板答題程式。介面以入境查驗、紅綠通道與護照章為視覺主題。

## 遊戲規則

- 題庫共 100 題，分成酒類、臺幣現金、外幣現金、購物與綜合五類，每類 20 題。
- 每輪由五類各隨機抽一題，並隨機排列出題順序。
- 連續答對五題即通關；答錯會立即歸零並重新建立一輪。
- 不登入、不儲存參賽紀錄，也不需要後端服務。

## 本機執行

需要 Node.js 與 pnpm。

```bash
pnpm install
pnpm dev
```

測試與正式打包：

```bash
pnpm test
pnpm build
pnpm preview
```

正式檔案會輸出至 `dist/`。

## 可調整設定

主要設定在 `src/config.ts`：

- `flowMode: "race"`：答題後短暫顯示答案，再自動前進，適合競速。
- `flowMode: "guided"`：答題後由參賽者按「下一題／重新開始」。
- `countdownSeconds`：開始前倒數秒數。
- `correctFeedbackMs`、`wrongFeedbackMs`：競速模式的答案回饋停留時間。

題庫與分類資料在 `src/questions.ts`，抽題與題庫驗證在 `src/game.ts`。

## PWA 與 APK

專案已包含 Web App Manifest、192／512 圖示與離線 Service Worker。PWA 首次安裝仍須經由 `localhost` 或 HTTPS 網址開啟；完成首次載入後可離線使用。若後續要包成 Android APK，可直接將同一份 `dist/` 接入 Capacitor，不需要重寫遊戲邏輯。

更新前端檔案並重新發佈時，請同步提高 `public/sw.js` 的 `CACHE_NAME`，避免平板沿用舊快取。
