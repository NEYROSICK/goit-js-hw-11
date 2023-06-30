import axios from 'axios';

export default class PixabayAPI {
  #API_KEY = '37980943-b03ccb6ea553c94b671e9389e';
  #BASE_URL = 'https://pixabay.com/api/';

  page = 1;
  perPage = 40;

  fetchPictures = async query => {
    this.page = 1;

    const response = await axios.get(this.#BASE_URL, {
      params: {
        key: this.#API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: this.perPage,
      },
    });

    if (response.status !== 200) {
      throw new Error(response.status);
    }

    this.totalHits = response.data.totalHits;

    return await response.data;
  };

  loadMorePictures = async query => {
    this.page += 1;

    const response = await axios.get(this.#BASE_URL, {
      params: {
        key: this.#API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: 40,
      },
    });

    if (response.status !== 200) {
      throw new Error(response.status);
    }

    return await response.data;
  };
}
