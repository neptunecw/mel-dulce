// Load saved items from localStorage or initialize an empty array
let jarContents = JSON.parse(localStorage.getItem("jarContents")) || [];

// Save the current jar contents to localStorage
function saveJar() {
  localStorage.setItem("jarContents", JSON.stringify(jarContents));
}

// Add a new item to the jar
function addItem() {
  const input = document.getElementById("itemInput");
  const value = input.value.trim();

  if (value !== "") {
    jarContents.push(value);
    saveJar();
    input.value = "";
    alert(`"${value}" added to the jar!`);
  }
}

// Clear the jar
function clearJar() {
  if (confirm("Clear all items in the jar?")) {
    jarContents = [];
    saveJar();
    alert("Jar is now empty.");
  }
}

// When the jar is clicked
const jar = document.getElementById("jar");
jar.addEventListener("click", () => {
  const slip = document.getElementById("slip");

  // Add shake animation
  jar.classList.add("shake");
  setTimeout(() => jar.classList.remove("shake"), 500);

  // Pick and show a random item
  if (jarContents.length === 0) {
    slip.textContent = "The jar is empty!";
  } else {
    const randomIndex = Math.floor(Math.random() * jarContents.length);
    const selected = jarContents[randomIndex];
    slip.textContent = selected;
  }

  slip.classList.remove("hidden");
});
