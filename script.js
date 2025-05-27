const sheetURL = "https://script.google.com/macros/s/AKfycby_HPTcd5RlG6hcYMg573g6S0bP2ToKeZEojaKDqJXCGoyE_s80BBrGWwLyfxJ5QuNF/exec";
let jarContents = [];

// Fetch full list from Google Sheet
async function fetchMovies() {
  try {
    const res = await fetch(sheetURL);
    const data = await res.json();
    jarContents = data;
    renderItemList();
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

// Add a new item to the sheet
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
  } catch (error) {
    console.error("Error adding item:", error);
  }
}

// Update an existing item on the sheet
async function updateItem(id, newValue) {
  try {
    await fetch(sheetURL, {
      method: "PUT",
      body: new URLSearchParams({ id: id, movie: newValue }),
    });
    await fetchMovies();
  } catch (error) {
    console.error("Error updating item:", error);
  }
}

// Delete an item from the sheet
async function deleteItem(id) {
  if (!confirm("Delete this item?")) return;

  try {
    const url = `${sheetURL}?id=${encodeURIComponent(id)}`;
    await fetch(url, {
      method: "DELETE",
    });
    await fetchMovies();
  } catch (error) {
    console.error("Error deleting item:", error);
  }
}

// Render the list with editable and deletable items
function renderItemList() {
  const list = document.getElementById("itemList");
  list.innerHTML = "";

  jarContents.forEach(({ id, movie }) => {
    const li = document.createElement("li");
    li.textContent = movie;
    li.contentEditable = "true";

    li.addEventListener("blur", () => {
      const newValue = li.textContent.trim();
      if (newValue && newValue !== movie) {
        updateItem(id, newValue);
      } else {
        li.textContent = movie; // reset if empty or unchanged
      }
    });

    li.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        li.blur();
      }
    });

    li.addEventListener("dblclick", () => {
      deleteItem(id);
    });

    list.appendChild(li);
  });
}

// Jar click: show random item with shake animation
const jar = document.getElementById("jar");
jar.addEventListener("click", () => {
  const slip = document.getElementById("slip");

  jar.classList.add("shake");
  setTimeout(() => jar.classList.remove("shake"), 500);

  if (jarContents.length === 0) {
    slip.textContent = "The jar is empty!";
  } else {
    const randomIndex = Math.floor(Math.random() * jarContents.length);
    slip.textContent = jarContents[randomIndex].movie;
  }

  slip.classList.remove("hidden");
});

// On page load
fetchMovies();
