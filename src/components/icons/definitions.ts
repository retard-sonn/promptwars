export const iconNames = [
  "shield",
  "shield-check",
  "shield-alert",
  "message",
  "message-alert",
  "chat",
  "email",
  "link",
  "link-broken",
  "hook",
  "scan",
  "loupe",
  "bank",
  "parcel",
  "government-building",
  "phone",
  "phone-call",
  "qr",
  "rupee-pay",
  "key",
  "otp-field",
  "lock",
  "unlock",
  "eye",
  "flag",
  "report",
  "share",
  "clock",
  "globe",
  "user-alert",
  "id-card",
  "money",
  "screenshot",
  "check",
  "cross",
  "warning",
  "info",
  "copy",
  "arrow-up-right",
] as const;

export type IconName = (typeof iconNames)[number];
export type IconDefinition = { path: string; fill: string; accent?: string };

export const iconDefinitions: Record<IconName, IconDefinition> = {
  shield: {
    path: "M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6Z",
    fill: "M12 5 18 7.5V12c0 3.5-2.4 5.8-6 6.8Z",
  },
  "shield-check": {
    path: "M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6Zm-4 9 2.5 2.5L16 9",
    fill: "M12 5 18 7.5V12c0 3-1.8 5.1-4 6.2l-3-3.2 4-4Z",
  },
  "shield-alert": {
    path: "M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6Zm0 5v5m0 3v.1",
    fill: "M12 5 18 7.5V12c0 3.5-2.4 5.8-6 6.8Z",
  },
  message: { path: "M4 5h16v12H9l-5 4Z", fill: "M6 7h12v2H6Z", accent: "M6 7h8" },
  "message-alert": { path: "M4 5h16v12H9l-5 4Zm8 3v4m0 2v.1", fill: "M6 7h5v8H6Z" },
  chat: { path: "M3 5h13v10H8l-5 4Zm13 4h5v8l-3-2h-5", fill: "M5 7h9v2H5Z" },
  email: { path: "M3 5h18v14H3Zm1 1 8 7 8-7", fill: "m5 7 7 6 7-6v2l-7 6-7-6Z" },
  link: {
    path: "m9 15 6-6m-6 0-2 2a4 4 0 0 0 6 6l2-2m0-6 2-2a4 4 0 0 0-6-6l-2 2",
    fill: "M14 3h4v4h-4Z",
  },
  "link-broken": {
    path: "m9 15 3-3m3-3 2-2a4 4 0 0 0-6-6l-2 2m0 12-2 2a4 4 0 0 1-6-6l2-2m8-8v4m-4 14v-4M3 8h4m14 8h-4",
    fill: "M18 13h4v4h-4Z",
  },
  hook: {
    path: "M12 3v10a5 5 0 0 0 10 0v-2m-10-9a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
    fill: "M17 12h5v3h-5Z",
  },
  scan: { path: "M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M7 12h10", fill: "M7 10h10v4H7Z" },
  loupe: {
    path: "M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 6 6",
    fill: "M5 5a6 6 0 0 1 8-1l-5 8a6 6 0 0 1-3-7Z",
  },
  bank: { path: "m3 9 9-6 9 6ZM5 10v7m5-7v7m4-7v7m5-7v7M3 20h18", fill: "m6 9 6-4 6 4Z" },
  parcel: {
    path: "m4 7 8-4 8 4v10l-8 4-8-4Zm0 0 8 4 8-4m-8 4v10m-4-16 8 4",
    fill: "m12 11 8-4v5l-8 4Z",
  },
  "government-building": {
    path: "M4 21h16M5 18h14M6 10v7m4-7v7m4-7v7m4-7v7M3 8l9-5 9 5Zm1 0v2h16V8",
    fill: "m6 8 6-3 6 3Z",
  },
  phone: { path: "M7 2h10v20H7Zm3 16h4", fill: "M9 4h6v2H9Z" },
  "phone-call": {
    path: "M7 2h10v20H7Zm3 16h4m3-14a5 5 0 0 1 5 5m-4-7a8 8 0 0 1 7 7",
    fill: "M9 4h6v2H9Z",
  },
  qr: {
    path: "M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h3v3h-3Zm4 4h3v3h-3ZM5 5h3v3H5Zm11 0h3v3h-3ZM5 16h3v3H5Z",
    fill: "M14 14h3v3h-3Z",
  },
  "rupee-pay": {
    path: "M6 3h12M6 8h12M8 3c7 0 7 10 0 10h2l6 8M3 18h3v3H3Z",
    fill: "M4 17h3v5H4Z",
  },
  key: {
    path: "M14 3a7 7 0 1 0-6.7 9L3 16v5h5l2-2v-3h3l2-2A7 7 0 0 0 14 3Zm0 4v.1",
    fill: "M15 4a5 5 0 0 1 3 8l-3-2Z",
  },
  "otp-field": { path: "M3 5h18v14H3Zm4 7v.1m5-.1v.1m5-.1v.1", fill: "M5 7h16v3H5Z" },
  lock: { path: "M5 10h14v11H5Zm3 0V7a4 4 0 0 1 8 0v3m-4 4v3", fill: "M7 12h12v3H7Z" },
  unlock: { path: "M5 10h14v11H5Zm3 0V7a4 4 0 0 1 8 0m-8 7v3", fill: "M7 12h12v3H7Z" },
  eye: {
    path: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
    fill: "M12 9a3 3 0 0 1 3 3l-6 1a3 3 0 0 1 3-4Z",
  },
  flag: { path: "M5 22V3m0 1h13l-3 4 3 4H5", fill: "M6 5h10l-2 3 2 3H6Z" },
  report: { path: "M5 2h10l4 4v16H5Zm9 0v5h5M8 12h8m-8 4h6", fill: "M8 7h4v3H8Z" },
  share: { path: "M12 15V3m-4 4 4-4 4 4M5 12v9h14v-9", fill: "M7 15h10v4H7Z" },
  clock: {
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 5v5l4 2",
    fill: "M12 4a8 8 0 0 1 7 5l-7 3Z",
  },
  globe: {
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-9 10h18M12 2c4 5 4 15 0 20-4-5-4-15 0-20Z",
    fill: "M4 7c3-4 7-4 9-3L8 11H3Z",
  },
  "user-alert": {
    path: "M9 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM2 21v-3a7 7 0 0 1 12-5m5-4v5m0 3v.1",
    fill: "M5 5a4 4 0 0 1 7-1L8 9a4 4 0 0 1-3-4Z",
  },
  "id-card": {
    path: "M2 5h20v14H2Zm4 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-1 7a3 3 0 0 1 6 0m3-6h5m-5 4h5",
    fill: "M13 7h6v2h-6Z",
  },
  money: {
    path: "M3 5h18v14H3Zm9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM6 8H5v1m13-1h1v1M6 16H5v-1m13 1h1v-1",
    fill: "M12 8a4 4 0 0 1 4 4l-8 2a4 4 0 0 1 4-6Z",
  },
  screenshot: {
    path: "M7 2h10v20H7ZM4 6H2v5m20-5h2v5M2 18v4h5m15-4v4h-5",
    fill: "M9 5h6v10H9Z",
  },
  check: { path: "m4 12 5 5L20 6", fill: "m9 13 3 3 4-5-3 2Z" },
  cross: { path: "m6 6 12 12M18 6 6 18", fill: "m6 6 4 4-4 4Z" },
  warning: { path: "m12 3 10 18H2Zm0 6v5m0 3v.1", fill: "m12 6 6 11H6Z" },
  info: {
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 10v6m0-11v.1",
    fill: "M12 4a8 8 0 0 1 7 5l-7 2Z",
  },
  copy: { path: "M8 8h13v13H8ZM5 16H3V3h13v2", fill: "M10 10h9v3h-9Z" },
  "arrow-up-right": { path: "M6 18 18 6M7 6h11v11", fill: "M13 6h5v5Z" },
};
