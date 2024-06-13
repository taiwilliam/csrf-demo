const options = {
  maxAge: 1000 * 60 * 15, // 時限
  httpOnly: false, // 限制只能由http訪問
  domain: "127.0.0.1", // cookie 在哪個網域上有效
  secure: true, // 只透過 https 發送 cookie
  path: "/", // cookie 有效的位置
  sameSite: "none", // "strict" | "lax" | "none"（安全必須為真） 當請求來自於同源時才發送
};

// @解決方案一 定義cookie sameSite
// sameSite: "lax"

module.exports = {
  options
}