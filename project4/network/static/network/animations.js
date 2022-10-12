function movePostBtn(postBtn) {
  if (postBtn.classList.contains('move-down')) {
    postBtn.style.animationPlayState = 'running'
    postBtn.addEventListener('animationend', () => {
      postBtn.classList.remove('move-down')
      postBtn.classList.add('move-up')
      postBtn.style.animationPlayState = 'paused'
    })
  } else {
    postBtn.style.animationPlayState = 'running'
    postBtn.addEventListener('animationend', () => {
      postBtn.classList.remove('move-up')
      postBtn.classList.add('move-down')
      postBtn.style.animationPlayState = 'paused'
    })
  }
}

function displayUrlInput(imageBtn, postBtn) {
    console.log(imageBtn)
    imageBtn.addEventListener('click', (ev) => {
    buttonDiv = ev.currentTarget.parentNode
    inputDiv = buttonDiv.parentNode
    imageUrlDiv = inputDiv.querySelector('.image-input-div')
    imageBtn.disabled = true
    setTimeout(() => (imageBtn.disabled = false), 1000)
    if (imageUrlDiv.classList.contains('hidden-image-input')) {
      imageUrlDiv.style.animationPlayState = 'running'
      movePostBtn(postBtn)
      imageUrlDiv.addEventListener('animationend', () => {
        imageUrlDiv.classList.remove('hidden-image-input')
        imageUrlDiv.classList.add('unhidden-image-input')
        imageUrlDiv.style.animationPlayState = 'paused'
      })
    } else {
      imageUrlDiv.style.animationPlayState = 'running'
      movePostBtn(postBtn)
      imageUrlDiv.addEventListener('animationend', () => {
        imageUrlDiv.classList.add('hidden-image-input')
        imageUrlDiv.classList.remove('unhidden-image-input')
        imageUrlDiv.style.animationPlayState = 'paused'
      })
    }
  })
}

function likeBtnPress(likeBtn, icon) {
  if (likeBtn.classList.contains('already-liked')) {
    likeBtn.style.animationPlayState = 'running'
    icon.style.animationPlayState = 'running'
    changeLikeCounter(likeBtn, -1)
    likeBtn.addEventListener('animationend', () => {
      likeBtn.classList.remove('already-liked')
      likeBtn.classList.add('not-liked')
      likeBtn.style.animationPlayState = 'paused'
      icon.style.animationPlayState = 'paused'
      icon.classList.remove('red-heart')
      icon.classList.add('white-heart')
      likeBtn.disabled = false
    })
  } else {
    icon.style.animationPlayState = 'running'
    likeBtn.style.animationPlayState = 'running'
    changeLikeCounter(likeBtn, 1)
    likeBtn.addEventListener('animationend', () => {
      likeBtn.classList.remove('not-liked')
      likeBtn.classList.add('already-liked')
      likeBtn.style.animationPlayState = 'paused'
      icon.style.animationPlayState = 'paused'
      icon.classList.add('red-heart')
      icon.classList.remove('white-heart')
      likeBtn.disabled = false
    })
  }
}

function changeLikeCounter(likeBtn, amount) {
  likeCounter = likeBtn.parentNode.querySelector('.like-counter')
  likeCounter.innerHTML = parseInt(likeCounter.innerHTML) + parseInt(amount)
}