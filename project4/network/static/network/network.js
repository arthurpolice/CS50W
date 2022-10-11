// Set up navbar and post input UI.

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#log').innerHTML === 'Log Out') {
    postInputInterface()
    document
      .querySelector('#current-user-profile')
      .addEventListener('click', () =>
        profilePage(document.querySelector('#current-user').value)
      )
    document
      .querySelector('#homepage')
      .addEventListener('click', () => getFeed('homepage'))
  }
  document
    .querySelector('#network-button')
    .addEventListener('click', () => getFeed('homepage'))
  document
    .querySelector('#all-posts')
    .addEventListener('click', () => getFeed('all_posts'))
})

// Backend Communication Section

function getFeed(mode, page = 1) {
  document.querySelector('#profile-view').style.display = 'none'
  document.querySelector('#post-view').style.display = 'none'
  document.querySelector('#settings-view').style.display = 'none'
  document.querySelector('#user-list-view').style.display = 'none'
  document.querySelector('#post-list-view').style.display = 'block'
  if (mode === 'homepage') {
    document.querySelector('#post-input-view').style.display = 'block'
  } else {
    document.querySelector('#post-input-view').style.display = 'none'
  }

  csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value

  fetch(`/${mode}/${page}`, {
    method: 'POST',
    headers: { 'X-CSRFToken': csrftoken },
    mode: 'same-origin',
  })
    .then((posts) => posts.json())
    .then((posts) => {
      displayPosts(posts['posts'])
      makePageBar(posts)
    })
}

function logPost(parentNode, method) {
  content = parentNode.querySelector('#post-input')
  imageUrl = parentNode.querySelector('#image-input')
  if (method === 'PUT') {
    id = parentNode.querySelector('.post-id').value
  }
  else {
    id = null
  }
  if (
    (content.value != '' && content.value != null) ||
    (imageUrl.value != '' && imageUrl.value != null)
  ) {
    fetch('/logpost', {
      method: method,
      body: JSON.stringify({
        content: content.value,
        picture: imageUrl.value,
        id: id,
      }),
      headers: { 'X-CSRFToken': csrftoken },
      mode: 'same-origin',
    })
    content.value = ''
    imageUrl.value = ''
  }
}

function profilePage(username) {
  document.querySelector('#profile-view').style.display = 'block'
  document.querySelector('#post-view').style.display = 'none'
  document.querySelector('#settings-view').style.display = 'none'
  document.querySelector('#user-list-view').style.display = 'none'
  document.querySelector('#post-list-view').style.display = 'block'
  if (username === document.querySelector('#current-user').value) {
    document.querySelector('#post-input-view').style.display = 'block'
  } else {
    document.querySelector('#post-input-view').style.display = 'none'
  }

  csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value

  fetch(`/user/${username}`)
    .then((user) => user.json())
    .then((user) => {
      displayAvatar(user)
      document.querySelector('#username').innerHTML = user['username']
      document.querySelector(
        '#join-date'
      ).innerHTML = `Joined ${user['join_date']}`
      document.querySelector('#followers').innerHTML = `${user['follower_amount']} Followers`
      document.querySelector('#following').innerHTML = `${user['followed_amount']} Following`
      makeFollowButton(username, user['follow_status'])
      getPosts(username, 1)
    })
}

function getPosts(username, page) {
  csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  fetch(`/profile/${username}/${page}`, {
    method: 'POST',
    headers: { 'X-CSRFToken': csrftoken },
    mode: 'same-origin',
  })
    .then((posts) => posts.json())
    .then((posts) => {
      displayPosts(posts['posts'])
      makePageBar(posts)
    })
}

function searchUser() {
  document.querySelector('#profile-view').style.display = 'none'
  document.querySelector('#post-view').style.display = 'none'
  document.querySelector('#settings-view').style.display = 'none'
  document.querySelector('#user-list-view').style.display = 'block'
  document.querySelector('#post-input-view').style.display = 'none'
  document.querySelector('#post-list-view').style.display = 'none'
}

// Frontend Creation Section

