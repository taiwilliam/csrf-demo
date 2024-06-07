const btnEl = $(".js-login-submit");
const URL = "http://127.0.0.1:9001";
const HOME_URL = "/";
const LOGIN_URL = `${URL}/login`;

btnEl.on("click", (event) => {
  event.stopPropagation();
  const form = $(event.target).closest("form");
  const data = getFormData(form);
  const url = LOGIN_URL;

  $.post(url, data).done(loginSuccessTodo).fail(loginErrorTodo);
});

function loginSuccessTodo() {
  // 登入成功跳轉到首頁
  location.href = HOME_URL;
}

function loginErrorTodo(err) {
  const alertEl = $(".js-alert")
  alertEl.find(".alert__text").text(err.responseJSON.msg)

  alertEl.fadeIn(200);
  setTimeout(() => alertEl.fadeOut(200), 3000)
}

function getFormData($form) {
  const unIndexed_array = $form.serializeArray();
  const indexed_obj = {};

  $.map(unIndexed_array, function (n, i) {
    indexed_obj[n["name"]] = n["value"];
  });

  return indexed_obj;
}
