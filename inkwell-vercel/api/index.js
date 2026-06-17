const APP_HTML = String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>illegal-whale — DeepSeek Chat</title>
  <meta name="description" content="illegal-whale, an orca-inspired AI chat app powered by DeepSeek." />
  <style>
    :root {
      color-scheme: light;
      --font: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --bg: #f7f7f3;
      --bg-2: #ecede8;
      --sidebar: #efefea;
      --surface: rgba(255,255,255,.78);
      --surface-strong: #fffef9;
      --surface-soft: rgba(255,255,255,.58);
      --text: #080b0e;
      --muted: #66707a;
      --muted-2: #8b949e;
      --hairline: rgba(8, 11, 14, .10);
      --shadow: 0 22px 70px rgba(6, 10, 16, .12);
      --shadow-soft: 0 12px 34px rgba(6, 10, 16, .10);
      --user: rgba(8, 11, 14, .055);
      --assistant: rgba(255,255,255,.52);
      --danger: #d34848;
      --success: #167b5b;
      --grad: linear-gradient(135deg, #080b0e 0%, #303840 42%, #62d7ff 72%, #9b7bff 100%);
      --grad-soft: linear-gradient(135deg, rgba(8,11,14,.09), rgba(98,215,255,.13), rgba(155,123,255,.12));
      --on-grad: #ffffff;
      --focus: 0 0 0 4px rgba(98, 215, 255, .18), 0 0 0 1px rgba(8, 11, 14, .42);
      --radius-xs: 12px;
      --radius-sm: 16px;
      --radius-md: 22px;
      --radius-lg: 28px;
      --radius-xl: 36px;
      --sidebar-w: 304px;
    }

    [data-theme="dark"] {
      color-scheme: dark;
      --bg: #050608;
      --bg-2: #0b0d10;
      --sidebar: #080a0d;
      --surface: rgba(255,255,255,.065);
      --surface-strong: rgba(255,255,255,.092);
      --surface-soft: rgba(255,255,255,.048);
      --text: #f7f8fa;
      --muted: #a7afb7;
      --muted-2: #7e8790;
      --hairline: rgba(255,255,255,.095);
      --shadow: 0 28px 88px rgba(0, 0, 0, .44);
      --shadow-soft: 0 16px 46px rgba(0, 0, 0, .30);
      --user: rgba(255,255,255,.09);
      --assistant: rgba(255,255,255,.04);
      --danger: #ff8585;
      --success: #6de0b4;
      --grad: linear-gradient(135deg, #ffffff 0%, #dfe7ed 38%, #6adfff 72%, #a183ff 100%);
      --grad-soft: linear-gradient(135deg, rgba(255,255,255,.10), rgba(106,223,255,.13), rgba(161,131,255,.12));
      --on-grad: #050608;
      --focus: 0 0 0 4px rgba(106, 223, 255, .24), 0 0 0 1px rgba(255, 255, 255, .48);
    }

    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      overflow: hidden;
      background:
        radial-gradient(circle at 14% -8%, rgba(255,255,255,.10), transparent 29rem),
        radial-gradient(circle at 90% 6%, rgba(98,215,255,.13), transparent 28rem),
        radial-gradient(circle at 74% 78%, rgba(155,123,255,.07), transparent 32rem),
        linear-gradient(135deg, var(--bg) 0%, var(--bg-2) 100%);
      color: var(--text);
      font-family: var(--font);
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }
    button, input, textarea, select { font: inherit; }
    button { cursor: pointer; }
    button:disabled { cursor: not-allowed; opacity: .62; }
    :focus-visible { outline: none; box-shadow: var(--focus); }

    .app {
      display: grid;
      grid-template-columns: var(--sidebar-w) minmax(0, 1fr);
      height: 100dvh;
      min-height: 0;
      transition: grid-template-columns .24s ease;
    }
    .app.nav-collapsed { grid-template-columns: 0 minmax(0, 1fr); }
    .app.nav-collapsed .sidebar { border-right-color: transparent; }

    .sidebar {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 18px;
      padding: 18px 16px;
      background: color-mix(in srgb, var(--sidebar) 94%, transparent);
      border-right: 1px solid var(--hairline);
      transition: transform .22s ease, width .22s ease, padding .22s ease;
      z-index: 50;
    }
    .sidebar.collapsed {
      width: 0;
      padding-inline: 0;
      overflow: hidden;
      transform: translateX(-100%);
      pointer-events: none;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 8px 12px;
      min-height: 52px;
    }
    .spark {
      inline-size: 38px;
      block-size: 38px;
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      border-radius: 16px;
      background: var(--grad);
      box-shadow: 0 10px 22px rgba(111, 132, 255, .28);
      color: var(--on-grad);
    }
    .spark svg { width: 22px; height: 22px; }
    .brand h1 { margin: 0; font-size: 19px; letter-spacing: -.045em; line-height: 1.05; }
    .brand p { margin: 2px 0 0; color: var(--muted); font-size: 12px; }

    .side-action, .footer-btn, .top-btn, .icon-btn, .confirm-actions button, .settings-actions button, .memory-actions button {
      border: 0;
      border-radius: var(--radius-md);
      background: var(--surface);
      color: var(--text);
      transition: transform .16s ease, background .16s ease, box-shadow .16s ease, opacity .16s ease;
    }
    .side-action:hover, .footer-btn:hover, .top-btn:hover, .icon-btn:hover, .confirm-actions button:hover, .settings-actions button:hover, .memory-actions button:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-soft);
      background: var(--surface-strong);
    }
    .side-action {
      width: 100%;
      min-height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-weight: 700;
      background: var(--surface-strong);
      box-shadow: 0 10px 28px rgba(25, 38, 67, .06);
    }
    .plus { font-size: 22px; line-height: 1; background: var(--grad); -webkit-background-clip: text; background-clip: text; color: transparent; }

    .search-shell {
      position: relative;
    }
    .search-shell svg {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      color: var(--muted-2);
      pointer-events: none;
    }
    .search-shell input {
      width: 100%;
      height: 46px;
      border: 1px solid var(--hairline);
      border-radius: 999px;
      padding: 0 16px 0 44px;
      color: var(--text);
      background: var(--surface-soft);
      outline: none;
    }
    .search-shell input::placeholder, textarea::placeholder { color: var(--muted-2); }

    .chat-list {
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding-right: 4px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      scrollbar-width: thin;
    }
    .chat-item {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 4px;
      align-items: center;
      min-height: 48px;
      padding: 6px 7px 6px 14px;
      border-radius: 20px;
      color: var(--muted);
      border: 1px solid transparent;
      background: transparent;
    }
    .chat-item.active {
      color: var(--text);
      background: var(--grad-soft);
      border-color: rgba(124, 116, 255, .16);
    }
    .chat-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border: 0;
      background: transparent;
      color: inherit;
      text-align: left;
      padding: 7px 0;
      min-width: 0;
    }
    .chat-icon {
      width: 32px;
      height: 32px;
      border: 0;
      border-radius: 14px;
      background: transparent;
      color: var(--muted-2);
      display: grid;
      place-items: center;
    }
    .chat-icon:hover { background: var(--surface); color: var(--text); }

    .sidebar-footer {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      padding-top: 4px;
    }
    .footer-btn {
      min-height: 42px;
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      font-size: 13px;
      color: var(--muted);
      background: var(--surface-soft);
    }

    .main {
      position: relative;
      min-width: 0;
      display: grid;
      grid-template-rows: auto 1fr auto;
      height: 100dvh;
    }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      min-height: 72px;
      padding: 16px 24px 12px;
      border-bottom: 1px solid transparent;
    }
    .top-left, .top-right {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }
    .icon-btn, .top-btn {
      min-width: 42px;
      height: 42px;
      padding: 0 14px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: var(--surface-soft);
      color: var(--muted);
    }
    .icon-btn { border-radius: 16px; padding: 0; }
    .top-btn { border-radius: 999px; white-space: nowrap; }
    .model-picker {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 132px;
      height: 42px;
      padding: 0 10px 0 12px;
      border-radius: 999px;
      border: 1px solid var(--hairline);
      background: var(--surface-soft);
      color: var(--text);
      overflow: visible;
    }
    .model-glyph {
      width: 20px;
      height: 20px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      background: var(--grad-soft);
      color: var(--text);
      flex: 0 0 auto;
    }
    .model-picker select.sr-select {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      opacity: 0;
      pointer-events: none;
      appearance: none;
    }
    .model-button {
      border: 0;
      background: transparent;
      color: var(--text);
      min-width: 0;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0;
      font-weight: 790;
      white-space: nowrap;
    }
    .model-caret { opacity: .68; transition: transform .16s ease; }
    .model-picker.open .model-caret { transform: rotate(180deg); }
    .model-menu {
      position: absolute;
      top: calc(100% + 10px);
      left: 0;
      width: 212px;
      padding: 8px;
      border-radius: 22px;
      border: 1px solid var(--hairline);
      background: color-mix(in srgb, var(--surface-strong) 94%, var(--bg) 6%);
      box-shadow: var(--shadow);
      display: none;
      z-index: 90;
      backdrop-filter: blur(18px);
    }
    .model-picker.open .model-menu { display: grid; gap: 4px; animation: riseIn .16s ease both; }
    .model-option {
      width: 100%;
      border: 0;
      background: transparent;
      color: var(--muted);
      display: grid;
      grid-template-columns: 22px minmax(0, 1fr);
      align-items: center;
      gap: 10px;
      padding: 11px 12px;
      border-radius: 16px;
      text-align: left;
    }
    .model-option strong { color: var(--text); display: block; font-size: 14px; }
    .model-option small { display: block; margin-top: 2px; color: var(--muted-2); font-size: 12px; }
    .model-option:hover, .model-option.active { background: var(--grad-soft); color: var(--text); }
    .model-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      border: 1px solid var(--hairline);
      justify-self: center;
    }
    .model-option.active .model-dot { border: 0; background: var(--grad); box-shadow: 0 0 0 4px rgba(98,215,255,.12); }

    .messages {
      min-height: 0;
      overflow: auto;
      padding: 18px min(8vw, 96px) 28px;
      scroll-behavior: auto;
      overscroll-behavior: contain;
    }
    .messages-inner {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .empty-state {
      min-height: calc(100dvh - 220px);
      display: grid;
      align-content: center;
      justify-items: center;
      text-align: center;
      padding: 58px 24px 72px;
      transform: translateY(-2dvh);
    }
    .empty-state .spark { width: 58px; height: 58px; border-radius: 22px; margin-bottom: 22px; }
    .empty-state h2 {
      margin: 0;
      display: inline-block;
      padding-bottom: .08em;
      font-size: clamp(40px, 5.8vw, 66px);
      font-weight: 820;
      letter-spacing: -.045em;
      line-height: 1.08;
      text-wrap: balance;
      background: linear-gradient(100deg, var(--text) 0%, var(--text) 34%, #6adfff 62%, #a183ff 92%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .empty-state p {
      margin: 8px 0 0;
      max-width: 580px;
      color: var(--muted);
      font-size: 15.5px;
      line-height: 1.7;
      text-wrap: balance;
    }

    .message {
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr);
      gap: 14px;
      align-items: start;
    }
    .message.is-new { animation: riseIn .24s ease both; }
    .message.user {
      grid-template-columns: minmax(0, .82fr) 38px;
      justify-content: end;
      margin-left: auto;
      width: min(760px, 100%);
    }
    .avatar {
      width: 38px;
      height: 38px;
      border-radius: 16px;
      display: grid;
      place-items: center;
      color: #fff;
      background: var(--grad);
      box-shadow: 0 12px 24px rgba(111, 132, 255, .20);
    }
    .avatar.user-avatar {
      background: var(--surface-strong);
      color: var(--muted);
      border: 1px solid var(--hairline);
      box-shadow: none;
    }
    .message.user .avatar { grid-column: 2; grid-row: 1; }
    .message.user .content { grid-column: 1; grid-row: 1; }
    .content {
      min-width: 0;
      padding: 12px 4px;
      line-height: 1.72;
      color: var(--text);
      font-size: 15.5px;
    }
    .content.assistant-content {
      background: var(--assistant);
      border-radius: var(--radius-lg);
      padding: 18px 20px;
      border: 1px solid var(--hairline);
    }
    .content.user-content {
      background: var(--user);
      border: 1px solid var(--hairline);
      border-radius: 26px;
      padding: 15px 18px;
      box-shadow: 0 10px 24px rgba(25, 38, 67, .04);
    }
    .content p { margin: 0 0 12px; }
    .content p:last-child { margin-bottom: 0; }
    .content pre {
      overflow: auto;
      border-radius: 18px;
      border: 1px solid var(--hairline);
      padding: 14px;
      background: color-mix(in srgb, var(--bg-2) 85%, #000 0%);
      line-height: 1.5;
    }
    .content code {
      border-radius: 8px;
      padding: 2px 5px;
      background: color-mix(in srgb, var(--bg-2) 90%, #000 0%);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: .92em;
    }
    .content pre code { padding: 0; background: transparent; }
    .thinking {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      color: var(--muted);
      min-height: 28px;
    }
    .thinking-dot {
      width: 9px;
      height: 9px;
      border-radius: 999px;
      background: var(--grad);
      animation: pulse 1.2s ease-in-out infinite;
      flex: 0 0 auto;
    }
    .thinking-body {
      display: inline-flex;
      flex-direction: column;
      gap: 6px;
    }
    .thinking-label {
      font-size: 14px;
      line-height: 1.2;
      color: var(--muted);
    }
    .thinking-shimmer {
      width: 142px;
      height: 10px;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(106,167,255,.16), rgba(189,108,255,.32), rgba(106,167,255,.16));
      background-size: 220% 100%;
      animation: shimmer 1.3s ease-in-out infinite;
    }

    .composer-wrap {
      padding: 0 min(8vw, 96px) 22px;
    }
    .composer {
      max-width: 900px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 12px;
      align-items: end;
      padding: 12px;
      border-radius: 32px;
      background: var(--surface-strong);
      border: 1px solid var(--hairline);
      box-shadow: var(--shadow);
    }
    textarea {
      min-height: 48px;
      max-height: 180px;
      resize: none;
      border: 0;
      outline: none;
      border-radius: 24px;
      padding: 13px 14px 10px 16px;
      background: transparent;
      color: var(--text);
      line-height: 1.5;
    }
    .send-btn {
      width: 48px;
      height: 48px;
      border: 0;
      border-radius: 20px;
      display: grid;
      place-items: center;
      color: var(--on-grad);
      background: var(--grad);
      box-shadow: 0 14px 26px rgba(111, 132, 255, .32);
      transition: transform .16s ease, box-shadow .16s ease, filter .16s ease;
    }
    .send-btn:hover { transform: translateY(-1px); filter: saturate(1.08); box-shadow: 0 18px 32px rgba(111, 132, 255, .38); }
    .send-btn.stop { background: var(--surface-strong); color: var(--danger); border: 1px solid var(--hairline); box-shadow: none; }
    .composer-help {
      max-width: 900px;
      margin: 10px auto 0;
      text-align: center;
      color: var(--muted-2);
      font-size: 12px;
    }

    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(8, 11, 18, .34);
      backdrop-filter: blur(12px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 18px;
      z-index: 100;
    }
    .backdrop.open { display: flex; }
    .sheet, .dialog {
      width: min(640px, 100%);
      max-height: min(760px, 88dvh);
      overflow: auto;
      background: var(--surface-strong);
      border: 1px solid var(--hairline);
      border-radius: 32px;
      box-shadow: var(--shadow);
      padding: 24px;
      animation: riseIn .22s ease both;
    }
    .dialog { width: min(440px, 100%); }
    .sheet-head, .dialog-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: start;
      margin-bottom: 18px;
    }
    .sheet h2, .dialog h2 { margin: 0; font-size: 22px; letter-spacing: -.04em; }
    .sheet p, .dialog p { color: var(--muted); line-height: 1.6; margin: 8px 0 0; }
    .field { margin: 18px 0; }
    .field label { display: block; font-weight: 750; margin-bottom: 8px; }
    .field textarea, .field input[type="text"] {
      width: 100%;
      border: 1px solid var(--hairline);
      border-radius: 22px;
      background: var(--bg-2);
      padding: 14px 16px;
      color: var(--text);
      outline: none;
    }
    .field textarea { min-height: 136px; }
    .range-row, .toggle-row {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      color: var(--muted);
    }
    input[type="range"] { accent-color: #7c74ff; width: min(280px, 50%); }
    input[type="checkbox"] { accent-color: #7c74ff; width: 18px; height: 18px; }
    .settings-actions, .memory-actions, .confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    .primary, .danger-btn {
      min-height: 44px;
      padding: 0 18px;
      font-weight: 800;
    }
    .primary { color: var(--on-grad) !important; background: var(--grad) !important; }
    .danger-btn { color: #fff !important; background: var(--danger) !important; }
    .ghost { min-height: 44px; padding: 0 18px; color: var(--muted) !important; background: var(--surface-soft) !important; }
    .toast {
      position: fixed;
      left: 50%;
      bottom: 26px;
      transform: translateX(-50%) translateY(20px);
      background: var(--surface-strong);
      color: var(--text);
      border: 1px solid var(--hairline);
      border-radius: 999px;
      padding: 12px 18px;
      box-shadow: var(--shadow-soft);
      opacity: 0;
      pointer-events: none;
      transition: opacity .18s ease, transform .18s ease;
      z-index: 120;
    }
    .toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
    .mobile-scrim {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(8, 11, 18, .28);
      z-index: 40;
    }

    @keyframes riseIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(.78); opacity: .52; }
      50% { transform: scale(1); opacity: 1; }
    }
    @keyframes shimmer {
      from { background-position: 0% 50%; }
      to { background-position: 220% 50%; }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: .001ms !important; transition-duration: .001ms !important; scroll-behavior: auto !important; }
    }

    @media (max-width: 880px) {
      .app, .app.nav-collapsed { grid-template-columns: 1fr; }
      .sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: min(var(--sidebar-w), 86vw);
        transform: translateX(-105%);
        box-shadow: var(--shadow);
      }
      .sidebar.open { transform: translateX(0); }
      .sidebar.collapsed { width: min(var(--sidebar-w), 86vw); padding: 18px 16px; transform: translateX(-105%); }
      .mobile-scrim.open { display: block; }
      .topbar { padding-inline: 14px; gap: 8px; }
      .top-right { gap: 6px; }
      .top-btn span { display: none; }
      .messages { padding-inline: 14px; }
      .composer-wrap { padding-inline: 14px; padding-bottom: 14px; }
      .message.user { width: 100%; grid-template-columns: minmax(0, 1fr) 34px; }
      .message { grid-template-columns: 34px minmax(0, 1fr); gap: 10px; }
      .avatar { width: 34px; height: 34px; border-radius: 14px; }
      .content.assistant-content, .content.user-content { padding: 14px 15px; border-radius: 22px; }
    }

    @media (max-width: 560px) {
      .model-picker { max-width: 170px; min-width: 126px; }
      .model-menu { left: auto; right: 0; }
      .top-btn { min-width: 40px; padding-inline: 10px; }
      .composer { border-radius: 26px; padding: 9px; gap: 8px; }
      .send-btn { width: 44px; height: 44px; border-radius: 18px; }
      .empty-state { padding-inline: 8px; }
      .empty-state h2 { font-size: 42px; }
      .sidebar-footer { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="mobile-scrim" id="mobileScrim"></div>
  <div class="app" id="app">
    <aside class="sidebar" id="sidebar" aria-label="Sidebar">
      <div class="brand" aria-label="illegal-whale">
        <div class="spark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 2.8l1.5 5.1a3.9 3.9 0 0 0 2.6 2.6l5.1 1.5-5.1 1.5a3.9 3.9 0 0 0-2.6 2.6L12 21.2l-1.5-5.1a3.9 3.9 0 0 0-2.6-2.6L2.8 12l5.1-1.5a3.9 3.9 0 0 0 2.6-2.6L12 2.8z" fill="currentColor"/></svg>
        </div>
        <div>
          <h1>illegal-whale</h1>
          <p>Orca-clean DeepSeek chat</p>
        </div>
      </div>

      <button class="side-action" id="newChatBtn"><span class="plus">+</span> New conversation</button>

      <div class="search-shell">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10.8 18.1a7.3 7.3 0 1 1 0-14.6 7.3 7.3 0 0 1 0 14.6zm5.4-1.9 4.3 4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input id="searchInput" type="search" placeholder="Search conversations" aria-label="Search conversations" />
      </div>

      <div class="chat-list" id="chatList" aria-label="Recent chats"></div>

      <div class="sidebar-footer">
        <button class="footer-btn" id="memoryBtn">Memory</button>
        <button class="footer-btn" id="exportBtn">Export</button>
        <button class="footer-btn" id="settingsBtn">Settings</button>
        <button class="footer-btn" id="themeBtn">Dark mode</button>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <div class="top-left">
          <button class="icon-btn" id="sidebarToggle" aria-label="Toggle sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
          <div class="model-picker" id="modelPicker" aria-label="Model selector">
            <span class="model-glyph" aria-hidden="true">✦</span>
            <button class="model-button" id="modelButton" type="button" aria-haspopup="listbox" aria-expanded="false">
              <span id="modelLabel">V4 Flash</span>
              <svg class="model-caret" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <select id="modelSelect" class="sr-select" tabindex="-1" aria-hidden="true">
              <option value="deepseek-v4-flash">V4 Flash</option>
              <option value="deepseek-v4-pro">V4 Pro</option>
            </select>
            <div class="model-menu" id="modelMenu" role="listbox" aria-label="Choose DeepSeek model">
              <button class="model-option" type="button" role="option" data-model="deepseek-v4-flash"><span class="model-dot"></span><span><strong>V4 Flash</strong><small>Fast, efficient replies</small></span></button>
              <button class="model-option" type="button" role="option" data-model="deepseek-v4-pro"><span class="model-dot"></span><span><strong>V4 Pro</strong><small>Deeper reasoning</small></span></button>
            </div>
          </div>
        </div>
        <div class="top-right">
          <button class="top-btn" id="regenerateBtn"><span>Regenerate</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 12a8 8 0 1 1-2.35-5.65M20 4v5h-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          <button class="top-btn" id="clearBtn"><span>Clear</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 7h12m-10 0 1 13h6l1-13M9 7V4h6v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        </div>
      </header>

      <section class="messages" id="messages" aria-live="polite" aria-label="Messages">
        <div class="messages-inner" id="messagesInner"></div>
      </section>

      <div class="composer-wrap">
        <form class="composer" id="composer">
          <textarea id="promptInput" rows="1" placeholder="Ask illegal-whale anything..." aria-label="Message illegal-whale"></textarea>
          <button class="send-btn" id="sendBtn" type="submit" aria-label="Send message">
            <svg id="sendIcon" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="m5 12 14-7-7 14-1.9-5.1L5 12z" fill="currentColor"/><path d="m10.1 13.9 3.4-3.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          </button>
        </form>
        <div class="composer-help">illegal-whale can make mistakes. Review important answers before using them.</div>
      </div>
    </main>
  </div>

  <div class="backdrop" id="settingsModal" role="dialog" aria-modal="true" aria-labelledby="settingsTitle">
    <section class="sheet">
      <div class="sheet-head">
        <div><h2 id="settingsTitle">Settings</h2><p>Adjust the assistant behavior. Your DeepSeek API key stays on the server.</p></div>
        <button class="icon-btn" data-close="settingsModal" aria-label="Close settings">✕</button>
      </div>
      <div class="field">
        <label for="systemPrompt">System instructions</label>
        <textarea id="systemPrompt"></textarea>
      </div>
      <div class="field">
        <label for="temperature">Creativity</label>
        <div class="range-row"><span>Precise</span><input id="temperature" type="range" min="0" max="1.5" step="0.1" /><strong id="temperatureValue"></strong><span>Creative</span></div>
      </div>
      <div class="field toggle-row">
        <div><strong>Use Memory in prompts</strong><p>When enabled, your saved memory is included as private context.</p></div>
        <input id="useMemory" type="checkbox" />
      </div>
      <div class="settings-actions">
        <button class="ghost" type="button" data-close="settingsModal">Cancel</button>
        <button class="primary" id="saveSettingsBtn" type="button">Save settings</button>
      </div>
    </section>
  </div>

  <div class="backdrop" id="memoryModal" role="dialog" aria-modal="true" aria-labelledby="memoryTitle">
    <section class="sheet">
      <div class="sheet-head">
        <div><h2 id="memoryTitle">Memory</h2><p>Store persistent notes you want illegal-whale to consider in future chats on this device.</p></div>
        <button class="icon-btn" data-close="memoryModal" aria-label="Close memory">✕</button>
      </div>
      <div class="field">
        <label for="memoryText">Saved memory</label>
        <textarea id="memoryText" placeholder="Example: Prefer concise answers. Use Thai when I ask in Thai."></textarea>
      </div>
      <div class="memory-actions">
        <button class="ghost" id="clearMemoryBtn" type="button">Clear memory</button>
        <button class="primary" id="saveMemoryBtn" type="button">Save memory</button>
      </div>
    </section>
  </div>

  <div class="backdrop" id="confirmModal" role="dialog" aria-modal="true" aria-labelledby="confirmTitle">
    <section class="dialog">
      <div class="dialog-head"><div><h2 id="confirmTitle">Are you sure?</h2><p id="confirmText">This action cannot be undone.</p></div></div>
      <div class="confirm-actions">
        <button class="ghost" id="confirmCancel" type="button">Cancel</button>
        <button class="danger-btn" id="confirmOk" type="button">Confirm</button>
      </div>
    </section>
  </div>

  <div class="toast" id="toast" role="status"></div>

  <script>
    (function () {
      var STORAGE_KEY = 'illegal_whale_state_v1';
      var activeStream = null;
      var confirmResolver = null;

      var els = {
        body: document.body,
        sidebar: document.getElementById('sidebar'),
        mobileScrim: document.getElementById('mobileScrim'),
        sidebarToggle: document.getElementById('sidebarToggle'),
        newChatBtn: document.getElementById('newChatBtn'),
        searchInput: document.getElementById('searchInput'),
        chatList: document.getElementById('chatList'),
        messages: document.getElementById('messages'),
        messagesInner: document.getElementById('messagesInner'),
        composer: document.getElementById('composer'),
        promptInput: document.getElementById('promptInput'),
        sendBtn: document.getElementById('sendBtn'),
        sendIcon: document.getElementById('sendIcon'),
        modelPicker: document.getElementById('modelPicker'),
        modelButton: document.getElementById('modelButton'),
        modelLabel: document.getElementById('modelLabel'),
        modelMenu: document.getElementById('modelMenu'),
        modelSelect: document.getElementById('modelSelect'),
        regenerateBtn: document.getElementById('regenerateBtn'),
        clearBtn: document.getElementById('clearBtn'),
        memoryBtn: document.getElementById('memoryBtn'),
        exportBtn: document.getElementById('exportBtn'),
        settingsBtn: document.getElementById('settingsBtn'),
        themeBtn: document.getElementById('themeBtn'),
        settingsModal: document.getElementById('settingsModal'),
        memoryModal: document.getElementById('memoryModal'),
        confirmModal: document.getElementById('confirmModal'),
        confirmTitle: document.getElementById('confirmTitle'),
        confirmText: document.getElementById('confirmText'),
        confirmCancel: document.getElementById('confirmCancel'),
        confirmOk: document.getElementById('confirmOk'),
        systemPrompt: document.getElementById('systemPrompt'),
        temperature: document.getElementById('temperature'),
        temperatureValue: document.getElementById('temperatureValue'),
        useMemory: document.getElementById('useMemory'),
        saveSettingsBtn: document.getElementById('saveSettingsBtn'),
        memoryText: document.getElementById('memoryText'),
        saveMemoryBtn: document.getElementById('saveMemoryBtn'),
        clearMemoryBtn: document.getElementById('clearMemoryBtn'),
        toast: document.getElementById('toast'),
        app: document.getElementById('app')
      };

      function uid() {
        return 'id_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      }

      function defaultState() {
        var first = { id: uid(), title: 'New conversation', createdAt: Date.now(), updatedAt: Date.now(), messages: [] };
        return {
          activeId: first.id,
          conversations: [first],
          theme: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
          model: 'deepseek-v4-flash',
          memory: '',
          settings: {
            systemPrompt: 'You are illegal-whale, a clear, friendly AI assistant with a calm orca-inspired interface. Be helpful, concise, and practical.',
            temperature: 0.7,
            useMemory: true
          }
        };
      }

      function loadState() {
        try {
          var raw = localStorage.getItem(STORAGE_KEY);
          if (!raw) return defaultState();
          var parsed = JSON.parse(raw);
          if (!parsed.conversations || !parsed.conversations.length) return defaultState();
          parsed.settings = Object.assign(defaultState().settings, parsed.settings || {});
          parsed.model = parsed.model || 'deepseek-v4-flash';
          parsed.theme = parsed.theme || 'light';
          parsed.memory = parsed.memory || '';
          return parsed;
        } catch (err) {
          return defaultState();
        }
      }

      var state = loadState();
      var MODEL_NAMES = { 'deepseek-v4-flash': 'V4 Flash', 'deepseek-v4-pro': 'V4 Pro' };

      function saveState() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }

      function activeConversation() {
        var found = state.conversations.find(function (c) { return c.id === state.activeId; });
        if (found) return found;
        state.activeId = state.conversations[0].id;
        return state.conversations[0];
      }

      function conversationTitle(conversation) {
        if (conversation.title && conversation.title !== 'New conversation') return conversation.title;
        var firstUser = conversation.messages.find(function (m) { return m.role === 'user'; });
        if (!firstUser) return 'New conversation';
        return firstUser.content.slice(0, 44) + (firstUser.content.length > 44 ? '…' : '');
      }

      function applyTheme() {
        document.body.dataset.theme = state.theme;
        els.themeBtn.textContent = state.theme === 'dark' ? 'Light mode' : 'Dark mode';
      }

      function icon(name) {
        if (name === 'rename') return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 20h4l10.5-10.5a2.8 2.8 0 1 0-4-4L4 16v4zM13.5 6.5l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 7h12m-10 0 1 13h6l1-13M9 7V4h6v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      }

      function renderChatList() {
        var query = els.searchInput.value.trim().toLowerCase();
        var list = state.conversations
          .slice()
          .sort(function (a, b) { return b.updatedAt - a.updatedAt; })
          .filter(function (c) {
            return !query || conversationTitle(c).toLowerCase().indexOf(query) !== -1 || c.messages.some(function (m) { return m.content.toLowerCase().indexOf(query) !== -1; });
          });
        els.chatList.innerHTML = '';
        list.forEach(function (conversation) {
          var row = document.createElement('div');
          row.className = 'chat-item' + (conversation.id === state.activeId ? ' active' : '');
          var title = document.createElement('button');
          title.className = 'chat-title';
          title.textContent = conversationTitle(conversation);
          title.title = conversationTitle(conversation);
          title.addEventListener('click', function () {
            state.activeId = conversation.id;
            saveState();
            render();
            closeMobileSidebar();
          });
          var rename = document.createElement('button');
          rename.className = 'chat-icon';
          rename.setAttribute('aria-label', 'Rename chat');
          rename.innerHTML = icon('rename');
          rename.addEventListener('click', function () { renameChat(conversation.id); });
          var del = document.createElement('button');
          del.className = 'chat-icon';
          del.setAttribute('aria-label', 'Delete chat');
          del.innerHTML = icon('delete');
          del.addEventListener('click', function () { deleteChat(conversation.id); });
          row.appendChild(title);
          row.appendChild(rename);
          row.appendChild(del);
          els.chatList.appendChild(row);
        });
      }

      function escapeHtml(text) {
        return String(text)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      }

      function formatMessage(text, status) {
        if (!text) {
          var label = escapeHtml(status || 'Thinking quietly…');
          return '<span class="thinking"><span class="thinking-dot"></span><span class="thinking-body"><span class="thinking-label">' + label + '</span><span class="thinking-shimmer"></span></span></span>';
        }
        var escaped = escapeHtml(text);
        var tick = String.fromCharCode(96);
        var parts = escaped.split(tick + tick + tick);
        for (var i = 0; i < parts.length; i++) {
          if (i % 2 === 1) {
            parts[i] = '<pre><code>' + parts[i].replace(/^\w+\n/, '') + '</code></pre>';
          } else {
            parts[i] = parts[i]
              .replace(new RegExp(tick + '([^' + tick + ']+)' + tick, 'g'), '<code>$1</code>')
              .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
              .replace(/\n{2,}/g, '</p><p>')
              .replace(/\n/g, '<br>');
            parts[i] = '<p>' + parts[i] + '</p>';
          }
        }
        return parts.join('');
      }

      function avatar(role) {
        if (role === 'assistant') {
          return '<div class="avatar" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3.2l1.35 4.6a3.5 3.5 0 0 0 2.35 2.35L20.3 12l-4.6 1.35a3.5 3.5 0 0 0-2.35 2.35L12 20.8l-1.35-4.6a3.5 3.5 0 0 0-2.35-2.35L3.7 12l4.6-1.35a3.5 3.5 0 0 0 2.35-2.35L12 3.2z" fill="currentColor"/></svg></div>';
        }
        return '<div class="avatar user-avatar" aria-hidden="true"><svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>';
      }

      function isNearBottom() {
        return els.messages.scrollHeight - els.messages.scrollTop - els.messages.clientHeight < 140;
      }

      function scrollToBottom() {
        els.messages.scrollTop = els.messages.scrollHeight;
      }

      function messageSelector(id) {
        return '[data-message-id="' + String(id).replace(/"/g, '\"') + '"]';
      }

      function updateStreamingMessage(message) {
        var row = els.messagesInner.querySelector(messageSelector(message.id));
        if (!row) {
          renderMessages(false);
          return;
        }
        var content = row.querySelector('.content');
        if (content) content.innerHTML = formatMessage(message.content, message.status);
      }

      function renderMessages(animateLatest) {
        var conversation = activeConversation();
        els.messagesInner.innerHTML = '';
        if (!conversation.messages.length) {
          els.messagesInner.innerHTML = '<div class="empty-state"><div class="spark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2.8l1.5 5.1a3.9 3.9 0 0 0 2.6 2.6l5.1 1.5-5.1 1.5a3.9 3.9 0 0 0-2.6 2.6L12 21.2l-1.5-5.1a3.9 3.9 0 0 0-2.6-2.6L2.8 12l5.1-1.5a3.9 3.9 0 0 0 2.6-2.6L12 2.8z" fill="currentColor"/></svg></div><h2>How can illegal-whale help?</h2><p>Start a conversation with illegal-whale. Choose V4 Flash for speed or V4 Pro for deeper responses.</p></div>';
          return;
        }
        conversation.messages.forEach(function (message, index) {
          var wrap = document.createElement('article');
          var isLatest = animateLatest !== false && index === conversation.messages.length - 1;
          wrap.className = 'message ' + message.role + (isLatest ? ' is-new' : '');
          wrap.setAttribute('data-message-id', message.id);
          wrap.innerHTML = message.role === 'assistant'
            ? avatar('assistant') + '<div class="content assistant-content">' + formatMessage(message.content, message.status) + '</div>'
            : '<div class="content user-content">' + formatMessage(message.content) + '</div>' + avatar('user');
          els.messagesInner.appendChild(wrap);
        });
        requestAnimationFrame(scrollToBottom);
      }

      function updateModelPicker() {
        els.modelLabel.textContent = MODEL_NAMES[state.model] || 'V4 Flash';
        if (els.modelButton) els.modelButton.setAttribute('aria-expanded', els.modelPicker.classList.contains('open') ? 'true' : 'false');
        document.querySelectorAll('.model-option').forEach(function (option) {
          var active = option.getAttribute('data-model') === state.model;
          option.classList.toggle('active', active);
          option.setAttribute('aria-selected', active ? 'true' : 'false');
        });
      }

      function setModel(value) {
        if (!MODEL_NAMES[value]) value = 'deepseek-v4-flash';
        state.model = value;
        els.modelSelect.value = value;
        saveState();
        els.modelPicker.classList.remove('open');
        updateModelPicker();
      }

      function render() {
        applyTheme();
        els.modelSelect.value = state.model;
        updateModelPicker();
        renderChatList();
        renderMessages();
      }

      function newChat() {
        if (activeStream) stopStream();
        var blank = state.conversations.find(function (c) { return c.messages.length === 0; });
        if (blank) state.activeId = blank.id;
        else {
          var c = { id: uid(), title: 'New conversation', createdAt: Date.now(), updatedAt: Date.now(), messages: [] };
          state.conversations.unshift(c);
          state.activeId = c.id;
        }
        saveState();
        render();
        closeMobileSidebar();
        els.promptInput.focus();
      }

      function renameChat(id) {
        var c = state.conversations.find(function (item) { return item.id === id; });
        if (!c) return;
        var next = window.prompt('Rename conversation', conversationTitle(c));
        if (next === null) return;
        next = next.trim();
        if (!next) return;
        c.title = next;
        c.updatedAt = Date.now();
        saveState();
        renderChatList();
        toast('Conversation renamed');
      }

      function confirmDialog(title, message, okText) {
        els.confirmTitle.textContent = title;
        els.confirmText.textContent = message;
        els.confirmOk.textContent = okText || 'Confirm';
        els.confirmModal.classList.add('open');
        return new Promise(function (resolve) { confirmResolver = resolve; });
      }

      function resolveConfirm(value) {
        els.confirmModal.classList.remove('open');
        if (confirmResolver) confirmResolver(value);
        confirmResolver = null;
      }

      async function deleteChat(id) {
        var ok = await confirmDialog('Delete conversation?', 'This removes the selected conversation from this device.', 'Delete');
        if (!ok) return;
        state.conversations = state.conversations.filter(function (c) { return c.id !== id; });
        if (!state.conversations.length) {
          var c = { id: uid(), title: 'New conversation', createdAt: Date.now(), updatedAt: Date.now(), messages: [] };
          state.conversations.push(c);
        }
        if (state.activeId === id) state.activeId = state.conversations[0].id;
        saveState();
        render();
        toast('Conversation deleted');
      }

      async function clearActiveConversation() {
        var c = activeConversation();
        if (!c.messages.length) return;
        var ok = await confirmDialog('Clear this conversation?', 'Messages in the current conversation will be removed.', 'Clear');
        if (!ok) return;
        c.messages = [];
        c.updatedAt = Date.now();
        saveState();
        render();
      }

      function buildRequestMessages(conversation) {
        var system = state.settings.systemPrompt || 'You are illegal-whale, a helpful assistant.';
        if (state.settings.useMemory && state.memory.trim()) {
          system += '\n\nUser memory for this device:\n' + state.memory.trim();
        }
        var messages = [{ role: 'system', content: system }];
        conversation.messages.forEach(function (m) {
          if (m.role === 'user' || m.role === 'assistant') messages.push({ role: m.role, content: m.content });
        });
        return messages;
      }

      async function sendMessage(text, options) {
        if (activeStream) return;
        var conversation = activeConversation();
        var shouldAddUser = !options || options.addUser !== false;
        if (shouldAddUser) {
          conversation.messages.push({ id: uid(), role: 'user', content: text, createdAt: Date.now() });
          if (conversation.title === 'New conversation') conversation.title = text.slice(0, 44) + (text.length > 44 ? '…' : '');
        }
        var assistantMessage = { id: uid(), role: 'assistant', content: '', createdAt: Date.now() };
        conversation.messages.push(assistantMessage);
        conversation.updatedAt = Date.now();
        saveState();
        render();
        setStreaming(true);

        var controller = new AbortController();
        activeStream = controller;
        try {
          var res = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              model: state.model,
              temperature: Number(state.settings.temperature || 0.7),
              messages: buildRequestMessages(conversation)
            })
          });
          if (!res.ok || !res.body) {
            var errText = await res.text().catch(function () { return ''; });
            throw new Error(errText || 'The DeepSeek request failed.');
          }
          var reader = res.body.getReader();
          var decoder = new TextDecoder();
          var streamBuffer = '';
          var pendingText = '';
          var pendingFrame = null;
          var shouldAutoScroll = true;
          var lastStreamSave = Date.now();

          function setAssistantStatus(status) {
            assistantMessage.status = status || 'Thinking quietly…';
            if (!assistantMessage.content.trim()) updateStreamingMessage(assistantMessage);
          }

          function flushStreamPaint() {
            pendingFrame = null;
            if (pendingText) {
              assistantMessage.content += pendingText;
              pendingText = '';
              assistantMessage.status = 'Writing answer…';
            }
            updateStreamingMessage(assistantMessage);
            if (shouldAutoScroll) scrollToBottom();
            if (Date.now() - lastStreamSave > 1600) {
              lastStreamSave = Date.now();
              saveState();
            }
          }

          function scheduleStreamPaint() {
            if (pendingFrame) return;
            pendingFrame = requestAnimationFrame(flushStreamPaint);
          }

          function handleStreamLine(line) {
            var trimmed = line.trim();
            if (!trimmed) return;
            var event;
            try {
              event = JSON.parse(trimmed);
            } catch (_err) {
              // Legacy/plain-text fallback, useful during a deploy where the browser has old code cached.
              pendingText += line + '\n';
              scheduleStreamPaint();
              return;
            }
            if (event.type === 'status') {
              setAssistantStatus(event.status);
              return;
            }
            if (event.type === 'content') {
              if (event.text) {
                pendingText += event.text;
                assistantMessage.status = 'Writing answer…';
                scheduleStreamPaint();
              }
              return;
            }
            if (event.type === 'error') {
              throw new Error(event.message || 'The DeepSeek stream failed.');
            }
          }

          setAssistantStatus('Connecting to DeepSeek…');
          while (true) {
            var result = await reader.read();
            if (result.done) break;
            shouldAutoScroll = isNearBottom();
            streamBuffer += decoder.decode(result.value, { stream: true });
            var lines = streamBuffer.split('\n');
            streamBuffer = lines.pop() || '';
            for (var i = 0; i < lines.length; i++) handleStreamLine(lines[i]);
          }
          var finalTail = decoder.decode();
          if (finalTail) streamBuffer += finalTail;
          if (streamBuffer.trim()) handleStreamLine(streamBuffer);
          if (pendingFrame) {
            cancelAnimationFrame(pendingFrame);
            flushStreamPaint();
          }
          delete assistantMessage.status;
          if (!assistantMessage.content.trim()) assistantMessage.content = 'I did not receive any final text from the model. Try V4 Flash or ask for a shorter answer.';
          updateStreamingMessage(assistantMessage);
        } catch (err) {
          delete assistantMessage.status;
          if (err.name === 'AbortError') {
            if (!assistantMessage.content.trim()) assistantMessage.content = 'Stopped.';
          } else {
            var reason = err.message || 'Check your server environment variable DEEPSEEK_API_KEY.';
            if (assistantMessage.content.trim()) {
              assistantMessage.content += '

_Response stopped early because the stream connection was interrupted: ' + reason + '_';
            } else {
              assistantMessage.content = 'Sorry, illegal-whale could not reach DeepSeek. ' + reason;
            }
          }
          updateStreamingMessage(assistantMessage);
        } finally {
          activeStream = null;
          conversation.updatedAt = Date.now();
          saveState();
          setStreaming(false);
          render();
        }
      }

      function setStreaming(isStreaming) {
        if (isStreaming) {
          els.sendBtn.classList.add('stop');
          els.sendBtn.setAttribute('aria-label', 'Stop generating');
          els.sendIcon.innerHTML = '<rect x="7" y="7" width="10" height="10" rx="2" fill="currentColor"/>';
        } else {
          els.sendBtn.classList.remove('stop');
          els.sendBtn.setAttribute('aria-label', 'Send message');
          els.sendIcon.innerHTML = '<path d="m5 12 14-7-7 14-1.9-5.1L5 12z" fill="currentColor"/><path d="m10.1 13.9 3.4-3.4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>';
        }
      }

      function stopStream() {
        if (activeStream) activeStream.abort();
      }

      function regenerate() {
        if (activeStream) return;
        var c = activeConversation();
        var lastUserIndex = -1;
        for (var i = c.messages.length - 1; i >= 0; i--) {
          if (c.messages[i].role === 'user') { lastUserIndex = i; break; }
        }
        if (lastUserIndex < 0) return toast('Send a message first');
        var lastUserText = c.messages[lastUserIndex].content;
        c.messages = c.messages.slice(0, lastUserIndex + 1);
        saveState();
        sendMessage(lastUserText, { addUser: false });
      }

      function autoResize() {
        els.promptInput.style.height = 'auto';
        els.promptInput.style.height = Math.min(els.promptInput.scrollHeight, 180) + 'px';
      }

      function openModal(id) {
        if (id === 'settingsModal') {
          els.systemPrompt.value = state.settings.systemPrompt;
          els.temperature.value = state.settings.temperature;
          els.temperatureValue.textContent = state.settings.temperature;
          els.useMemory.checked = !!state.settings.useMemory;
        }
        if (id === 'memoryModal') {
          els.memoryText.value = state.memory;
        }
        document.getElementById(id).classList.add('open');
      }

      function closeModal(id) {
        document.getElementById(id).classList.remove('open');
      }

      function saveSettings() {
        state.settings.systemPrompt = els.systemPrompt.value.trim() || 'You are illegal-whale, a helpful assistant.';
        state.settings.temperature = Number(els.temperature.value);
        state.settings.useMemory = els.useMemory.checked;
        state.model = els.modelSelect.value;
        saveState();
        closeModal('settingsModal');
        toast('Settings saved');
      }

      function saveMemory() {
        state.memory = els.memoryText.value.trim();
        saveState();
        closeModal('memoryModal');
        toast('Memory saved');
      }

      function exportData() {
        var data = JSON.stringify(state, null, 2);
        var blob = new Blob([data], { type: 'application/json' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'illegal-whale-export-' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(a.href);
        a.remove();
        toast('Export downloaded');
      }

      function toast(message) {
        els.toast.textContent = message;
        els.toast.classList.add('show');
        clearTimeout(toast.timer);
        toast.timer = setTimeout(function () { els.toast.classList.remove('show'); }, 2200);
      }

      function toggleSidebar() {
        if (window.innerWidth <= 880) {
          els.sidebar.classList.toggle('open');
          els.mobileScrim.classList.toggle('open');
        } else {
          var collapsed = els.sidebar.classList.toggle('collapsed');
          els.app.classList.toggle('nav-collapsed', collapsed);
        }
      }

      function closeMobileSidebar() {
        els.sidebar.classList.remove('open');
        els.mobileScrim.classList.remove('open');
      }

      els.composer.addEventListener('submit', function (e) {
        e.preventDefault();
        if (activeStream) return stopStream();
        var text = els.promptInput.value.trim();
        if (!text) return;
        els.promptInput.value = '';
        autoResize();
        sendMessage(text);
      });
      els.promptInput.addEventListener('input', autoResize);
      els.promptInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          els.composer.requestSubmit();
        }
      });
      els.newChatBtn.addEventListener('click', newChat);
      els.searchInput.addEventListener('input', renderChatList);
      els.sidebarToggle.addEventListener('click', toggleSidebar);
      els.mobileScrim.addEventListener('click', closeMobileSidebar);
      els.modelSelect.addEventListener('change', function () { setModel(els.modelSelect.value); });
      els.modelButton.addEventListener('click', function () {
        els.modelPicker.classList.toggle('open');
        updateModelPicker();
      });
      document.querySelectorAll('.model-option').forEach(function (option) {
        option.addEventListener('click', function () { setModel(option.getAttribute('data-model')); });
      });
      document.addEventListener('click', function (e) {
        if (!els.modelPicker.contains(e.target)) {
          els.modelPicker.classList.remove('open');
          updateModelPicker();
        }
      });
      els.regenerateBtn.addEventListener('click', regenerate);
      els.clearBtn.addEventListener('click', clearActiveConversation);
      els.memoryBtn.addEventListener('click', function () { openModal('memoryModal'); });
      els.settingsBtn.addEventListener('click', function () { openModal('settingsModal'); });
      els.exportBtn.addEventListener('click', exportData);
      els.themeBtn.addEventListener('click', function () { state.theme = state.theme === 'dark' ? 'light' : 'dark'; saveState(); applyTheme(); });
      els.saveSettingsBtn.addEventListener('click', saveSettings);
      els.saveMemoryBtn.addEventListener('click', saveMemory);
      els.clearMemoryBtn.addEventListener('click', function () { els.memoryText.value = ''; state.memory = ''; saveState(); toast('Memory cleared'); });
      els.temperature.addEventListener('input', function () { els.temperatureValue.textContent = els.temperature.value; });
      document.querySelectorAll('[data-close]').forEach(function (button) { button.addEventListener('click', function () { closeModal(button.getAttribute('data-close')); }); });
      document.querySelectorAll('.backdrop').forEach(function (backdrop) {
        backdrop.addEventListener('click', function (e) { if (e.target === backdrop && backdrop.id !== 'confirmModal') closeModal(backdrop.id); });
      });
      els.confirmCancel.addEventListener('click', function () { resolveConfirm(false); });
      els.confirmOk.addEventListener('click', function () { resolveConfirm(true); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          closeMobileSidebar();
          ['settingsModal', 'memoryModal'].forEach(closeModal);
          if (els.confirmModal.classList.contains('open')) resolveConfirm(false);
        }
      });

      render();
      autoResize();
    })();
  </script>