function postInputInterface() {
  postBtn = document.querySelector('#post-btn')
  inputArea = document.querySelector('#input-area')
  csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  imageBtn = document.querySelector('#image-btn')

  displayUrlInput(imageBtn, postBtn)

  postBtn.addEventListener('click', () => logPost(inputArea, 'POST'))
}

function makeFollowButton(username, followStatus) {
  let followButton = document.querySelector('#follow-button')
  let newFollowButton = followButton.cloneNode(true)
  followButton.replaceWith(newFollowButton)
  changeFollowButton(newFollowButton, followStatus)

  csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  console.log(username === document.querySelector('#current-user').value)
  if (username === document.querySelector('#current-user').value) {
    newFollowButton.classList.add('hidden')
  } else if (followStatus === true) {
    newFollowButton.classList.add('already-followed')
    newFollowButton.innerHTML = 'Unfollow'
  }
  newFollowButton.addEventListener('click', () => {
    fetch(`/follow/${username}`, {
      method: 'POST',
      headers: { 'X-CSRFToken': csrftoken },
      mode: 'same-origin',
    })
  })
}

function changeFollowButton(followButton, followStatus) {
  if (followStatus === true) {
    followButton.classList.add('already-followed')
    followButton.innerHTML = 'Unfollow'
    followButton.addEventListener('click', () => unfollow(followButton))
  } else {
    followButton.classList.remove('already-followed')
    followButton.innerHTML = 'Follow'
    followStatus === true
    followButton.addEventListener('click', () => follow(followButton))
  }
}

function unfollow(followButton) {
  followStatus = false
  followButton.removeEventListener('click', () =>
    unfollow(followButton, followStatus)
  )
  changeFollowButton(followButton, followStatus)
}

function follow(followButton) {
  followStatus = true
  followButton.removeEventListener('click', () =>
    follow(followButton, followStatus)
  )
  changeFollowButton(followButton, followStatus)
}

function displayAvatar(user) {
  avatarWrapper = document.querySelector('#avatar-wrapper')
  if (avatarWrapper.querySelector('.avatar') != null) {
    avatarWrapper.removeChild(document.querySelector('.avatar'))
    avatarWrapper = document.querySelector('#avatar-wrapper')
  }
  avatar = document.createElement('img')
  avatar.classList.add('avatar')
  checkAvatar(avatar, user['avatar'])
  avatarWrapper.appendChild(avatar)
}

function makePageBar(posts) {
  preexistingButtons = document.querySelectorAll('.page-item')
  preexistingButtons.forEach((button) => button.remove())
  pageNavbar = document.querySelector('.pagination')
  numberOfPages = posts['pages']
  for (var i = 0; i < numberOfPages; i++) {
    var li = document.createElement('li')
    var a = document.createElement('a')
    li.classList.add('page-item')
    a.classList.add('page-link')
    pageNumber = i + 1
    a.innerHTML = pageNumber
    li.appendChild(a)
    if (posts['source'] === 'homepage' || posts['source'] === 'all_posts') {
      li.addEventListener('click', (ev) =>
        getFeed(posts['source'], ev.target.innerHTML)
      )
    } else if (posts['source'] === 'profile_page') {
      li.addEventListener('click', (ev) => {
        getPosts(posts['user'], ev.target.innerHTML)
      })
    }
    li.addEventListener('click', () => displayPosts(posts['posts']))
    pageNavbar.insertBefore(li, pageNavbar.children[i + 1])
  }
}

function displayPosts(posts) {
  postWrappers = document.querySelectorAll('.post-wrapper')
  postWrappers.forEach((postWrapper) => postWrapper.remove())
  separators = document.querySelectorAll('.separator')
  separators.forEach((separator) => separator.remove())
  posts.forEach((post) => {
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
  })
}

