import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import icon from './img/x-octagon.svg';

const userInput = document.querySelector('.data-select');
const userList = document.querySelector('.gallery-list');
const activeLoader = document.querySelector('.loader');

userInput.addEventListener('submit', e => {
  e.preventDefault();
  const userInputValue = userInput.elements.request.value.trim();
  userList.innerHTML = '';
  activeLoader.classList.toggle('loader-active');

  fetchGallery(userInputValue)
    .then(data => {
      renderGallery(data);
    })
    .catch(() => {
      iziToast.error({
        message: 'Something wrong. Please try again later!',
        messageColor: '#FAFAFB',
        messageSize: '16',
        messageLineHeight: '20',
        position: 'topRight',
        backgroundColor: '#EF4040',
        iconUrl: icon,
        icon: 'fa-regular',
        iconColor: '#FAFAFB',
        maxWidth: '500',
        transitionIn: 'bounceInLeft',
      });
    })
    .finally(() => {
      activeLoader.classList.toggle('loader-active');
      userInput.reset();
    });
});

const searchParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
});

function fetchGallery(userRequest) {
  return fetch(
    `https://pixabay.com/api/?key=41825347-2a0e6255edbe790f7737a6334&q=${userRequest}&${searchParams}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

function renderGallery(data) {
  if (data.totalHits <= 0) {
    iziToast.error({
      message:
        'Sorry, there are no images matching </br> your search query. Please try again!',
      messageColor: '#FAFAFB',
      messageSize: '16',
      messageLineHeight: '20',
      position: 'topRight',
      backgroundColor: '#EF4040',
      iconUrl: icon,
      iconColor: '#FAFAFB',
      maxWidth: '500',
      closeOnClick: true,
      close: false,
    });
  }
  const markup = data.hits
    .map(hit => {
      return `<li class="gallery-item">
          <a class="gallery-link" href="${hit.largeImageURL}">
    	      <img
		          class="gallery-image"
		          src="${hit.webformatURL}"
		          alt="${hit.tags}"
              width="360"
              height="200"
              ;
    	      />
            <ul class="info-list">
              <li class="info-item">
                <h class="item-title">Likes</h>
                <p class="item-content">${hit.likes}</p>
              </li>
              <li class="info-item">
                <h class="item-title">Views</h>
                <p class="item-content">${hit.views}</p>
              </li>
              <li class="info-item">
                <h class="item-title">Comments</h>
                <p class="item-content">${hit.comments}</p>
              </li>
              <li class="info-item">
                <h class="item-title">Downloads</h>
                <p class="item-content">${hit.downloads}</p>
              </li>
            </ul>
  		    </a>
        </li>`;
    })
    .join('');
  userList.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox('.gallery-list a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}