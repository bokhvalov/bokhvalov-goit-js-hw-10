import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputField: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputField.addEventListener(
  'input',
  debounce(OnInputField, DEBOUNCE_DELAY)
);

function OnInputField() {
  const countryName = refs.inputField.value.trim(' ');

  if (countryName) {
    fetchCountries(countryName)
      .then(response => procesResponse(response))
      .catch(() => Notify.failure('Oops, there is no country with that name'));
  } else {
    cleanMarkup();
  }
}

function procesResponse(response) {
  response.length < 2 && renderCountry(response);
  response.length < 11 && response.length > 1 && renderCountriesList(response);
  response.length > 10 &&
    Notify.info('Too many matches found. Please enter a more specific name.');
}

function renderCountriesList(response) {
  cleanMarkup();
  let markup = response.map(({ name, flags: { svg } }) => {
    return `<li class="country-list__item">
<img class="country-list__flag" src="${svg}" alt="Flag of ${name}"/>
${name}
</li>`;
  });
  refs.countryList.insertAdjacentHTML('beforeend', markup.join(''));
}

function renderCountry(response) {
  cleanMarkup();
  let markup = response.map(
    ({ name, capital, population, flags: { svg }, languages }) => {
      return `
  
  <h2 class="country-info__name">
    <img class="country-info__flag" src="${svg}" alt="Flag of ${name}"/>${name}
  </h2>
  <p><strong>Capital: </strong>${capital}</p>
  <p><strong>Population: </strong>${population}</p>
  <p><strong>Languages: </strong>${languages
    .map(language => {
      return language.name;
    })
    .join(', ')}</p>`;
    }
  );
  refs.countryInfo.insertAdjacentHTML('beforeend', markup.join(''));
  console.log();
}

function cleanMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
