const TYPES = ['.gif', '.jpg', '.jpeg', '.png'];

const typeFile = document.querySelector('input[type=file]');
const imgUploadPreviewElement = document.querySelector('.img-upload__preview').querySelector('img');
const effectsPreview = document.querySelectorAll('.effects__preview');

typeFile.addEventListener('change', () => {
  const file = typeFile.files[0];
  const fileName = file.name.toLowerCase();

  const match = TYPES.some((it) => fileName.endsWith(it));

  if (match) {
    const link = URL.createObjectURL(file);
    imgUploadPreviewElement.src = link;
    for (const effect of effectsPreview) {
      effect.style.backgroundImage = `url(${link})`;
    }
  }
});
