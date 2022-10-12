function postInputInterface() {
  postBtn = document.querySelector('#post-btn')
  inputArea = document.querySelector('#input-area')
  csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  imageBtn = document.querySelector('#image-btn')

  displayUrlInput(imageBtn, postBtn)

  postBtn.addEventListener('click', () => logData(inputArea, 'POST', '/logpost'))
}