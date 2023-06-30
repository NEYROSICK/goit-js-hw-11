import PixabayAPI from './js/pixabay-api';
import createCardsMarkup from './createCardsMarkup.hbs';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

const pixabayInstance = new PixabayAPI();

const formSearchEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = null;

loadMoreBtn.classList.add('is-hidden');

const renderPictures = async searchQuery => {
  try {
    const picturesArray = await pixabayInstance.fetchPictures(searchQuery);

    galleryEl.innerHTML = '';
    loadMoreBtn.classList.add('is-hidden');

    if (!searchQuery || picturesArray.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    Notify.success(`Hooray! We found ${picturesArray.totalHits} images.`);

    galleryEl.innerHTML = createCardsMarkup(picturesArray.hits);

    if (
      pixabayInstance.page * pixabayInstance.perPage >=
      picturesArray.totalHits
    ) {
      loadMoreBtn.classList.add('is-hidden');
      setTimeout(() => {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }, 1500);

      return;
    }

    loadMoreBtn.classList.remove('is-hidden');
  } catch (err) {
    console.warn(err);
  }
};

const renderMorePictures = async searchQuery => {
  try {
    const picturesArray = await pixabayInstance.loadMorePictures(searchQuery);

    galleryEl.insertAdjacentHTML(
      'beforeend',
      createCardsMarkup(picturesArray.hits)
    );

    if (
      pixabayInstance.page * pixabayInstance.perPage >=
      picturesArray.totalHits
    ) {
      loadMoreBtn.classList.add('is-hidden');

      setTimeout(() => {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }, 1500);
    }
  } catch (err) {
    console.warn(err);
  }
};

const handleSearchClick = event => {
  event.preventDefault();

  searchQuery = formSearchEl.firstElementChild.value;
  renderPictures(searchQuery);
};

const handleLoadClick = event => {
  searchQuery = formSearchEl.firstElementChild.value;
  renderMorePictures(searchQuery);
};

formSearchEl.addEventListener('submit', handleSearchClick);
loadMoreBtn.addEventListener('click', handleLoadClick);
