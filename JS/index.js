// =================== \/\/ ** Global Variables**\/\/===================

let selectedUserIndexForUpdate = -1;
let emplyees = [];

// =================== \/\/ ** Elements **\/\/===================

const emplyeesContainer = document.getElementById("Emplyees");
const createBtn = document.getElementById("CreateBtn");
const btnCloseModal = document.querySelector(".btn-close");
const userIcon = document.querySelector("#UserIcon");
const userPhoto = document.querySelector("#UserPhoto");
const updateBtn = document.getElementById("UpdateBtn");
const IntialaBtn = document.getElementById("IntialaBtn");
const searchSelection = document.getElementById("Selection-search");

// =================== \/\/ ** HTML Inputs **\/\/===================

const profileImageInput = document.getElementById("profileImageInput");
const nameInput = document.getElementById("Name");
const ageInput = document.getElementById("Age");
const phoneInput = document.getElementById("Phone");
const emailInput = document.getElementById("Email");
const startDateInput = document.getElementById("StartDate");
const searchInput = document.getElementById("searchInput");

const API_URL = "http://localhost:3000/user";

createBtn.addEventListener("click", async function () {
  if (!validateForm()) return;

  const formData = new FormData();
  formData.append("name", nameInput.value);
  formData.append("age", ageInput.value);
  formData.append("phone", phoneInput.value);
  formData.append("email", emailInput.value);
  formData.append("startDate", startDateInput.value);
  formData.append("image", profileImageInput.files[0]);

  try {
    await fetch(API_URL, { method: "POST", body: formData });
    loadEmployees();
    clearInputs();
    closeModal();
  } catch (err) {
    console.error("Create Error:", err);
  }
});

async function deleteUser(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadEmployees();
  } catch (err) {
    console.error("Delete Error:", err);
  }
}

profileImageInput.addEventListener("input", function (e) {
  const reader = new FileReader();
  reader.readAsDataURL(e.target.files[0]);
  reader.onload = function (r) {
    userPhoto.setAttribute("src", r.target.result);
  };
});
function formatDateForInput(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", { month: "2-digit", day: "2-digit", year: "numeric" }).replaceAll("/", "-");
}
function showUpdateModal(id) {
  const index = emplyees.findIndex((emp) => emp.id == id);
  selectedUserIndexForUpdate = index;
  const employee = emplyees[index];

  nameInput.value = employee.name;
  ageInput.value = employee.age;
  phoneInput.value = employee.phone;
  emailInput.value = employee.email;
  startDateInput.value = formatDateForInput(employee.startDate);
  userPhoto.setAttribute("src", `${employee.image}`);
  updateBtn.style.display = "block";
  createBtn.style.display = "none";
}

updateBtn.addEventListener("click", async function () {
  if (!validateForm()) return;
  const formData = new FormData();
  const id = emplyees[selectedUserIndexForUpdate].id;

  formData.append("name", nameInput.value);
  formData.append("age", ageInput.value);
  formData.append("phone", phoneInput.value);
  formData.append("email", emailInput.value);
  formData.append("startDate", startDateInput.value);
  //
  if (profileImageInput.files.length > 0) {
    formData.append("image", profileImageInput.files[0]);
  }

  try {
    await fetch(`${API_URL}/${id}`, { method: "PUT", body: formData });
    loadEmployees();
    clearInputs();
    closeModal();
  } catch (err) {
    console.error("Update Error:", err);
  }
});

searchSelection.addEventListener("change", function (e) {
  if (["name", "email", "phone"].includes(e.target.value)) {
    searchInput.removeAttribute("disabled");
  }
});

searchInput.addEventListener("input", function (e) {
  const result = emplyees.filter((emp) => emp[searchSelection.value]?.toLowerCase().includes(e.target.value.toLowerCase()));
  display(result);
});

btnCloseModal.addEventListener("click", function () {
  clearInputs();
  updateBtn.style.display = "none";
  createBtn.style.display = "block";
});

// =================== \/\/ ** Helpers **\/\/===================
function display(array) {
  let html = "";
  for (const emp of array) {
    html += `
    <tr style="line-height: 3;" title='EMP-${emp.name}-${emp.email}'>
      <td width="100px"><img src="${emp.image}" width="100px" height="100px" class="img-fluid" /></td>
      <td>${emp.name}</td>
      <td>${emp.age}</td>
      <td>${emp.email}</td>
      <td>${emp.phone}</td>
      <td>${emp.startDate}</td>
      <td><button class="btn btn-danger" onclick="deleteUser('${emp.id}')">Delete</button></td>
      <td><button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="showUpdateModal('${emp.id}')">Update</button></td>
    </tr>`;
  }
  emplyeesContainer.innerHTML = html;
}

async function loadEmployees() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    emplyees = data.data.users;
    display(emplyees);
  } catch (err) {
    console.error("Load Error:", err);
  }
}

function clearInputs() {
  [nameInput, ageInput, phoneInput, emailInput, startDateInput].forEach((input) => {
    input.value = "";
    input.classList.remove("is-valid", "is-invalid");
  });
  userPhoto.setAttribute("src", "https://placehold.co/600x400");
  userPhoto.parentNode.classList.remove("invalidimage");
}

function closeModal() {
  btnCloseModal.click();
}

function validateNameInput(value) {
  return value.length >= 3;
}

function validateAgeInput(value) {
  return value >= 18 && value <= 65;
}

function validatePhoneInput(value) {
  return /^01[1250][0-9]{8}$/.test(value);
}

function validateEmailInput(value) {
  return /^[a-zA-Z][a-zA-Z0-9\.]{0,50}@(gmail\.com|yahoo\.net)$/.test(value);
}

function validateForm() {
  let result = true;
  if (!validateNameInput(nameInput.value)) {
    result = false;
    nameInput.classList.add("is-invalid");
  }
  if (!validateAgeInput(Number(ageInput.value))) {
    result = false;
    ageInput.classList.add("is-invalid");
  }
  if (!validatePhoneInput(phoneInput.value)) {
    result = false;
    phoneInput.classList.add("is-invalid");
  }
  if (!validateEmailInput(emailInput.value)) {
    result = false;
    emailInput.classList.add("is-invalid");
  }
  if (!startDateInput.value) {
    result = false;
    startDateInput.classList.add("is-invalid");
  }
  if (userPhoto.getAttribute("src") === "https://placehold.co/600x400") {
    userPhoto.parentNode.classList.add("invalidimage");
    result = false;
  }
  return result;
}

loadEmployees();
