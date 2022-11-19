// toastr.options = {
//   closeButton: true,
//   debug: false,
//   newestOnTop: false,
//   progressBar: true,
//   positionClass: "toast-top-right",
//   preventDuplicates: false,
//   onclick: null,
//   showDuration: "300",
//   hideDuration: "1000",
//   timeOut: "5000",
//   extendedTimeOut: "1000",
//   showEasing: "swing",
//   hideEasing: "linear",
//   showMethod: "fadeIn",
//   hideMethod: "fadeOut",
// };

// массив данных (модель данных)
let items = [];

// генерируем шаблон
const getItemTemplate = ({
  id,
  isDone,
  text,
}) => `<li class="item" data-id="${id}">
        <input id="${id}" data-action = "check" type="checkbox" class="input-checkbox visually-hidden" ${
  isDone ? "checked" : ""
} /><label for="${id}" class="label-checkbox">
        <span class="input-text">${text}</span></label>
        <div class="buttons">
         <button data-action="view" type="button" class="button-view">
         <svg class="icon-view" width="23" height="23" data-action="view">
         <use href="./images/icons.svg#eye"></use></svg></button>
         <button data-action="delete" type="button" class="button-delete"><svg class="icon-delete" 
          data-action="delete" width="21" height="21">
         <use href="./images/icons.svg#cancel"></use></svg></button>
        </div>
      </li>`;

// генерируем модалку
const modal = basicLightbox.create(`
    <div class="modal">
        <p class="modal-text"> Do not forget &#x1F609
        </p>
        <button class="btn-modal"> <svg class="btn-close" 
         data-action="close" width="25" height="25">
         <use href="./images/icons.svg#cancel"></use></svg> </button>
    </div>
`);
// ссылки на селектора
const refs = {
  list: document.querySelector(".list"),
  form: document.querySelector(".form"),
  modalText: modal.element().querySelector(".modal-text"),
  modalBtn: modal.element().querySelector(".btn-close"),
  deleteBtn: document.querySelector(".delete-btn"),
};
// создаем на каждой итерации генерируемый шаблон и добавляем в дом
const render = () => {
  const list = items.map((item) => getItemTemplate(item)).join("");
  refs.list.innerHTML = "";
  refs.list.insertAdjacentHTML("beforeend", list);
};
render();

const createTodo = (payload) => {
  localStorage.setItem("todos", JSON.stringify(payload));
};

const fetchTodos = () => {
  try {
    return JSON.parse(localStorage.getItem("todos")) || [];
  } catch (error) {
    console.log("cannot load tdos");
    return [];
  }
};

const updateTodos = (payload) => {
  localStorage.setItem("todos", JSON.stringify(payload));
};

const deleteTodos = (payload) => {
  localStorage.setItem("todos", JSON.stringify(payload));
};
// добавляем Элемент с текстом, который вводим в инпут и без галочки в массив данных

const addItem = (item) => {
  items.push(item);
};

// логика обработки при нажатии на сабмит: вэлью = это текст,
// который вводим в инпут, сбрасываем перезагрузку страницы по умолчанию,
// добавляем айтем и создаем заново разметку,с очищением, чтобы элементы
// не перезаписывались и очищаем форму (reset)
const handleSubmit = (event) => {
  //  console.log(event)
  const { value } = event.target.elements.text;

  if (value === "") {
    return alert("Please fill in the field!");
  } else if (value.length >= 11) {
    return alert("Too long:(");
  }
  const payload = {
    id: uuid.v4(),
    text: value,
    isDone: false,
    created: new Date(),
  };

  event.preventDefault();

  addItem(payload);

  createTodo(items);

  render();

  // toastr.success('Have fun storming the castle!', 'Miracle Max Says');
  refs.form.reset();
};

const checkItem = (id) => {
  items = items.map((item) =>
    item.id === id
      ? {
          ...item,
          isDone: !item.isDone,
        }
      : item
  );
  updateTodos(items);
  // console.table(items);
};

const viewItem = (id) => {
  const { created } = items.find((item) => item.id === id);
  // refs.modalText.textContent = created;
  modal.show();
};

const deleteItem = (id) => {
  items = items.filter((item) => item.id !== id);
  deleteTodos(items);
  render();
};

const handleListClick = (e) => {
  if (e.target === e.currentTarget) return;

  const { action } = e.target.dataset;
  const parent = e.target.closest("li");
  const { id } = parent.dataset;

  switch (action) {
    case "view":
      viewItem(id);
      break;

    case "check":
      checkItem(id);
      break;

    case "delete":
      deleteItem(id);
      break;
  }
  // console.log(action, id);
};

const loadData = () => {
  items = fetchTodos();
};
loadData();
render();
const deleteAll = () => {
  console.log("Delete");
};
// при нажатии на кнопку в форме, добавляем элемент
refs.form.addEventListener("submit", handleSubmit);
refs.list.addEventListener("click", handleListClick);
refs.modalBtn.addEventListener("click", modal.close);
refs.deleteBtn.addEventListener("click", deleteAll);
