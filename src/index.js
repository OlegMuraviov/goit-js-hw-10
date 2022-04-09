import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputNode = document.querySelector('#search-box');
const countryInfoNode = document.querySelector('.country-info');
const countryListNode = document.querySelector('.country-list');

inputNode.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(event) {
  return fetchCountries(event.target.value)
    .then(searchResult => {
      if (searchResult.length > 10) {
        countryInfoNode.innerHTML = '';
        countryListNode.innerHTML = '';
        return Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      }
      searchResult.length === 1 ? markupCountry(searchResult) : markupList(searchResult);
    })
    .catch(reject => {
      countryInfoNode.innerHTML = '';
      countryListNode.innerHTML = '';
      return Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function markupList(data) {
  countryInfoNode.innerHTML = '';
  countryListNode.innerHTML = data
    .map(element => {
      return `<li class="country-item">
    <img class = "flag-svg" src="${element.flags.svg}" alt="flag">
    <p>${element.name.official}</p></li>`;
    })
    .join('');
}

function markupCountry(data) {
  countryListNode.innerHTML = '';
  countryInfoNode.innerHTML = `
     <div class="country-thumb">
     <img class = "flag-svg" src="${data[0].flags.svg}" alt="flag">
     <h2>${data[0].name.official}</h2>
     </div>
      <div class="values-title">Capital:<p>${data[0].capital}</p></div>
      <div class="values-title">Population:<p>${data[0].population}</p></div>
      <div class="values-title">Languages:<p>${Object.values(data[0].languages)
        .map((str, index, array) => {
          if (index === array.length - 1) return str + ' ';
          return str + ', ';
        })
        .join('')}</p></div>
      
      `;
}
