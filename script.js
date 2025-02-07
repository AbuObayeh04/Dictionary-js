"use strict";

const input = document.getElementById("input");
const btn = document.getElementById("search-btn");

const word = document.getElementById("word");
const definition = document.getElementById("definition");
const example = document.getElementById("examples");
const wiki = document.getElementById("wiki");

const resultContainer = document.getElementById("result");
const errorContainer = document.getElementById("error");

async function fetchData(word) {
  let res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  if (!res.ok) {
    throw new Error("The word is not found");
  }
  return res.json();
}

function displayData(data) {
  word.textContent = data[0].word;

  const allDefinitions = data
    .flatMap((entry) =>
      entry.meanings.flatMap((meaning) => meaning.definitions)
    )
    .map((definition) => `<li class="mb-0.5">- ${definition.definition}</li>`)
    .join("");

  definition.innerHTML = `
    <strong>Definitions:</strong>
    <ul>${allDefinitions || "<li>No definitions available</li>"}</ul>
  `;

  const allExamples = data
    .flatMap((entry) =>
      entry.meanings.flatMap((meaning) => meaning.definitions)
    )
    .filter((def) => def.example)
    .map((def) => `<li class="mb-0.5">- ${def.example}</li>`)
    .join("");

  example.innerHTML = `
    <strong>Examples:</strong>
    <ul>${allExamples || "<li>No examples available</li>"}</ul>
  `;
  wiki.innerHTML = `<a class='text-blue-900 underline' target='_blank' href='${data[0].sourceUrls[0]}'>Wiki Resource</a>`;
  resultContainer.classList.remove("hidden");
  errorContainer.classList.add("hidden");
}

function displayError(message) {
  errorContainer.textContent = message;
  resultContainer.classList.add("hidden");
  errorContainer.classList.remove("hidden");
}

btn.addEventListener("click", async () => {
  let val = input.value.trim();
  if (!val) {
    displayError("Enter a Word");
    return;
  }
  try {
    let data = await fetchData(val);
    displayData(data);
  } catch (error) {
    displayError(error.message);
  }
});

input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    btn.click();
  }
});
