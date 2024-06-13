const URL = "http://127.0.0.1:9001";
const LOGIN_URL = "/login";
const GET_USER_URL = `${URL}/user`;
const GET_RECORD_URL = `${URL}/record`;
const POST_TRANSFER_URL = `${URL}/transfer`;
const POST_RESET_URL = `${URL}/reset`;

$(document).ready(() => {
  fetchAll();
});

function fetchAll() {
  fetchUser();
  fetchRecord();
}

$(".js-reset-submit").on("click", (event) => {
  event.stopPropagation();
  btnDisabled(true);
  const url = POST_RESET_URL;

  $.post(url)
    .done(transferSuccessTodo)
    .fail(transferErrorTodo)
    .always(btnDisabled(false));
});

$(".js-transfer-submit").on("click", (event) => {
  event.stopPropagation();
  btnDisabled(true);
  const form = $(event.target).closest("form");
  const data = getFormData(form);
  const url = POST_TRANSFER_URL;

  $.post(url, data)
    .done(transferSuccessTodo)
    .fail(transferErrorTodo)
    .always(btnDisabled(false));
});

function transferSuccessTodo(res) {
  resetTransferForm();
  fetchAll();
}

function transferErrorTodo(err) {
  errAlert(err.responseJSON.msg);
}

function fetchUser() {
  $.post(GET_USER_URL).done(fetchUserSuccessTodo).fail(errorTodo);
}

function fetchUserSuccessTodo(res) {
  renderUser(res.data);
}

function errorTodo(err) {
  if (err.status === 403) location.href = LOGIN_URL;
}

function fetchRecord() {
  $.post(GET_RECORD_URL).done(fetchRecordSuccessTodo).fail(errorTodo);
}

function fetchRecordSuccessTodo(res) {
  renderRecord(res.data);
}

function renderUser(data) {
  $(".js-name").text(data.name);
  $(".js-deposit").text(data.deposit);
}

function renderRecord(data) {
  const target = $(".js-record-wrap");
  let html = "";
  data.reverse().map((item) => {
    const isIn = item.in_and_out === "in";
    html += `<div class="record">
      <div class="record__header">
        ${dayjs(item.created_at).format("YYYY-MM-DD HH:mm")}
      </div>
      <div class="record__body">
        <div class="record__body__item">
          <span class="record__body__item__title ${
            isIn ? "in-text" : "in-out"
          }">${isIn ? "轉入" : "轉出"}</span>
          <p>${item.amount}</p>
        </div>
        <div class="record__body__item">
          <span class="record__body__item__title">對方帳戶:</span>
          <span>${item.opposite_user.name}</span>
        </div>
        <div class="record__body__item">
          <span class="record__body__item__title">備註:</span>
          <span>${item.description}</span>
        </div>
      </div>
    </div>`;
  });

  target.html(html);
}

function getFormData($form) {
  const unIndexed_array = $form.serializeArray();
  const indexed_obj = {};

  $.map(unIndexed_array, function (n, i) {
    indexed_obj[n["name"]] = n["value"];
  });

  return indexed_obj;
}

function errAlert(msg) {
  const alertEl = $(".js-alert");
  alertEl.find(".alert__text").text(msg);

  alertEl.fadeIn(200);
  setTimeout(() => alertEl.fadeOut(200), 3000);
}

function btnDisabled(open) {
  $(".js-transfer-submit").attr("disabled", open);
}

function resetTransferForm() {
  $('form[name="js-transfer-form"] input, textarea').each((id, element) => {
    $(element).val("");
  });
}

$.ajaxSetup({
  beforeSend: () => $("body").loading(),
  complete: () => $("body").loading("stop"),
});
