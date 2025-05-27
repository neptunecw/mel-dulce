let jarContents = JSON.parse(localStorage.getItem("jarContents")) || [];

function saveJar() {
  localStorage.setItem("jarContents", JSON.stringify(jarContents));
}

function renderItemList() {
  const list = document.getElementById("itemList");
  list.innerHTML = ""; // Clear current list

  jarContents.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function addItem() {
  const input = document.getElementById("itemInput");
  const value = input.value.trim();

  if (value !== "") {
    jarContents.push(value);
    saveJar();
    input.value = "";
    renderItemList();
    alert(`"${value}" added to the jar!`);
  }
}

function clearJar() {
  if (confirm("Clear all items in the jar?")) {
    jarContents = [];
    saveJar();
    renderItemList();
    alert("Jar is now empty.");
  }
}

// Shake animation and draw
const jar = document.getElementById("jar");
jar.addEventListener("click", () => {
  const slip = document.getElementById("slip");

  jar.classList.add("shake");
  setTimeout(() => jar.classList.remove("shake"), 500);

  if (jarContents.length === 0) {
    slip.textContent = "The jar is empty!";
  } else {
    const randomIndex = Math.floor(Math.random() * jarContents.length);
    const selected = jarContents[randomIndex];
    slip.textContent = selected;
  }

  slip.classList.remove("hidden");
});

// Render list on load
renderItemList();
