// =================== \/\/ ** Global Variables**\/\/===================

var selectedUserIndexForUpdate = -1;

// =================== \/\/ ** Emplyees Array  And Local Storage**\/\/===================

var emplyees = JSON.parse(localStorage.getItem("employees")) || [];
var counter = emplyees.length;

// =================== \/\/ ** Elements **\/\/===================

var emplyeesContainer = document.getElementById("Emplyees");
var createBtn = document.getElementById("CreateBtn");
var btnCloseModal = document.querySelector(".btn-close");
var userIcon = document.querySelector("#UserIcon");
var userPhoto = document.querySelector("#UserPhoto");
var updateBtn = document.querySelector("#UpdateBtn");
var IntialaBtn = document.querySelector("#IntialaBtn");
var searchSelection = document.getElementById("Selection-search");

// =================== \/\/ ** HTML Inputs **\/\/===================

var profileImageInput = document.getElementById("profileImageInput");
var nameInput = document.getElementById("Name");
var ageInput = document.getElementById("Age");
var phoneInput = document.getElementById("Phone");
var cityInput = document.getElementById("City");
var emailInput = document.getElementById("Email");
var startDateInput = document.getElementById("StartDate");
var searchInput = document.getElementById("searchInput");
var reader = new FileReader();

// =================== \/\/ ** Event **\/\/===================
createBtn.addEventListener("click", function () {
  if (!validateForm()) {
    return;
  }
  var newEmployee = {
    name: nameInput.value,
    age: ageInput.value,
    phone: phoneInput.value,
    city: cityInput.value,
    email: emailInput.value,
    startDate: startDateInput.value,
    imagePathName: userPhoto.getAttribute("src"),
    id: `EMP-${counter}`,
  };
  emplyees.push(newEmployee);
  updateLocalStorage();
  clearInputs();
  closeModal();
  counter++;
});

function deleteUser(id) {
  // find index by id
  var index = getEmployeeById(id);
  emplyees.splice(index, 1);
  updateLocalStorage();
}

profileImageInput.addEventListener("input", function (e) {
  var emplyeeImage = e.target.files[0];
  reader.readAsDataURL(emplyeeImage);
  reader.onload = function (r) {
    var imageSRC = r.currentTarget.result;
    userPhoto.setAttribute("src", imageSRC);
  };
});

function showUpdateModal(id) {
  var index = getEmployeeById(id);
  selectedUserIndexForUpdate = index;
  nameInput.value = emplyees[index].name;
  ageInput.value = emplyees[index].age;
  phoneInput.value = emplyees[index].phone;
  cityInput.value = emplyees[index].city;
  emailInput.value = emplyees[index].email;
  startDateInput.value = emplyees[index].startDate;
  userPhoto.setAttribute("src", emplyees[index].imagePathName);
  updateBtn.style.display = "block";
  createBtn.style.display = "none";
}

function updateUser() {
  if (!validateForm()) {
    return;
  }
  var newEmployee = {
    name: nameInput.value,
    age: ageInput.value,
    phone: phoneInput.value,
    city: cityInput.value,
    email: emailInput.value,
    startDate: startDateInput.value,
    imagePathName: userPhoto.getAttribute("src"),
    id: emplyees[selectedUserIndexForUpdate].id,
  };
  emplyees[selectedUserIndexForUpdate] = newEmployee;
  updateLocalStorage();
  clearInputs();
  closeModal();
}

searchSelection.addEventListener("change", function (e) {
  if (e.target.value == "name" || e.target.value == "email" || e.target.value == "phone") {
    searchInput.removeAttribute("disabled");
  }
});

searchInput.addEventListener("input", function (e) {
  var result = [];
  for (var index = 0; index < emplyees.length; index++) {
    if (emplyees[index][searchSelection.value].toLowerCase().includes(e.target.value.toLowerCase())) {
      result.push(emplyees[index]);
    }
  }
  display(result);
});
btnCloseModal.addEventListener("click", function () {
  clearInputs();
  updateBtn.style.display = "none";
  createBtn.style.display = "block";
});
// =================== \/\/ ** Validation **\/\/===================

nameInput.addEventListener("input", function (e) {
  if (!validateNameInput(e.target.value)) {
    nameInput.classList.add("is-invalid");
  } else {
    nameInput.classList.replace("is-invalid", "is-valid");
  }
});

ageInput.addEventListener("input", function (e) {
  if (!validateAgeInput(Number(e.target.value))) {
    ageInput.classList.add("is-invalid");
  } else {
    ageInput.classList.replace("is-invalid", "is-valid");
  }
});

