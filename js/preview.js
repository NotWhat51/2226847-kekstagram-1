const TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const fileType = document.querySelector('input[type=file]');
const preview = document.querySelector('.img-upload__preview').querySelector('img');

fileType.addEventListener('change', () => {
  const file = fileType.files[0];
  const fileName = file.name.toLowerCase();

  const match = TYPES.some((it) => fileName.endsWith(it));

  if (match) {
    const link = URL.createObjectURL(file);
    preview.src = link;
  }
});
