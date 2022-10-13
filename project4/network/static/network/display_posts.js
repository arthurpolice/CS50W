function displayPosts(posts) {
  postWrappers = document.querySelectorAll('.post-wrapper')
  postWrappers.forEach((postWrapper) => postWrapper.remove())
  separators = document.querySelectorAll('.separator')
  separators.forEach((separator) => separator.remove())
  try {
  posts.forEach((post) => makePostWrapper(post))
  }
  catch {
    makePostWrapper(posts)
  }
}

function makePostWrapper(post) {
  separator = document.createElement('div')
  separator.classList.add('separator')

  wrapper = document.createElement('div')
  wrapper.classList.add('post-wrapper')

  avatarDiv = makePostAvatar(post)
  postDiv = makePost(post)

  wrapper.appendChild(avatarDiv)
  wrapper.appendChild(postDiv)

  document.querySelector('#posts').appendChild(separator)
  document.querySelector('#posts').appendChild(wrapper)
}

function makePost(post) {
  postDiv = document.createElement('div')
  postDiv.classList.add('post-div')

  headerDiv = makePostHeader(post)

  contentDiv = makePostContent(post)

  likeDiv = makePostLikeDiv(post)

  imageDiv = makePostImageDiv(post)

  typeDiv = makeTypeDiv(post)

  postDiv.appendChild(typeDiv)
  postDiv.appendChild(headerDiv)
  postDiv.appendChild(contentDiv)
  postDiv.appendChild(imageDiv)
  postDiv.appendChild(likeDiv)

  return postDiv
}

function makeTypeDiv(post) {
  typeDiv = document.createElement('div')
  typeDiv.innerHTML = post['type']
  typeDiv.classList.add('hidden', 'type-div')

  return typeDiv
}

function makePostAvatar(post) {
  avatarDiv = document.createElement('div')
  avatarDiv.classList.add('avatar-div')
  avatar = document.createElement('img')
  avatar.classList.add('avatar-small')
  checkAvatar(avatar, post['avatar'])
  avatarDiv.appendChild(avatar)

  return avatarDiv
}

function makePostHeader(post) {
  headerDiv = document.createElement('div')
  headerDiv.classList.add('post-header')

  username = document.createElement('a')
  username.classList.add('username')
  username.innerHTML = post['user']
  username.addEventListener('click', (ev) => {
    ev.stopPropagation()
    profilePage(post['user'])
  })

  postTime = document.createElement('p')
  postTime.classList.add('post-timestamp')
  postTime.innerHTML = post['timestamp']

    
  options = makeOptionsBtn(post)

  headerDiv.appendChild(username)
  headerDiv.appendChild(postTime)
  headerDiv.appendChild(options)

  return headerDiv
}

function makeOptionsBtn(post) {

  btnDiv = document.createElement('div')
  btnDiv.classList.add('dropdown')

  optionsDiv = document.createElement('div')
  optionsDiv.classList.add('dropdown-menu')

  btn = document.createElement('button')
  btn.classList.add('btn', 'btn-light', 'options-btn')
  btn.setAttribute('data-toggle', 'dropdown')
  btn.setAttribute('type', 'button')
  btn.setAttribute('aria-expanded', 'false')
  btn.innerHTML = '...'
  editOption = document.createElement('a')
  editOption.classList.add('dropdown-item', 'edit-btn', 'inactive-btn')
  if (post['type'] === 'post') {
    editOption.innerHTML = 'Edit Post'
  }
  else {
    editOption.innerHTML = 'Edit Comment'
  }
  if (post['user'] === post['current_user']) {
    editOption.classList.remove('inactive-btn')
    editOption.addEventListener('click', (ev) =>
    makeEditInterface(ev.currentTarget)
  )}
  optionsDiv.appendChild(editOption)
  btnDiv.appendChild(btn)
  btnDiv.appendChild(optionsDiv)

  return btnDiv
}

function makePostContent(post) {
  contentDiv = document.createElement('div')
  contentDiv.classList.add('post-content')

  content = document.createElement('p')
  content.classList.add('content')
  content.innerHTML = post['content']

  contentDiv.appendChild(content)

  return contentDiv
}

function makePostImageDiv(post) {
  imageDiv = document.createElement('div')
  imageDiv.classList.add('post-image-wrapper')

  if (post['image_url'] != null && post['image_url'] != '') {
    image = document.createElement('img')
    image.classList.add('post-image')
    image.src = post['image_url']

    imageDiv.appendChild(image)
  }
  return imageDiv
}

function makePostLikeDiv(post) {
  likeDiv = document.createElement('div')
  likeDiv.classList.add('like-div')

  postId = document.createElement('input')
  postId.value = post['id']
  postId.classList.add('hidden', 'id')

  svgHeart = document.querySelector('.svg-heart')

  likeBtn = makePostLikeBtn(post)
  likeCounter = makePostLikeCounter(post)

  likeDiv.appendChild(postId)
  likeDiv.appendChild(likeBtn)
  likeDiv.appendChild(likeCounter)

  return likeDiv
}

