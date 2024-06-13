const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path");
const cookie = require("./constant/cookies");
const authService = require("./services/auth");
const userService = require("./services/user");
const recordService = require("./services/record");
const globalService = require("./services/global");
const transferService = require("./services/transfer");
const errMsgMap = require("./constant/errorMessageMap");
const app = express();
const { DOMAIN, PORT } = require("./constant/index");

// @解決方案二 驗證 origin
// app.use(function(req, res, next) {
//   // 當POST時 要驗證是否為跨預請求 若是跨預則阻擋
//   if(req.method == "POST" && !DOMAIN.includes(req.get('origin'))) return res.status(403).json({ msg: "無權限" });
//   next()
// })

// @解決方案三 驗證 referer
// app.use(function(req, res, next) {
//   if(req.method == "POST" && !DOMAIN.includes(req.get('referer'))) return res.status(403).json({ msg: "無權限" });
//   next()
// })

// 安裝middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// 暴露靜態資源
app.use(express.static(__dirname + "/views"));

// 登入頁面
app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "/views/login/index.html"))
);
// 首頁
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/views/home/index.html"))
);

// 登入
app.post("/login", async (req, res, next) => {
  // 1. 驗證
  const user = await authService.loginGate(req);

  // 2. 錯誤處理
  if (user === undefined) return next({ status: 403, code: 0 });

  // 3. 持久化
  const session = await authService.createLoginSession(user.id);

  // 4. 設定cookie
  res.cookie("et_session", session, cookie.options);

  return res.json({ msg: "登入成功" });
});

// 獲取用戶資訊
app.post("/user", async (req, res, next) => {
  // 1. 驗證
  if (req.cookies.et_session === undefined)
    return next({ status: 403, code: 1 });
  const session = await authService.sessionGate(req);
  if (session === undefined) return next({ status: 403, code: 1 });

  // 2. 獲取資料
  const user = await userService.getUser(session.id);

  return res.json({ data: user, msg: "成功" });
});

// 紀錄
app.post("/record", async (req, res, next) => {
  // 1. 驗證
  if (req.cookies.et_session === undefined)
    return next({ status: 403, code: 1 });
  const session = await authService.sessionGate(req);
  if (session === undefined) return next({ status: 403, code: 1 });

  // 2. 獲取資料
  const record = await recordService.getRecord(session.id);

  return res.json({ data: record, msg: "成功" });
});

// 匯款
app.post("/transfer", async (req, res, next) => {
  // 1. 驗證
  if (req.cookies.et_session === undefined)
    return next({ status: 403, code: 1 });
  const session = await authService.sessionGate(req);
  if (session === undefined) return next({ status: 403, code: 1 });

  // 2. 執行
  const result = await transferService.transfer(req, session.id);

  if (result.status !== 200)
    return next({ status: result.status, code: result.code });

  return res.json({ msg: "成功" });
});

// 重置資料庫
app.post("/reset", async (req, res, next) => {
  // 1. 驗證
  if (req.cookies.et_session === undefined)
    return next({ status: 403, code: 1 });
  const session = await authService.sessionGate(req);
  if (session === undefined) return next({ status: 403, code: 1 });

  // 2. 重製資料庫
  await globalService.resetDB(req);

  return res.json({ msg: "成功" });
});


// 錯誤處理
app.use((err, req, res, next) => {
  const status = err.status;
  const code = err.code;
  const errMsg = errMsgMap?.[code];
  let message = errMsg ? errMsg : "未知的錯誤";

  return res.status(status).json({ msg: message });
});

app.listen(PORT, () => {
  console.log("server start!");
});
