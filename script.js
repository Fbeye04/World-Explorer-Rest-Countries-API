const cardListContainer = document.getElementById("card-list");

function displayCountries(countries) {
  cardListContainer.innerHTML = "";

  countries.slice(0, 6).forEach((country) => {
    const countryCardHTML = `
            <a href="#">
              <article class="card">
                <img src="${country.flags.svg}" alt="${country.name.common}" />

                <div class="card-description">
                  <h2>${country.name.common}</h2>

                  <ul class="additional-info">
                    <li><strong>Population:</strong> ${country.population}</li>
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

async function getAllCountries() {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=flags,name,population,region,capital"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const countries = await response.json();
    displayCountries(countries);
  } catch (error) {
    console.error("failed to retrieve data:", error);
  }
}

document.addEventListener("DOMContentLoaded", getAllCountries);