</body>
</html>`;

function sendHtml(res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(APP_HTML);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch (err) { reject(new Error('Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(m => m && ['system', 'user', 'assistant'].includes(m.role) && typeof m.content === 'string')
    .slice(-40)
    .map(m => ({ role: m.role, content: m.content.slice(0, 24000) }));
}

function writeStreamEvent(res, event) {
  res.write(JSON.stringify(event) + '\n');
}

function shortenError(text) {
  return String(text || '').replace(/\s+/g, ' ').slice(0, 700);
}

async function handleChat(req, res) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Missing DEEPSEEK_API_KEY. Add it in Vercel Project Settings → Environment Variables.');
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(err.message);
    return;
  }

  const allowedModels = new Set(['deepseek-v4-flash', 'deepseek-v4-pro']);
  const model = allowedModels.has(body.model) ? body.model : 'deepseek-v4-flash';
  const temperature = Math.max(0, Math.min(1.5, Number(body.temperature ?? 0.7)));
  const messages = normalizeMessages(body.messages);

  if (!messages.length || !messages.some(m => m.role === 'user')) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('At least one user message is required.');
    return;
  }

  const deepSeekBody = {
    model,
    messages,
    temperature,
    stream: true,
    max_tokens: model === 'deepseek-v4-pro' ? 8192 : 4096
  };

  if (model === 'deepseek-v4-pro') {
    deepSeekBody.thinking = { type: 'enabled' };
    deepSeekBody.reasoning_effort = 'medium';
  } else {
    deepSeekBody.thinking = { type: 'disabled' };
  }

  res.writeHead(200, {
    'Content-Type': 'application/x-ndjson; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });
  if (typeof res.flushHeaders === 'function') res.flushHeaders();

  let closed = false;
  const abortUpstream = new AbortController();
  req.on('aborted', () => {
    closed = true;
    abortUpstream.abort();
  });
  res.on('close', () => {
    if (!res.writableEnded) {
      closed = true;
      abortUpstream.abort();
    }
  });

  let beat = 0;
  function status(text) {
    if (!closed) writeStreamEvent(res, { type: 'status', status: text });
  }
  status('Connecting to DeepSeek…');
  const heartbeat = setInterval(() => {
    beat += 1;
    const labels = ['Still thinking quietly…', 'Working on the long answer…', 'Keeping the stream alive…'];
    status(labels[beat % labels.length]);
  }, 6000);

  let upstream;
  try {
    upstream = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      signal: abortUpstream.signal,
      body: JSON.stringify(deepSeekBody)
    });
  } catch (err) {
    clearInterval(heartbeat);
    if (!closed) {
      writeStreamEvent(res, { type: 'error', message: 'DeepSeek connection error: ' + shortenError(err.message) });
      res.end();
    }
    return;
  }

  if (!upstream.ok || !upstream.body) {
    clearInterval(heartbeat);
    const errorText = await upstream.text().catch(() => '');
    if (!closed) {
      writeStreamEvent(res, { type: 'error', message: 'DeepSeek API error (' + upstream.status + '): ' + shortenError(errorText || upstream.statusText) });
      res.end();
    }
    return;
  }

  status(model === 'deepseek-v4-pro' ? 'Reasoning quietly…' : 'Writing answer…');

  const decoder = new TextDecoder();
  let buffer = '';
  let lastReasoningNotice = 0;
  try {
    for await (const chunk of upstream.body) {
      if (closed) break;
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          const choice = parsed.choices && parsed.choices[0] ? parsed.choices[0] : {};
          const delta = choice.delta || {};
          if (delta.reasoning_content && Date.now() - lastReasoningNotice > 2500) {
            lastReasoningNotice = Date.now();
            status('Reasoning quietly…');
          }
          if (delta.content) {
            writeStreamEvent(res, { type: 'content', text: delta.content });
          }
        } catch (_err) {
          // Ignore keepalive or malformed SSE fragments.
        }
      }
    }
    const tail = decoder.decode();
    if (tail) buffer += tail;
    if (!closed) writeStreamEvent(res, { type: 'done' });
  } catch (err) {
    if (!closed) writeStreamEvent(res, { type: 'error', message: 'Stream interrupted: ' + shortenError(err.message) });
  } finally {
    clearInterval(heartbeat);
    if (!closed) res.end();
  }
}

module.exports = async function handler(req, res) {
  const url = new URL(req.url, 'https://illegal-whale.local');
  if (req.method === 'POST' && (url.pathname === '/chat' || url.pathname === '/api/index.js' || url.pathname === '/api/chat')) {
    return handleChat(req, res);
  }
  if (req.method === 'GET') return sendHtml(res);
  res.statusCode = 405;
  res.setHeader('Allow', 'GET, POST');
  res.end('Method not allowed');
};
