function postInputInterface() {
  const postBtn = document.querySelector('#post-btn')
  const inputArea = document.querySelector('#input-area')
  const imageBtn = document.querySelector('#image-btn')

  // Sets up the little animation for displaying the input for image urls.
  displayUrlInput(imageBtn, postBtn)

  postBtn.addEventListener('click', () =>
    logData(inputArea, 'POST', '/logpost')
  )
}
