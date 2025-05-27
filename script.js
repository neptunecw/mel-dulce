function renderItemList() {
  const list = document.getElementById("itemList");
  list.innerHTML = "";

  jarContents.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.contentEditable = "true";

    // Save changes when user clicks away or presses Enter
    li.addEventListener("blur", () => {
      jarContents[index] = li.textContent.trim();
      renderItemList();
    });
    
    // Optional: save on Enter key and remove focus to trigger blur
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // prevent newline
        li.blur();
      }
    });

    // Delete item on double-click
    li.addEventListener("dblclick", () => {
      jarContents.splice(index, 1);
      renderItemList();
    });

    list.appendChild(li);
  });
}

function addItem() {
  const input = document.getElementById("itemInput");
  const value = input.value.trim();

  if (value !== "") {
    jarContents.push(value);
    input.value = "";
    renderItemList();
  }
}

function clearJar() {
  if (confirm("Clear all items in the jar?")) {
    jarContents = [];
    renderItemList();
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

// Initial render on page load
renderItemList();

const sheetURL = "https://script.google.com/macros/s/AKfycby_HPTcd5RlG6hcYMg573g6S0bP2ToKeZEojaKDqJXCGoyE_s80BBrGWwLyfxJ5QuNF/exec";

async function fetchMovies() {
  const res = await fetch(sheetURL);
  const data = await res.json();
  jarContents = data;
  renderItemList();
}

async function addItem() {
  const input = document.getElementById("itemInput");
  const value = input.value.trim();

  if (value) {
    await fetch(sheetURL, {
      method: "POST",
      body: new URLSearchParams({ movie: value })
    });
    input.value = "";
    fetchMovies(); // Refresh list
  }
}