phoneInput.addEventListener("input", function (e) {
  if (!validatePhoneInput(e.target.value)) {
    phoneInput.classList.add("is-invalid");
  } else {
    phoneInput.classList.replace("is-invalid", "is-valid");
  }
});

cityInput.addEventListener("input", function (e) {
  if (!validateCityInput(e.target.value)) {
    cityInput.classList.add("is-invalid");
  } else {
    cityInput.classList.replace("is-invalid", "is-valid");
  }
});

emailInput.addEventListener("input", function (e) {
  if (!validateEmailInput(e.target.value)) {
    emailInput.classList.add("is-invalid");
  } else {
    emailInput.classList.replace("is-invalid", "is-valid");
  }
});

// =================== \/\/ ** Helpers **\/\/===================
function display(array) {
  var employeesHTML = "";
  for (var index = 0; index < array.length; index++) {
    employeesHTML += `  <tr style="line-height: 3;" title='EMP-${array[index].name}-${array[index].email}'>
                        <td width="100px"><img
                        src="${array[index].imagePathName}"
                        class="img-fluid" width="100px"
                        height="100px" alt></td>
                        <td>${array[index].name}</td>
                        <td>${array[index].age}</td>
                        <td>${array[index].city}</td>
                        <td>${array[index].email}</td>
                        <td>${array[index].phone}</td>
                        <td>${array[index].startDate}</td>
                        <td>
                        <button class="btn btn-danger"
                        
                        id="DeleteBtn" onclick="deleteUser('${array[index].id}')">Delete</button></td>
                        <td>
                        <button class="btn btn-primary" data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        id="updateUserBtn" onclick="showUpdateModal('${array[index].id}')" >Update</button>
                        </td>
                        </tr>`;
  }
  emplyeesContainer.innerHTML = employeesHTML;
}

function getEmployeeById(id) {
  var index = -1;
  for (var i = 0; i < emplyees.length; i++) {
    if (emplyees[i].id === id) {
      index = i;
      break;
    }
  }
  return index;
}

function updateLocalStorage() {
  localStorage.setItem("employees", JSON.stringify(emplyees));
  display(emplyees);
}

function clearInputs() {
  nameInput.value = "";
  nameInput.classList.remove("is-valid");
  nameInput.classList.remove("is-invalid");
  ageInput.value = "";
  ageInput.classList.remove("is-valid");
  ageInput.classList.remove("is-invalid");
  phoneInput.value = "";
  phoneInput.classList.remove("is-valid");
  phoneInput.classList.remove("is-invalid");
  cityInput.value = "";
  cityInput.classList.remove("is-valid");
  cityInput.classList.remove("is-invalid");
  emailInput.value = "";
  emailInput.classList.remove("is-valid");
  emailInput.classList.remove("is-invalid");
  startDateInput.value = "";
  startDateInput.classList.remove("is-valid");
  startDateInput.classList.remove("is-invalid");
  userPhoto.setAttribute("src", "https://placehold.co/600x400");
  userPhoto.parentNode.classList.remove("invalidimage");
}

function closeModal() {
  btnCloseModal.click();
}

function validateNameInput(value) {
  if (value.length < 3) {
    return false;
  }
  return true;
}

function validateAgeInput(value) {
  if (value < 18 || value > 65) {
    return false;
  }
  return true;
}

function validatePhoneInput(value) {
  var phoneRegex = /^01[1250][0-9]{8}$/;
  return phoneRegex.test(value);
}

function validateCityInput(value) {
  // alex cairo giza
  var cityRegex = /^(cairo|giza|alex)$/i;
  return cityRegex.test(value);
}

function validateEmailInput(value) {
  var emailRegex = /^[a-zA-Z][a-zA-Z0-9\.]{0,50}@(gmail\.com|yahoo\.net)$/;
  return emailRegex.test(value);
}

function validateForm() {
  var result = true;
  // name input
  if (!validateNameInput(nameInput.value)) {
    result = false;
    nameInput.classList.add("is-invalid");
  }
  // age input
  if (!validateAgeInput(Number(ageInput.value))) {
    result = false;
    ageInput.classList.add("is-invalid");
  }
  //
  if (!validatePhoneInput(phoneInput.value)) {
    result = false;
    phoneInput.classList.add("is-invalid");
  }
  if (!validateCityInput(cityInput.value)) {
    result = false;
    cityInput.classList.add("is-invalid");
  }
  if (!validateEmailInput(emailInput.value)) {
    result = false;
    emailInput.classList.add("is-invalid");
  }
  if (!startDateInput.value) {
    result = false;
    startDateInput.classList.add("is-invalid");
  }
  if (userPhoto.getAttribute("src") == "https://placehold.co/600x400") {
    userPhoto.parentNode.classList.add("invalidimage");
  }
  return result;
}

display(emplyees);
