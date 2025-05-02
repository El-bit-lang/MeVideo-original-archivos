const uploadInput = document.getElementById('video-upload');
const gallery = document.getElementById('gallery');
const playerModal = document.getElementById('player-modal');
const mainVideo = document.getElementById('main-video');
const videoTitle = document.getElementById('video-title');
const closeBtn = document.getElementById('close-btn');

let videosData = JSON.parse(localStorage.getItem('videosData')) || [];

function saveVideosData() {
  localStorage.setItem('videosData', JSON.stringify(videosData));
}

function createVideoCard(videoObject, index) {
  const card = document.createElement('div');
  card.className = 'video-card';
  card.dataset.index = index;

  if (videoObject && videoObject.url) {
    const video = document.createElement('video');
    video.src = videoObject.url;
    video.muted = true;
    video.loop = true;
    video.play();

    card.appendChild(video);

    // Botón eliminar
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '🗑 Eliminar';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();  // Evitar que el click en el botón se propague al card
      deleteVideo(index);
    });
    card.appendChild(deleteBtn);

    card.addEventListener('click', () => {
      mainVideo.src = videoObject.url;
      videoTitle.textContent = videoObject.name;
      playerModal.classList.remove('hidden');
    });

  } else {
    // Cuadro vacío
    card.classList.add('empty');
    card.innerHTML = '<p>+ Añadir video</p>';

    card.addEventListener('click', () => {
      selectVideoForSlot(index);
    });
  }

  gallery.appendChild(card);
}

function deleteVideo(index) {
  // Eliminar video del array
  videosData[index] = null;
  saveVideosData();
  refreshGallery();
}

function selectVideoForSlot(index) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'video/*';
  input.click();

  input.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const videoObject = { name: file.name, url };

    videosData[index] = videoObject;
    saveVideosData();
    refreshGallery();
  });
}

function refreshGallery() {
  gallery.innerHTML = '';

  videosData.forEach((video, index) => {
    createVideoCard(video, index);
  });

  // Siempre agregar un cuadro vacío al final
  createVideoCard(null, videosData.length);
}

uploadInput.addEventListener('change', (event) => {
  const files = Array.from(event.target.files);

  files.forEach(file => {
    const url = URL.createObjectURL(file);
    const videoObject = { name: file.name, url };

    videosData.push(videoObject);
  });

  saveVideosData();
  refreshGallery();
});

closeBtn.addEventListener('click', () => {
  mainVideo.pause();
  playerModal.classList.add('hidden');
});

// Inicializar (limpiar los cuadros)
function resetGalleryOnStart() {
  if (videosData.length === 0 || videosData.every(v => v === null)) {
    gallery.innerHTML = ''; // Limpiar todos los cuadros
  } else {
    refreshGallery(); // Si hay videos guardados, los carga
  }
}

resetGalleryOnStart();
