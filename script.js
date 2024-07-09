let count = document.querySelectorAll(".count");
let addBtns = document.querySelectorAll(".bi-plus");
const form = document.querySelector(".sidebar");
const formTitle = document.querySelector("#title");
const formNotes = document.querySelector("#notes");
const formSection = document.querySelector(".section");
const submitBtn = document.querySelector(".submit");
const createBtn = document.querySelector(".createTask");
let importBtn = document.querySelector(".importBtn");
let fileInput = document.querySelector("#fileInput");
const deleteBtn = document.querySelector(".deleteTask");

document.addEventListener("DOMContentLoaded", function () {
  updateCounter();
  const taskList = document.querySelectorAll(".list, .ulist");
  const contextMenu = document.getElementById("context-menu");
  let currentTask = null;

  taskList.forEach((list) => {
    list.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      if (e.target.classList.contains("item")) {
        currentTask = e.target.closest(".item");
        contextMenu.style.top = `${e.pageY}px`;
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.display = "block";
      }
    });
  });

  document.addEventListener("click", function () {
    contextMenu.style.display = "none";
  });

  document.getElementById("edit-option").addEventListener("click", function () {
    let parent = currentTask.parentElement.parentElement;
    if (parent.classList.contains("col")) {
      parent = parent.classList[1];
    } else {
      parent = parent.classList[0];
    }
    contextMenu.style.display = "none";
    emptyForm();
    lastClickedElem = currentTask;
    form.children[0].value = currentTask.children[1].innerHTML;
    form.children[1].value = currentTask.children[2].innerHTML;
    console.log(currentTask.children[2]);
    form.children[3].value = parent;
  });

  document
    .getElementById("delete-option")
    .addEventListener("click", function () {
      if (currentTask) {
        currentTask.remove();
        updateCounter();
      }
      contextMenu.style.display = "none";
    });

  document.getElementById("done-option").addEventListener("click", function () {
    if (currentTask) {
      currentTask.classList.toggle("task-done");
    }
    contextMenu.style.display = "none";
  });

  document
    .getElementById("default-option")
    .addEventListener("click", function () {
      contextMenu.style.display = "none";
      setTimeout(() => {
        alert(
          "Right-click again to access the browser's default context menu."
        );
      }, 100);
    });
});

importBtn.addEventListener("click", () => {
  let file = fileInput.files[0];
  if (file) {
    // Read the contents of the selected file
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (event) {
      let jsonData = JSON.parse(event.target.result); // Assuming JSON file
      // Process the imported data (populateList, initializeAddButtons)
      populateList(jsonData);
      initializeAddButtons();
    };
    reader.onerror = function (error) {
      console.error("Error reading file:", error);
    };
  } else {
    alert("Please select file to import.");
  }
  updateCounter();
});

let lastClickedElem;
submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let title, note, section;
  title = e.target.form[0].value;
  note = e.target.form[1].value;
  section = e.target.form[3].value;
  done = e.target.form[2].checked;
  // addToList(title, note, section);
  lastClickedElem.children[1].innerHTML = title;
  lastClickedElem.children[2].innerHTML = note;
  lastClickedElem.children[0].checked = done;
  let lastSection = lastClickedElem.parentElement.parentElement;
  if (lastSection.classList.contains("col")) {
    lastSection.classList[1];
  } else {
    lastSection.classList[0];
  }
  if (lastSection != section) {
    let parentElem = lastClickedElem.parentElement;
    parentElem.removeChild(lastClickedElem);
    let newPar = document.querySelector(`.${section}`).children[1];
    console.log(newPar);
    newPar.appendChild(lastClickedElem);
  }
});

createBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let title, note, section;
  title = e.target.form[0].value;
  note = e.target.form[1].value;
  section = e.target.form[3].value;
  done = e.target.form[2].value;
  addToList(title, note, section, done);
});
deleteBtn.addEventListener("click", (e) => {
  e.preventDefault();
  // console.log(lastClickedElem);
  let parent = lastClickedElem.parentElement;
  parent.removeChild(lastClickedElem);
  updateCounter();
});

let dummy;

function initializeAddButtons() {
  addBtns.forEach((btn) => {
    let tempClassList = btn.parentElement.parentElement.classList;

    // Debugging
    console.log("Parent element classes:", tempClassList);

    let tempClass = null;
    if (tempClassList.contains("col")) {
      tempClass = tempClassList[1];
    } else {
      tempClass = tempClassList[0];
    }
    console.log("Assigned temp class:", tempClass);

    btn.addEventListener("click", () => {
      emptyForm();
      form.firstElementChild.focus();
      let formField = form.querySelector(".section");
      if (
        formField instanceof HTMLInputElement ||
        formField instanceof HTMLSelectElement
      ) {
        formField.value = tempClass;
      } else {
        console.error("formField is not an input or select element");
      }
    });
  });
}

