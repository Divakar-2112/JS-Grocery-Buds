let form = document.querySelector(".grocery-form");
let alert = document.querySelector(".alert");
let groceryInput = document.querySelector("#grocery");
let submitBtn = document.querySelector("#submit-btn");
let groceryList = document.querySelector("#grocery-list");
let clearBtn = document.querySelector("#clear-btn");

let editMode = false;
let editID = null;

document.addEventListener("DOMContentLoaded", loadItems);

form.addEventListener("submit", function (e) {
  e.preventDefault();
  let itemName = groceryInput.value.trim();

  if (itemName === "") {
    showMessage("Please enter an item", "alert-danger");
    return;
  }

  let validPattern = /^[a-zA-Z\s]+$/;
  if (!validPattern.test(itemName)) {
    showMessage("Incorrect Pattern: Only alphabets allowed", "alert-danger");
    return;
  }

  if (editMode) {
    updateItem(editID, itemName);
  } else {
    addItem(itemName);
  }

  groceryInput.value = "";
  submitBtn.textContent = "Submit";
  editMode = false;
  editID = null;
});

function addItem(name) {
  let items = itemsStorage();
  let id = new Date().getTime().toString();
  let newItem = { id, name };

  items.push(newItem);
  localStorage.setItem("groceryItems", JSON.stringify(items));

  displayItem(newItem);
  showMessage("New item added successfully", "alert-success");
}

function loadItems() {
  let items = itemsStorage();
  items.forEach(displayItem);
}

function displayItem(item) {
  let element = document.createElement("div");
  element.classList.add("grocery-item");
  element.setAttribute("data-id", item.id);
  element.innerHTML = `
    <p class="title">${item.name}</p>
    <div class="btn-container">
      <button class="edit-btn"><i class="fas fa-edit"></i></button>
      <button class="delete-btn"><i class="fas fa-trash"></i></button>
    </div>
  `;

  let deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => deleteItem(item.id, element));

  let editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => editItem(item.id, item.name));

  groceryList.appendChild(element);
}

function updateItem(id, newName) {
  let items = itemsStorage();
  items = items.map((item) => (item.id === id ? { id, name: newName } : item));
  localStorage.setItem("groceryItems", JSON.stringify(items));

  let itemElement = document.querySelector(`[data-id="${id}"] .title`);
  itemElement.textContent = newName;

  showMessage("Item updated successfully", "alert-success");
}

function deleteItem(id, element) {
  let items = itemsStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("groceryItems", JSON.stringify(items));

  groceryList.removeChild(element);
  showMessage("Item deleted!", "alert-danger");
}

function editItem(id, name) {
  groceryInput.value = name;
  submitBtn.textContent = "Edit";
  editMode = true;
  editID = id;
}

clearBtn.addEventListener("click", function () {
  localStorage.removeItem("groceryItems");
  groceryList.innerHTML = "";
  showMessage("All items cleared!", "alert-warning");
});

function itemsStorage() {
  return localStorage.getItem("groceryItems")
    ? JSON.parse(localStorage.getItem("groceryItems"))
    : [];
}

function showMessage(message, className) {
  alert.textContent = message;
  alert.className = `alert ${className}`;
  alert.style.display = "block";

  setTimeout(() => {
    alert.textContent = "";
    alert.style.display = "none";
  }, 2000);
}