function makePost(post) {
  postDiv = document.createElement('div')
  postDiv.classList.add('post-div')

  headerDiv = makePostHeader(post)

  contentDiv = makePostContent(post)

  likeDiv = makePostLikeDiv(post)

  imageDiv = makePostImageDiv(post)

  postDiv.appendChild(headerDiv)
  postDiv.appendChild(contentDiv)
  postDiv.appendChild(imageDiv)
  postDiv.appendChild(likeDiv)

  return postDiv
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
  username.addEventListener('click', () => profilePage(post['user']))

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
  if (post['user'] === post['current_user']) {
    editOption = document.createElement('a')
    editOption.classList.add('dropdown-item', 'edit-btn')
    editOption.innerHTML = 'Edit Post'
    editOption.addEventListener('click', (ev) =>
      makeEditInterface(ev.currentTarget)
    )
  optionsDiv.appendChild(editOption)
 }

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
  postId.classList.add('hidden', 'post-id')

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
    ev.currentTarget.disabled = true
    csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
    parent = ev.currentTarget.parentNode
    postId = parent.querySelector('input').value
    fetch(`/like/post/${postId}`, {
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
  content = contentDiv.querySelector('.content').innerHTML
  imageDiv = wrapper.querySelector('.post-image-wrapper')
  try {
    imageUrl = imageDiv.querySelector('img').src
  } catch {
    imageUrl = ''
  }

  inputArea = document.querySelector('#input-area')

  makeEditAreaPost(contentDiv, wrapper, inputArea)

  changeEditOption(editBtn, contentDiv)
}

function makeEditAreaPost(contentDiv, wrapper, inputArea) {
  contentDiv.replaceWith(inputArea.cloneNode(true))
  newPostInput = wrapper.querySelector('#post-input')
  newPostInput.innerHTML = content
  wrapper.querySelector('#image-input').value = imageUrl

  imageBtn = wrapper.querySelector('#image-btn')
  postBtn = wrapper.querySelector('#post-btn')
  postBtn.replaceWith(postBtn.cloneNode(true))
  editBtn = wrapper.querySelector('#post-btn')
  editBtn.innerHTML = 'Edit'

  displayUrlInput(imageBtn, editBtn)
  editBtn.addEventListener('click', (ev) => {
    wrapper = ev.currentTarget.parentNode.parentNode.parentNode
    wrapperCopy = wrapper.cloneNode(true)
    logPost(wrapper, 'PUT')
    revertEditInterface(wrapper, wrapperCopy, contentDiv)
  })
}

function changeEditOption(editBtn, contentDiv) {
  newButton = editBtn.cloneNode(true)
  editBtn.replaceWith(newButton)
  newButton.addEventListener('click', (ev) =>
    cancelEditInterface(ev.currentTarget, contentDiv)
  )
  newButton.innerHTML = 'Close Editing'
}

function cancelEditInterface(element, contentDiv) {
  wrapper = element.parentNode.parentNode.parentNode.parentNode
  wrapper.querySelector('#input-area').replaceWith(contentDiv)
  element.innerHTML = 'Edit'
  newButton = element.cloneNode(true)
  element.replaceWith(newButton)
  newButton.addEventListener('click', (ev) => makeEditInterface(ev.currentTarget))
}

function revertEditInterface(wrapper, wrapperCopy, contentDiv) {
  displayEditedPost(wrapper, wrapperCopy, contentDiv)
  button = wrapper.querySelector('.edit-btn')
  newButton = button.cloneNode(true)
  button.replaceWith(newButton)
  newButton.innerHTML = 'Edit'
  newButton.addEventListener('click', (ev) => makeEditInterface(ev.currentTarget))
}

function displayEditedPost(wrapper, wrapperCopy, contentDiv) {
  postArea = wrapper.querySelector('#input-area')
  newContent = wrapperCopy.querySelector('#post-input').value
  newImage = wrapperCopy.querySelector('#image-input').value
  postArea.replaceWith(contentDiv)
  contentDiv.querySelector('.content').innerHTML = newContent
  wrapper.querySelector('.post-image').src = newImage
}

// Embelishments Section

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
  buttonDiv = imageBtn.parentNode
  inputDiv = buttonDiv.parentNode
  imageUrlDiv = inputDiv.querySelector('#image-input-div')
  imageBtn.addEventListener('click', () => {
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

function checkAvatar(avatarElement, avatarUrl) {
  try {
    new URL(avatarUrl)
    url = true
  } catch (e) {
    url = false
  }
  if (url === true) {
    avatarElement.src = avatarUrl
  } else {
    avatarElement.src =
      'https://cdn3.vectorstock.com/i/thumb-large/11/72/outline-profil-user-or-avatar-icon-isolated-vector-35681172.jpg'
  }
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
