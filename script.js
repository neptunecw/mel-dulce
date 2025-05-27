const sheetURL = "https://script.google.com/macros/s/AKfycby_HPTcd5RlG6hcYMg573g6S0bP2ToKeZEojaKDqJXCGoyE_s80BBrGWwLyfxJ5QuNF/exec";
let jarContents = [];

// Fetch items from Google Sheet
async function fetchMovies() {
  try {
    const res = await fetch(sheetURL);
    const data = await res.json();
    jarContents = data;
    renderItemList();
  } catch (err) {
    console.error("Failed to fetch movies:", err);
  }
}

// Add new item to sheet
async function addItem() {
  const input = document.getElementById("itemInput");
  const value = input.value.trim();
  if (!value) return;

  try {
    await fetch(sheetURL, {
      method: "POST",
      body: new URLSearchParams({ movie: value }),
    });
    input.value = "";
    await fetchMovies();
  } catch (err) {
    console.error("Failed to add movie:", err);
  }
}

// Update existing item
async function updateItem(id, newValue) {
  try {
    const url = `${sheetURL}?id=${encodeURIComponent(id)}&movie=${encodeURIComponent(newValue)}`;
    const res = await fetch(url, { method: "PUT" });
    const text = await res.text();
    if (text !== "Success") console.error("Update failed:", text);
    await fetchMovies();
  } catch (err) {
    console.error("Failed to update item:", err);
  }
}

// Delete item by ID
async function deleteItem(id) {
  if (!confirm("Delete this item?")) return;

  try {
    const url = `${sheetURL}?id=${encodeURIComponent(id)}`;
    const res = await fetch(url, { method: "DELETE" });
    const text = await res.text();
    if (text !== "Success") console.error("Delete failed:", text);
    await fetchMovies();
  } catch (err) {
    console.error("Failed to delete item:", err);
  }
}

// Render editable/deletable list
function renderItemList() {
  const list = document.getElementById("itemList");
  list.innerHTML = "";

  jarContents.forEach(({ id, movie }) => {
    const li = document.createElement("li");
    li.textContent = movie;
    li.contentEditable = "true";

    // Save edit on blur
    li.addEventListener("blur", () => {
      const newValue = li.textContent.trim();
      if (newValue && newValue !== movie) {
        updateItem(id, newValue);
      } else {
        li.textContent = movie; // Revert if empty or unchanged
      }
    });

    // Prevent newlines and save on Enter
    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        li.blur();
      }
    });

    // Delete on double-click
    li.addEventListener("dblclick", () => deleteItem(id));

    list.appendChild(li);
  });
}

// Handle jar click: pick a random item
const jar = document.getElementById("jar");
jar.addEventListener("click", () => {
  const slip = document.getElementById("slip");
  jar.classList.add("shake");
  setTimeout(() => jar.classList.remove("shake"), 500);

  if (jarContents.length === 0) {
    slip.textContent = "The jar is empty!";
  } else {
    const randomItem = jarContents[Math.floor(Math.random() * jarContents.length)];
    slip.textContent = randomItem.movie;
  }

  slip.classList.remove("hidden");
});

// Initialize list
fetchMovies();