function updateCounter() {
  count.forEach((itr) => {
    itr.innerHTML = itr.parentElement.nextElementSibling.childElementCount;
  });
}

function emptyForm() {
  formTitle.value = "";
  formNotes.value = "";
  formSection.value = "default";
}

function addToList(title, note, section, done) {
  console.log(section);
  let appParent = document.querySelector(`.${section}`).lastElementChild;
  if (appParent) {
    let item = document.createElement("div");
    item.classList.add("item");
    item.innerHTML = `
      <input type="checkbox" name="item" class="item-checkbox" ${
        done ? "checked" : ""
      }>
      <div class="item-title">${title}</div>
      <div class="item-notes hide">${note}</div>
    `;
    item.addEventListener("click", () => {
      emptyForm();
      lastClickedElem = item;
      form.children[0].value = item.children[1].innerHTML;
      form.children[1].value = item.children[2].innerHTML;
      console.log(item.children[2]);
      form.children[3].checked = item.children[0].checked;
      form.children[5].value = section;
      console.log(form.children, lastClickedElem, item.children);
    });
    item.addEventListener("dblclick", () => {
      item.remove();
      updateCounter();
    });
    appParent.appendChild(item);
  } else {
    console.error(`No element found for section: ${section}`);
  }
  updateCounter();
}

function populateList(jsonData) {
  for (let section in jsonData) {
    for (let item of jsonData[section]) {
      addToList(item.title, item.notes, section, item.done);
      console.log(item.title, item.notes, section, item.done);
    }
  }
  console.log(jsonData);
  updateCounter();
}

form.firstElementChild.focus();

function itemSelect(item) {
  console.log("complete this");
}

function downloadObjectAsJson(exportObj, exportName) {
  // Convert object to JSON string with indentation for readability
  let jsonString = JSON.stringify(exportObj, null, 2);

  // Create a Blob object for the JSON data
  let blob = new Blob([jsonString], { type: "application/json" });

  // Create a temporary URL for the Blob
  let url = URL.createObjectURL(blob);

  // Create a temporary <a> element and set its attributes for download
  let a = document.createElement("a");
  a.href = url;
  a.download = exportName + ".json"; // Specify filename

  // Programmatically trigger a click event on the <a> element
  a.click();

  URL.revokeObjectURL(url); // Revoke the object URL
}

function exportData() {
  let obj = {
    unsorted: [],
    iu: [],
    inu: [],
    niu: [],
    ninu: [],
  };

  // Fetch data from each category
  let unsorted = document.querySelector(".unsorted .ulist").children;
  let iu = document.querySelector(".iu .list").children;
  let inu = document.querySelector(".inu .list").children;
  let niu = document.querySelector(".niu .list").children;
  let ninu = document.querySelector(".ninu .list").children;

  // Iterate through each category and populate the object
  for (let item of unsorted) {
    let title = item.querySelector(".item-title").textContent.trim();
    let notes = item.querySelector(".item-notes").textContent.trim();
    let checked = item.querySelector(".item-checkbox").checked;
    obj.unsorted.push({ title, notes, done: checked });
  }
  for (let item of iu) {
    let title = item.querySelector(".item-title").textContent.trim();
    let notes = item.querySelector(".item-notes").textContent.trim();
    let checked = item.querySelector(".item-checkbox").checked;
    obj.iu.push({ title, notes, done: checked });
  }
  for (let item of inu) {
    let title = item.querySelector(".item-title").textContent.trim();
    let notes = item.querySelector(".item-notes").textContent.trim();
    let checked = item.querySelector(".item-checkbox").checked;
    obj.inu.push({ title, notes, done: checked });
  }
  for (let item of niu) {
    let title = item.querySelector(".item-title").textContent.trim();
    let notes = item.querySelector(".item-notes").textContent.trim();
    let checked = item.querySelector(".item-checkbox").checked;
    obj.niu.push({ title, notes, done: checked });
  }
  for (let item of ninu) {
    let title = item.querySelector(".item-title").textContent.trim();
    let notes = item.querySelector(".item-notes").textContent.trim();
    let checked = item.querySelector(".item-checkbox").checked;
    obj.ninu.push({ title, notes, done: checked });
  }

  // Convert object to JSON string with indentation for readability
  // (already done in downloadObjectAsJson)

  downloadObjectAsJson(obj, "downloaded");
}

// Attach event listener to the export button
document.querySelector(".exportBtn").addEventListener("click", exportData);
