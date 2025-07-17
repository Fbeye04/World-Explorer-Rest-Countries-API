const cardListContainer = document.getElementById("card-list");
const listView = document.querySelector(".list-view");
const detailView = document.querySelector(".detail-view");
const backButton = document.getElementById("back-button");
const searchInput = document.getElementById("search-input");
const dropdownSelect = document.querySelector(".select");
const dropdownMenu = document.querySelector(".menu");
const darkModeToggle = document.querySelector(".dark-mode-toggle");
const htmlElement = document.documentElement;
const loadMoreButton = document.getElementById("load-more-button");

let allCountriesData = []; // The main "dictionary" containing all country data from the API.
let itemsToShow = 12; // The number of items to load each time "Load More" is clicked.
let itemsLoaded = 0; // A counter to track how many items are already displayed.

/**
 * Fetches all countries data from REST Countries API
 * Populates the global allCountriesData array and loads initial countries
 */
async function getAllCountries() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=flags,name,population,region,capital,cca3"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const countries = await response.json();
    allCountriesData = countries;

    loadMoreCountries();
  } catch (error) {
    console.error("failed to retrieve data:", error);
  }
}

/**
 * Fetches detailed information for a specific country using its country code
 * @param {string} code - The 3-letter country code (e.g., "USA", "IDN")
 */
async function getCountryDetails(code) {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${code}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const countryData = await response.json();

    displayCountryDetails(countryData[0]);
  } catch (error) {
    console.error("failed to retrieve data:", error);
  }
}

/**
 * Renders all country cards in the container
 * @param {Array} countriesArray - Array of country objects to display
 */
function displayAllCards(countriesArray) {
  cardListContainer.innerHTML = "";

  countriesArray.forEach((country) => {
    const countryCardHTML = `
            <a href="#" class="card-link" data-country-code="${country.cca3}">
              <article class="card">
                <img src="${country.flags.svg}" alt="${country.name.common}" />

                <div class="card-description">
                  <h2>${country.name.common}</h2>

                  <ul class="additional-info">
                    <li><strong>Population:</strong> ${country.population.toLocaleString(
                      "en-US"
                    )}</li>
                    <li><strong>Region:</strong> ${country.region}</li>
                    <li><strong>Capital:</strong> ${country.capital}</li>
                  </ul>
                </div>
              </article>
            </a>
    `;

    cardListContainer.insertAdjacentHTML("beforeend", countryCardHTML);
  });
}

/**
 * Loads more countries incrementally (pagination)
 * Adds country cards to the existing list and hides load more button when all items are loaded
 */
function loadMoreCountries() {
  const nextItems = allCountriesData.slice(
    itemsLoaded,
    itemsLoaded + itemsToShow
  );

  nextItems.forEach((country) => {
    const countryCardHTML = `
            <a href="#" class="card-link" data-country-code="${country.cca3}">
              <article class="card">
                <img src="${country.flags.svg}" alt="${country.name.common}" />

                <div class="card-description">
                  <h2>${country.name.common}</h2>

                  <ul class="additional-info">
                    <li><strong>Population:</strong> ${country.population.toLocaleString(
                      "en-US"
                    )}</li>
                    <li><strong>Region:</strong> ${country.region}</li>
                    <li><strong>Capital:</strong> ${country.capital}</li>
                  </ul>
                </div>
              </article>
            </a>
    `;

    cardListContainer.insertAdjacentHTML("beforeend", countryCardHTML);
  });

  itemsLoaded += itemsToShow;

  if (itemsLoaded >= allCountriesData.length) {
    loadMoreButton.style.display = "none";
  }
}

/**
 * Displays detailed information about a specific country
 * Switches from list view to detail view and shows comprehensive country data
 * @param {Object} country - Country object containing detailed information
 */
function displayCountryDetails(country) {
  listView.style.display = "none";
  detailView.style.display = "block";

  const detailContainer = document.querySelector(".country");

  const detailHTML = `
            <img
              class="country-flag"
              src="${country.flags.svg}"
              alt="${country.name.common} flag" />

            <div class="country-description">
              <h2 class="country-name">${country.name.common}</h2>

              <div class="country-info">
                <ul class="info">
                  <li><strong>Native Name:</strong> ${
                    country.name.official
                  }</li>
                  <li><strong>Population:</strong> ${country.population.toLocaleString(
                    "en-US"
                  )}</li>
                  <li><strong>Region:</strong> ${country.region}</li>
                  <li><strong>Sub Region:</strong> ${country.subregion}</li>
                  <li><strong>Capital:</strong> ${
                    country.capital ? country.capital.join(", ") : "N/A"
                  }</li>
                </ul>

                <ul class="info">
                  <li><strong>Top Level Domain:</strong> ${country.tld.join(
                    ", "
                  )}</li>
                  <li><strong>Currencied:</strong> ${Object.values(
                    country.currencies
                  )
                    .map((c) => c.name)
                    .join(", ")}</li>
                  <li><strong>Languages:</strong> ${Object.values(
                    country.languages
                  ).join(", ")}</li>
                </ul>
              </div>

              <div class="border-countries">
                <h3>Border Countries:</h3>

                <div class="list">
                  ${
                    country.borders
                      ? country.borders
                          .map(
                            (border) =>
                              `<a href="#" data-country-code="${border}">${border}</a>`
                          )
                          .join("")
                      : "<span>No border countries</span>"
                  }
                </div>
              </div>
            </div>
  `;

  detailContainer.innerHTML = detailHTML;

  const borderCountriesContainer = document.querySelector(".list");

  // Convert border country codes to readable names
  if (country.borders && country.borders.length > 0) {
    borderCountriesContainer.innerHTML = country.borders
      .map((borderCode) => {
        const borderCountry = allCountriesData.find(
          (c) => c.cca3 === borderCode
        );
        const countryName = borderCountry
          ? borderCountry.name.common
          : borderCode;

        return `<a href="#" data-country-code="${borderCode}">${countryName}</a>`;
      })
      .join("");
  } else {
    borderCountriesContainer.innerHTML = "<span>No border countries</span>";
  }
}

