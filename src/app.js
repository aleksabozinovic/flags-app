const popup = document.querySelector(".popup");

const state = {
  countries: {},
};

const loadCards = function () {
  const parentElement = document.querySelector(".cards");
  parentElement.innerHTML = "";

  const newData = state.countries.map((e) => e).slice(-8);
  newData.forEach((element) => {
    const markup = `
            <div data-id = ${element.cca2} data-region = ${element.region} class="card">
              <img class="card__image" src="${element.flags.png}" alt="" />
              <div class="card__description">
                <h1 class="card__flag">${element.name.common}</h1>
                <p>Population: <span>${element.population}</span></p>
                <p>Region: <span>${element.region}</span></p>
                <p>Capital: <span>${element.capital}</span></p>
              </div>
            </div>
      `;
    parentElement.insertAdjacentHTML("beforeend", markup);
  });
  state.currentCountry = newData;
};

const closeCard = function () {
  document.querySelector("html").style.overflowY = "visible";
  popup.classList.add("hidden");
};

const openCard = function (e) {
  const closestCard = e.target.closest(".card");

  const getCurrentId = state.currentCountry
    .map((e) => e)
    .find((element) => element.cca2 === e.target.getAttribute("data-id"));
  console.log(getCurrentId);
  // Converting objects to array, choose first element of array
  const currencies =
    getCurrentId.currencies[Object.keys(getCurrentId.currencies)[0]].name;
  const nativeName =
    getCurrentId.name.nativeName[Object.keys(getCurrentId.name.nativeName)[0]]
      .official;

  const languages = [Object.values(getCurrentId.languages)].map((e) => e);

  if (!closestCard) return;
  document.querySelector("html").style.overflowY = "hidden";

  popup.classList.remove("hidden");
  const markup = `
  <div class="popup__nav">
        <button class = 'back__button'><span>&#8592;</span>Back</button>
      </div>
      <div class="popup__main">
        <div class="popup__col--1">
          <img class="popup__image" src="${getCurrentId.flags.png}" alt="" />
        </div>
        <div class="popup__col--2">
          <h1>${getCurrentId.name.common}</h1>
          <div id="col--1">
            <p>Native name: <span>${nativeName}</span></p>
            <p>Population: <span>${getCurrentId.population}</span></p>
            <p>Region: <span>${getCurrentId.region}</span></p>
            <p>Sub Region: <span>${getCurrentId.subregion}</span></p>
            <p>Capital: <span>${getCurrentId.capital}</span></p>
          </div>
          <div id="col--2">
            <p>Top Level Domain: <span>${getCurrentId.tld}</span></p>
            <p>Currencies: <span>${currencies}</span></p>
            <p>${
              languages[0].length > 1 ? "Languages" : "Language"
            }: <span>${languages}</span></p>
          </div>

          <div class="borders">
            <p id="first__p">Border Countries:</p>
            <ul class="borders__countries">
           <li><p>${
             getCurrentId.borders ? getCurrentId.borders : "No borders! 😊"
           }</p></li>
              
              
            </ul>
          </div>
        </div>
      </div>
  `;
  popup.innerHTML = "";
  popup.insertAdjacentHTML("beforeend", markup);

  // 3) Close card
  document
    .querySelector(".back__button")
    .addEventListener("click", () => closeCard());
};

const getJSON = async function () {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/all`);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    state.countries = data;

    // 1) Load cards
    loadCards();

    // 2) Open card
    document.querySelectorAll(".card").forEach((element) => {
      element.addEventListener("click", function (e) {
        openCard(e);
      });
    });

    return data;
  } catch (err) {
    console.error(err);
  }
};

const countryInput = function (e) {
  e.preventDefault();
  const input = document.querySelector(".country__input");
  // Convert input to lower case
  input.value.toLowerCase();

  if (!input.value) return getJSON();

  // Check if input is number
  if (isFinite(input.value)) return alert("You can't put numbers");

  document.querySelector(".select__country").value = "none";

  getNameJSON(input.value);
  input.value = "";
};

const loadNewCards = function () {
  const parentElement = document.querySelector(".cards");
  parentElement.innerHTML = "";

  state.currentCountry.forEach((element) => {
    const markup = `
            <div data-id = ${element.cca2} data-region = ${element.region} class="card">
              <img class="card__image" src="${element.flags.png}" alt="" />
              <div class="card__description">
                <h1 class="card__flag">${element.name.common}</h1>
                <p>Population: <span>${element.population}</span></p>
                <p>Region: <span>${element.region}</span></p>
                <p>Capital: <span>${element.capital}</span></p>
              </div>
            </div>
      `;
    parentElement.insertAdjacentHTML("beforeend", markup);
  });
};

const getNameJSON = async function (name) {
  try {
    // Get data from api
    const res = await fetch(`https://restcountries.com/v3.1/name/${name}`);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    // Get 8 countries data
    const searchedData = data.map((e) => e).slice(-8);

    // Put countries in state object
    state.currentCountry = searchedData;

    // 1) Load cards
    loadNewCards();

    // 2) Open card
    document.querySelectorAll(".card").forEach((element) => {
      element.addEventListener("click", function (e) {
        openCard(e);
      });
    });

    return data;
  } catch (err) {
    return alert(`Country don't exist \n${err}`);
  }
};

const getRegionJSON = async function (region) {
  try {
    // Get data from api
    const res = await fetch(`https://restcountries.com/v3.1/region/${region}`);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    console.log(data);

    // Get 8 countries data
    const searchedData = data.map((e) => e).slice(-8);

    // Put countries in state object
    state.currentCountry = searchedData;

    // 1) Load cards
    loadNewCards();

    // 2) Open card
    document.querySelectorAll(".card").forEach((element) => {
      element.addEventListener("click", function (e) {
        openCard(e);
      });
    });

    return data;
  } catch (err) {
    return alert(err);
  }
};

// CHANGE REGION FUNCTION
const changeRegion = function (e) {
  const regionInput = e.target.value;
  if (regionInput === "all") return getJSON();
  getRegionJSON(regionInput);
};

// INIT FUNCTION
const init = function () {
  // Options
  document
    .querySelector(".select__country")
    .addEventListener("change", function (e) {
      changeRegion(e);
    });

  // Input
  document
    .querySelector(".country__form")
    .addEventListener("submit", function (e) {
      countryInput(e);
    });

  document
    .querySelector(".nav__div h1")
    .addEventListener("click", () => getJSON());
  getJSON();
};

init();