function makePostLikeBtn(post) {
  likeBtn = document.createElement('button')
  likeBtn.classList.add('like-btn')
  likeBtn.appendChild(svgHeart.cloneNode(true))
  likeStatusChecker(likeBtn, post)
  likeBtn.addEventListener('click', (ev) => {
    ev.stopPropagation()
    ev.currentTarget.disabled = true
    csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
    parent = ev.currentTarget.parentNode
    postId = parent.querySelector('input').value
    fetch(`/like/${post['type']}/${postId}`, {
      method: 'POST',
      headers: { 'X-CSRFToken': csrftoken },
      mode: 'same-origin',
    })
    icon = ev.currentTarget.querySelector('.svg-heart')
    likeBtnPress(ev.currentTarget, icon)
  })
  return likeBtn
}

function makePostLikeCounter(post) {
  likeCounter = document.createElement('span')
  likeCounter.classList.add('like-counter')
  likeCounter.innerHTML = post['likes_amount']

  return likeCounter
}

function likeStatusChecker(likeBtn, post) {
  if (post['like_status'] === true) {
    likeBtn.classList.add('already-liked')
    likeBtn.querySelector('svg').classList.add('red-heart')
  } else {
    likeBtn.classList.add('not-liked')
    likeBtn.querySelector('svg').classList.add('white-heart')
  }
}

function makeEditInterface(editBtn) {
  menu = editBtn.parentNode
  menuDiv = menu.parentNode
  headerDiv = menuDiv.parentNode
  wrapper = headerDiv.parentNode
  contentDiv = wrapper.querySelector('.post-content')


  inputArea = document.querySelector('#input-area')

  makeEditAreaPost(contentDiv, wrapper, inputArea)

  changeEditOption(editBtn, contentDiv)
}

function makeEditAreaPost(contentDiv, wrapper, inputArea) {
  
  imageDiv = wrapper.querySelector('.post-image-wrapper')
  try {
    imageUrl = imageDiv.querySelector('img').src
  } catch {
    imageUrl = ''
  }

  content = contentDiv.querySelector('.content').innerHTML

  contentDiv.replaceWith(inputArea.cloneNode(true))
  newPostInput = wrapper.querySelector('.post-input')
  newPostInput.value = content
  wrapper.querySelector('#image-input').value = imageUrl
  wrapper.querySelector('#image-input-div').classList.remove('unhidden-image-input')
  wrapper.querySelector('#image-input-div').classList.add('hidden-image-input')

  imageBtn = wrapper.querySelector('#image-btn')
  postBtn = wrapper.querySelector('#post-btn')
  postBtn.replaceWith(postBtn.cloneNode(true))
  editBtn = wrapper.querySelector('#post-btn')
  editBtn.innerHTML = 'Edit'
  editBtn.classList.remove('move-up')
  editBtn.classList.add('move-down')

  contentType = wrapper.querySelector('.type-div').innerHTML
  if (contentType === 'comment') {
    route = '/logcomment'
  }
  else if (contentType === 'post') {
    route = '/logpost'
  }

  displayUrlInput(imageBtn, editBtn)
  editBtn.addEventListener('click', (ev) => {
    ev.stopPropagation()
    wrapper = ev.currentTarget.parentNode.parentNode.parentNode
    wrapperCopy = wrapper.cloneNode(true)
    logData(wrapper, 'PUT', route)
    revertEditInterface(wrapper, wrapperCopy, contentDiv)
  })
}

function changeEditOption(editBtn, contentDiv) {
  newButton = editBtn.cloneNode(true)
  editBtn.replaceWith(newButton)
  newButton.addEventListener('click', (ev) => {
    ev.stopPropagation()
    cancelEditInterface(ev.currentTarget, contentDiv)
  })
  newButton.innerHTML = 'Close Editing'
}

function cancelEditInterface(element, contentDiv) {
  wrapper = element.parentNode.parentNode.parentNode.parentNode
  wrapper.querySelector('#input-area').replaceWith(contentDiv)
  element.innerHTML = 'Edit'
  newButton = element.cloneNode(true)
  element.replaceWith(newButton)
  newButton.addEventListener('click', (ev) => {
    ev.stopPropagation()
    makeEditInterface(ev.currentTarget)
  })
}

function revertEditInterface(wrapper, wrapperCopy, contentDiv) {
  displayEditedPost(wrapper, wrapperCopy, contentDiv)
  button = wrapper.querySelector('.edit-btn')
  newButton = button.cloneNode(true)
  button.replaceWith(newButton)
  newButton.innerHTML = 'Edit'
  newButton.addEventListener('click', (ev) => {
    ev.stopPropagation()
    makeEditInterface(ev.currentTarget)
  })
}

function displayEditedPost(wrapper, wrapperCopy, contentDiv) {
  postArea = wrapper.querySelector('#input-area')
  newContent = wrapperCopy.querySelector('#post-input').value
  newImage = wrapperCopy.querySelector('#image-input').value
  postArea.replaceWith(contentDiv)
  contentDiv.querySelector('.content').innerHTML = newContent
  try {
  wrapper.querySelector('.post-image').src = newImage
  }
  catch {}
}