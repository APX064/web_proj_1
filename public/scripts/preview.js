const fileInput = $('#updImg');
const previewImg = $('#preview img');

fileInput.on('change', (e) => {
  const file = fileInput[0].files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    previewImg.attr('src', event.target.result);
  };

  reader.readAsDataURL(file);
});

const fileInput2 = $('#addImg');
const previewImg2 = $('#preview2 img');

fileInput2.on('change', (e) => {
  const file2 = fileInput2[0].files[0];
  const reader2 = new FileReader();

  reader2.onload = (event2) => {
    previewImg2.attr('src', event2.target.result);
  };

  reader2.readAsDataURL(file2);
});