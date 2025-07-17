# Frontend Mentor - REST Countries API with color theme switcher solution

This is a solution to the [REST Countries API with color theme switcher challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/rest-countries-api-with-color-theme-switcher-5cacc469fec04111f7b848ca). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- See all countries from the API on the homepage
- Search for a country using an `input` field
- Filter countries by region
- Click on a country to see more detailed information on a separate page
- Click through to the border countries on the detail page
- Toggle the color scheme between light and dark mode _(optional)_

### Links

- Solution URL: [Repository](https://github.com/Fbeye04/World-Explorer-Rest-Countries-API)
- Live Site URL: [Live site](https://fbeye04.github.io/World-Explorer-Rest-Countries-API/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- Vanilla JavaScript - For all interactive logic
- REST Countries API - For data

### What I learned

This project was a fantastic learning journey, taking me from zero to understanding how dynamic web applications work. Some of my major learnings include:

#### Fetching Data with an API (async/await)

I learned how to communicate with an external API for the first time. I started with .then() chaining and later refactored to the more modern and readable async/await syntax. I also learned the importance of try...catch for robust error handling.

// Storing all country data to be used across the application
let allCountriesData = [];

async function fetchAllCountries() {
try {
const response = await fetch(
"https://restcountries.com/v3.1/all?fields=flags,name,population,region,capital,cca3"
);
if (!response.ok) {
throw new Error(`HTTP error! status: ${response.status}`);
}
const countries = await response.json();
allCountriesData = countries; // Save data to the global "dictionary"
loadMoreCountries(); // Display the first batch
} catch (error) {
console.error("failed to retrieve data:", error);
}
}

#### Robust and Responsive Grid Layouts

1. I faced a significant challenge in making the country cards have a uniform height despite their varying content. The solution was a combination of modern CSS techniques:
2. CSS Grid with grid-auto-rows to force each row to have a consistent height.
3. Flexbox inside each card (display: flex, flex-direction: column) to manage the internal content.
4. aspect-ratio on the images to ensure all flags have consistent dimensions.
5. flex-grow: 1 and margin-top: auto on the description area to dynamically push the info block to the bottom, creating perfect alignment.

.card-list {
display: grid;
gap: 3rem;
/_ KEY #1: Force each row to have the same height _/
grid-auto-rows: 380px;
}

.card {
display: flex;
flex-direction: column;
height: 100%; /_ KEY #2: Force the card to fill the grid cell _/
}

.card-description {
display: flex;
flex-direction: column;
flex-grow: 1; /_ KEY #3: Force this area to fill remaining space _/
}

.additional-info {
margin-top: auto; /_ KEY #4: Push this block to the very bottom _/
}

#### Dark Mode Implementation & localStorage

I learned how to build a dark mode feature from scratch. This involved using CSS Custom Properties for theming, toggling a data-theme attribute on the <html> element, and most importantly, using localStorage to persist the user's choice across sessions.

#### Performance Optimization with a "Load More" Button

Displaying 250+ countries at once caused slow performance. I implemented a "Load More" button that dynamically loads the next batch of items when requested, providing a much better user experience than loading everything at once.

## Author

- LinkedIn - [Muhammad Fachrezi Barus](https://www.linkedin.com/in/muhammad-fachrezi-barus/)
- Frontend Mentor - [@Fbeye04](https://www.frontendmentor.io/profile/Fbeye04)
- GitHub - [@Fbeye04](https://github.com/Fbeye04)
