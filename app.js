const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');

// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {

  // ------------------------Extra Feature(Error message is search result empty)------------------------
  const errorMessage = document.getElementById("error-message");
  errorMessage.innerHTML = "";
  if (images.length == 0) {
    toggleSpinner(false);
    errorMessage.innerText = 'No results found';
  }
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = `
    <img class="img-fluid img-thumbnail image-preview" onmouseover="preview('${image.id}','over')" onmouseout="preview('${image.id}','out')" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">
    <div class="preview">
    <h4 class="previewId text-center d-none">${image.id}</h4>
    <h4 class="text-center">${image.user}</h4>
    </div>
    `;
    gallery.appendChild(div);
    toggleSpinner(false);
  })

}

// -------------Extra Feature(Showing Username on Mouse hover)------------------------------
const preview = (value, position) => {
  let userId = document.getElementsByClassName('previewId');
  for (let i = 0; i < userId.length; i++) {
    let id = userId[i];
    if (id.innerHTML == value) {
      if (position === 'over') {
        id.parentNode.style.opacity = 1;
      } else if (position === 'out') {
        id.parentNode.style.opacity = 0;
      }
    }
  }
}


const getImages = (query) => {
  toggleSpinner(true);
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch((err) => console.log(err));
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.toggle('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    sliders.splice(item, 1);
  }

  // ---------------------Extra feature(Number of selected Image showing)--------------------
  if (sliders.length > 0) {
    document.getElementById('slider-number').innerText = '(' + sliders.length + ')';
  } else {
    document.getElementById('slider-number').innerText = '';
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  const duration = parseInt(document.getElementById('duration').value) || 1000;
  // hide image aria
  imagesArea.style.display = 'none';
  sliders.forEach(slide => {
    let item = document.createElement('div');
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
  document.getElementById('slider-number').innerText = '';
})

sliderBtn.addEventListener('click', function () {
  var duration = document.getElementById('duration').value || 1000;
  if (duration > 0) {
    createSlider()
  }
  else if (duration <= 0) {
    document.getElementById('duration').value = '';
    alert("Duration can't be Negative.");
  } else {
    document.getElementById('duration').value = '';
    alert("Duration must be a number.");
  }
})

document.getElementById('search').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    searchBtn.click();
  }
})

// -------------------Extra Feature(Enter keyperss eventlistener for slider duration)----------------------
document.getElementById('duration').addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    sliderBtn.click();
  }
})

// --------------------Extra Feature(Loading spinner Toogller)------------------------------
const toggleSpinner = (show) => {
  const spinner = document.getElementById('spinner');
  if (show) {
    spinner.classList.remove('d-none');
  } else {
    spinner.classList.add('d-none');
  }
}
