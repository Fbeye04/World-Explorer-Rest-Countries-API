const cardListContainer = document.getElementById("card-list");
const listView = document.querySelector(".list-view");
const detailView = document.querySelector(".detail-view");
const backButton = document.getElementById("back-button");

let allCountriesData = [];

function displayCountries(countries) {
  cardListContainer.innerHTML = "";

  countries.slice(0, 8).forEach((country) => {
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
    displayCountries(countries);
  } catch (error) {
    console.error("failed to retrieve data:", error);
  }
}

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

document.addEventListener("DOMContentLoaded", getAllCountries);

cardListContainer.addEventListener("click", (e) => {
  const cardLink = e.target.closest(".card-link");

  if (cardLink) {
    e.preventDefault();
    const countryCode = cardLink.dataset.countryCode;
    getCountryDetails(countryCode);
  }
});

backButton.addEventListener("click", () => {
  detailView.style.display = "none";
  listView.style.display = "block";
});