/**
 * Displays filtered search results with pagination
 * Shows only the first batch of filtered countries and manages load more button
 * @param {Array} filteredData - Array of filtered country objects
 */
function displayFilteredResults(filteredData) {
  const itemsToDisplay = filteredData.slice(0, itemsToShow);

  itemsToDisplay.forEach((country) => {
    const countryCardHTML = `
            <a href="#" class="card-link" data-country-code="${country.cca3}">
              <article class="card">
                <img src="${country.flags.svg}" alt="${country.name.common}" />

                <div class="card-description">
                  <h2>${country.name.common}</h2>

                  <ul class="additional-info">
                    <li><strong>Population:</strong> ${country.population.toLocaleString(
                      "en-US"
                    )}</li>
                    <li><strong>Region:</strong> ${country.region}</li>
                    <li><strong>Capital:</strong> ${country.capital}</li>
                  </ul>
                </div>
              </article>
            </a>
    `;
    cardListContainer.insertAdjacentHTML("beforeend", countryCardHTML);
  });

  itemsLoaded = itemsToDisplay.length;

  if (filteredData.length <= itemsToShow) {
    loadMoreButton.style.display = "none";
  }
}

/**
 * Toggles between dark and light theme
 * Updates theme attributes, localStorage, and UI elements
 */
function switchTheme() {
  const themeText = darkModeToggle.querySelector("p");
  const themeIcon = darkModeToggle.querySelector("i");

  const newTheme =
    htmlElement.getAttribute("data-theme") === "dark" ? "light" : "dark";

  htmlElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  const isDark = newTheme === "dark";

  themeText.textContent = isDark ? "Light Mode" : "Dark Mode";
  themeIcon.className = isDark ? "fa-regular fa-sun" : "fa-regular fa-moon";
}

/**
 * Loads the saved theme from localStorage or sets default based on system preference
 * Applies theme on page load
 */
function loadTheme() {
  const themeText = darkModeToggle.querySelector("p");
  const themeIcon = darkModeToggle.querySelector("i");

  const initialTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  htmlElement.setAttribute("data-theme", initialTheme);

  const isDark = initialTheme === "dark";

  themeText.textContent = isDark ? "Light Mode" : "Dark Mode";
  themeIcon.className = isDark ? "fa-regular fa-sun" : "fa-regular fa-moon";
}

cardListContainer.addEventListener("click", (e) => {
  const cardLink = e.target.closest(".card-link");

  if (cardLink) {
    e.preventDefault();
    const countryCode = cardLink.dataset.countryCode;
    getCountryDetails(countryCode);
  }
});

loadMoreButton.addEventListener("click", loadMoreCountries);

backButton.addEventListener("click", () => {
  detailView.style.display = "none";
  listView.style.display = "block";
});

searchInput.addEventListener("input", (e) => {
  // ambil nilai inputan lalu ubah pastikan nilai tersebut dalam bentuk lowercase
  const searchQuery = e.target.value.toLowerCase();
  // filter data countries berdasarkan search query
  const filteredCountries = allCountriesData.filter((country) => {
    // kembalikan nilai yang sudah di filter
    return country.name.common.toLowerCase().includes(searchQuery);
  });

  cardListContainer.innerHTML = "";
  itemsLoaded = 0;
  loadMoreButton.style.display = "block";

  displayFilteredResults(filteredCountries);
});

// event listener untuk memastikan dropdown select buka dan tutup saat di klik
dropdownSelect.addEventListener("click", () => {
  dropdownMenu.classList.toggle("menu-open");
});

dropdownMenu.addEventListener("click", (e) => {
  if (e.target.matches("li")) {
    const selectedRegion = e.target.textContent;

    // update teks pada tombol dropdown
    dropdownSelect.querySelector("span").textContent = selectedRegion;

    // tutup menu setelah dipilih
    dropdownMenu.classList.remove("menu-open");

    // Jika all regions dipilih, tampilkan semua negara
    if (selectedRegion === "All Regions") {
      cardListContainer.innerHTML = "";
      itemsLoaded = 0;
      loadMoreButton.style.display = "block";
      loadMoreCountries();
    } else {
      loadMoreButton.style.display = "none";

      const filteredCountries = allCountriesData.filter((country) => {
        return country.region === selectedRegion;
      });

      displayAllCards(filteredCountries);
    }
  }
});

darkModeToggle.addEventListener("click", switchTheme);

document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  getAllCountries();
});
