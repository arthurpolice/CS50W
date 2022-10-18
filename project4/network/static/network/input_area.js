function postInputInterface() {
  let postBtn = document.querySelector('#post-btn')
  let inputArea = document.querySelector('#input-area')
  let imageBtn = document.querySelector('#image-btn')

  // Sets up the little animation for displaying the input for image urls.
  displayUrlInput(imageBtn, postBtn)

  postBtn.addEventListener('click', () => logData(inputArea, 'POST', '/logpost'))
}