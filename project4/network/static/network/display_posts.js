// This file is dedicated to creating the frontend for the posts (and partly the comments).

function displayPosts(posts) {
  // Remove all posts and separators to get a clean slate for the new posts.
  let postWrappers = document.querySelectorAll('.post-wrapper')
  postWrappers.forEach((postWrapper) => postWrapper.remove())
  let separators = document.querySelectorAll('.separator')
  separators.forEach((separator) => separator.remove())
  // This try/catch is needed due to the possibility of there being a single post returned, in which case the forEach breaks.
  try {
    posts.forEach((post) => makePostWrapper(post))
  } catch {
    makePostWrapper(posts)
  }
}

// The first stop: makes the separators and the wrappers, while calling the functions to fill the wrapper.
// Also the last stop: attaches the product of every other function in this file to the wrapper it created.
function makePostWrapper(post) {
  let separator = document.createElement('div')
  separator.classList.add('separator')

  let wrapper = document.createElement('div')
  wrapper.classList.add('post-wrapper')

  let avatarDiv = makePostAvatar(post)
  let postDiv = makePost(post)

  wrapper.appendChild(avatarDiv)
  wrapper.appendChild(postDiv)

  document.querySelector('#posts').appendChild(separator)
  document.querySelector('#posts').appendChild(wrapper)
}

// Makes the meat and potatoes of the post, then sends it to the wrapper function.
function makePost(post) {
  let postDiv = document.createElement('div')
  postDiv.classList.add('post-div')

  let headerDiv = makePostHeader(post)

  let contentDiv = makePostContent(post)

  let likeDiv = makePostLikeDiv(post)

  let imageDiv = makePostImageDiv(post)

  let typeDiv = makeTypeDiv(post)

  postDiv.appendChild(typeDiv)
  postDiv.appendChild(headerDiv)
  postDiv.appendChild(contentDiv)
  postDiv.appendChild(imageDiv)
  postDiv.appendChild(likeDiv)

  return postDiv
}

// This makes a hidden element that will indicate to other functions if this wrapper corresponds to a post or comment.
function makeTypeDiv(post) {
  let typeDiv = document.createElement('div')
  typeDiv.innerHTML = post['type']
  typeDiv.classList.add('hidden', 'type-div')

  return typeDiv
}

function makePostAvatar(post) {
  let avatarDiv = document.createElement('div')
  avatarDiv.classList.add('avatar-div')
  let avatar = document.createElement('img')
  avatar.classList.add('avatar-small')
  checkAvatar(avatar, post['avatar'])
  avatarDiv.appendChild(avatar)

  return avatarDiv
}

// Header gives information on the timestamp of the post and gives an access point to a user's profile.
function makePostHeader(post) {
  let headerDiv = document.createElement('div')
  headerDiv.classList.add('post-header')

  let username = makeUsername(post)

  let postTime = document.createElement('p')
  postTime.classList.add('post-timestamp')
  postTime.innerHTML = post['timestamp']

  let options = makeOptionsBtn(post)

  headerDiv.appendChild(username)
  headerDiv.appendChild(postTime)
  headerDiv.appendChild(options)

  return headerDiv
}

function makeUsername(post) {
  let usernameElement = document.createElement('a')
  usernameElement.classList.add('username')
  usernameElement.innerHTML = post['user']
  // Clicking on the username takes the user to the first page of that profile.
  usernameElement.addEventListener('click', (ev) => {
    let page = 1
    let username = ev.target.innerHTML
    profilePage(username)
    history.pushState(
      {
        feed: 'profile',
        page,
        username,
      },
      '',
      `/profile/${username}/${page}`
    )
  })
  return usernameElement
}

// Grab the text content given by the backend and display it.
function makePostContent(post) {
  let contentDiv = document.createElement('div')
  contentDiv.classList.add('post-content')

  let content = document.createElement('p')
  content.classList.add('content')
  content.innerHTML = post['content']

  contentDiv.appendChild(content)

  return contentDiv
}

// Grab the image url given by the backend (it's curated in the backend, so it shouldn't give bad urls) and display it.
function makePostImageDiv(post) {
  let imageDiv = document.createElement('div')
  imageDiv.classList.add('post-image-wrapper')

  if (post['image_url'] != null && post['image_url'] != '') {
    let image = document.createElement('img')
    image.classList.add('post-image')
    image.src = post['image_url']

    imageDiv.appendChild(image)
  }
  return imageDiv
}

// Make the bar with the like button and counter, and comment button and counter (if it's a post)
function makePostLikeDiv(post) {
  let likeDiv = document.createElement('div')
  likeDiv.classList.add('like-div')

  let postId = document.createElement('input')
  postId.value = post['id']
  postId.classList.add('hidden', 'id')

  let likeBtn = makePostLikeBtn(post)
  let likeCounter = makePostLikeCounter(post)

  let commentButton = makePostCommentBtn(post)
  let commentCounter = makePostCommentCounter(post)

  likeDiv.appendChild(postId)
  likeDiv.appendChild(likeBtn)
  likeDiv.appendChild(likeCounter)
  if (post['type'] === 'post') {
    likeDiv.appendChild(commentButton)
    likeDiv.appendChild(commentCounter)
  }

  return likeDiv
}

// Make the heart button and add the listeners for the little animation it does.
function makePostLikeBtn(post) {
  let likeBtn = document.createElement('button')
  likeBtn.classList.add('like-btn')

  // This is a hidden element placed in HTML to facilitate using dynamically generated vector images.
  let svgHeart = document.querySelector('.svg-heart')
  likeBtn.appendChild(svgHeart.cloneNode(true))

  likeStatusChecker(likeBtn, post)
  if (document.querySelector('#log').innerHTML === 'Log Out') {
    likeBtn.addEventListener('click', (ev) => {
      let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
      let parent = ev.currentTarget.parentNode
      let postId = parent.querySelector('input').value
      let icon = ev.currentTarget.querySelector('.svg-heart')
      // This prevents the like button click to bubble up to a wrapper click event!
      ev.stopPropagation()
      // Disable the button momentarily to let the animation play out, it's enabled again in the likeBtnPress function
      ev.currentTarget.disabled = true
      fetch(`/like/${post['type']}/${postId}`, {
        method: 'POST',
        headers: { 'X-CSRFToken': csrftoken },
        mode: 'same-origin',
      })
      likeBtnPress(ev.currentTarget, icon)
    })
  }
  else {
    likeBtn.addEventListener('click', () => {
      window.location.replace("/login")
    })
  }
  return likeBtn
}

function makePostLikeCounter(post) {
  let likeCounter = document.createElement('span')
  likeCounter.classList.add('like-counter')
  likeCounter.innerHTML = post['likes_amount']

  return likeCounter
}

// This function determines the initial state of the like button upon loading the post.
function likeStatusChecker(likeBtn, post) {
  if (post['like_status'] === true) {
    likeBtn.classList.add('already-liked')
    likeBtn.querySelector('svg').classList.add('red-heart')
  } else {
    likeBtn.classList.add('not-liked')
    likeBtn.querySelector('svg').classList.add('white-heart')
  }
}

function makePostCommentBtn() {
  let commentButton = document.createElement('button')
  commentButton.classList.add('comment-btn')

  let art = document.createElement('img')
  art.src = '/static/network/icons/bubble_icon.png'
  art.classList.add('comment-icon')

  commentButton.appendChild(art)

  commentButton.addEventListener('click', (ev) => {
    let likeDiv = ev.currentTarget.parentNode
    let id = likeDiv.querySelector('.id').value
    getSinglePost(id)
    document.querySelector('#comment-input').focus()
  })

  return commentButton
}

function makePostCommentCounter(post) {
  let commentCounter = document.createElement('span')
  commentCounter.classList.add('like-counter')
  commentCounter.innerHTML = post['comments_amount']

  return commentCounter
}

// This makes a bootstrap dropdown menu.
function makeOptionsBtn(post) {
  let btnDiv = document.createElement('div')
  btnDiv.classList.add('dropdown')

  let optionsDiv = document.createElement('div')
  optionsDiv.classList.add('dropdown-menu')

  let btn = document.createElement('button')
  btn.classList.add('btn', 'btn-light', 'options-btn')
  btn.setAttribute('data-toggle', 'dropdown')
  btn.setAttribute('type', 'button')
  btn.setAttribute('aria-expanded', 'false')
  btn.innerHTML = '...'

  let editOption = makeEditOption(post)
  let removeOption = makeRemoveOption(post)

  optionsDiv.appendChild(editOption)
  optionsDiv.appendChild(removeOption)
  btnDiv.appendChild(btn)
  btnDiv.appendChild(optionsDiv)

  return btnDiv
}

// Upon being clicked, this button will:
// Replace the post's content with a textarea pre-filled with the content and a button to submit the changes made.
function makeEditOption(post) {
  let editOption = document.createElement('a')
  editOption.classList.add('dropdown-item', 'edit-btn', 'inactive-btn')
  if (post['type'] === 'post') {
    editOption.innerHTML = 'Edit Post'
  } else {
    editOption.innerHTML = 'Edit Comment'
  }
  if (post['user'] === post['current_user']) {
    editOption.classList.remove('inactive-btn')
    editOption.addEventListener('click', (ev) => {
      makeEditInterface(ev.currentTarget)
    })
  }
  return editOption
}

// Upon being clicked, this button will:
// Do an animation to remove the post from the view.
// Send a fetch to delete the post from the database (removeData function).
function makeRemoveOption(post) {
  let removeOption = document.createElement('a')
  removeOption.classList.add('dropdown-item', 'remove-btn', 'inactive-btn')
  removeOption.innerHTML = 'Delete'
  if (post['user'] === post['current_user']) {
    removeOption.classList.remove('inactive-btn')
    removeOption.addEventListener('click', (ev) => {
      let menu = ev.currentTarget.parentNode
      let dropdownDiv = menu.parentNode
      let headerDiv = dropdownDiv.parentNode
      let postDiv = headerDiv.parentNode
      let wrapper = postDiv.parentNode
      wrapper.classList.add('remove-wrapper')
      removeData(post)
      wrapper.addEventListener('animationend', (ev) => {
        ev.currentTarget.remove()
      })
    })
  }
  return removeOption
}

function makeEditInterface(editBtn) {
  let menu = editBtn.parentNode
  let menuDiv = menu.parentNode
  let headerDiv = menuDiv.parentNode
  let postDiv = headerDiv.parentNode
  let wrapper = postDiv.parentNode
  let contentDiv = wrapper.querySelector('.post-content')

  let inputArea = document.querySelector('#input-area')
  // This removes the listener from the wrapper (that usually takes users to single post page). This is so people can actually click on the new interface.
  wrapper.removeEventListener('click', listenerSinglePostHandler)
  // This makes the textarea mentioned in makeEditOption.
  makeEditAreaPost(contentDiv, wrapper, inputArea)
  // This changes the edit option to make it do the opposite way (closing the edit interface).
  changeEditOption(editBtn, contentDiv)
}

function makeEditAreaPost(contentDiv, wrapper, inputArea) {
  let imageDiv = wrapper.querySelector('.post-image-wrapper')
  try {
    var imageUrl = imageDiv.querySelector('img').src
  } catch {
    var imageUrl = ''
  }
  // Select the area to be replaced.
  let content = contentDiv.querySelector('.content').innerHTML
  // Clone the input area from the input view and replace content with it.
  contentDiv.replaceWith(inputArea.cloneNode(true))
  let newPostInput = wrapper.querySelector('.post-input')
  // Insert the old content into the new textarea.
  newPostInput.value = content
  wrapper.querySelector('#image-input').value = imageUrl
  wrapper
    .querySelector('#image-input-div')
    .classList.remove('unhidden-image-input')
  wrapper.querySelector('#image-input-div').classList.add('hidden-image-input')

  let imageBtn = wrapper.querySelector('#image-btn')
  let postBtn = wrapper.querySelector('#post-btn')
  // Replace the post button with a clone of itself to clear it from old listeners.
  postBtn.replaceWith(postBtn.cloneNode(true))
  // Call it editBtn now.
  let editBtn = wrapper.querySelector('#post-btn')
  editBtn.innerHTML = 'Edit'
  // This makes sure that the edit button has the correct class for the animation of showing the image input.
  editBtn.classList.remove('move-up')
  editBtn.classList.add('move-down')
  // The type-div contains the type of content being edited. It's hidden in HTML.
  let contentType = wrapper.querySelector('.type-div').innerHTML
  // We're using it to determine the route we're sending the PUT request below.
  if (contentType === 'comment') {
    var route = '/logcomment'
  } else if (contentType === 'post') {
    var route = '/logpost'
  }
  // This function plays out the animation for revealing the image input.
  displayUrlInput(imageBtn, editBtn)
  editBtn.addEventListener('click', (ev) => {
    ev.stopPropagation()
    let wrapper = ev.currentTarget.parentNode.parentNode.parentNode
    // We copy the wrapper to store its information for use even after we've already replaced its contents.
    let wrapperCopy = wrapper.cloneNode(true)
    // Send new data to backend.
    logData(wrapper, 'PUT', route)
    // Remake the post, now with the new contents displayed. Without reloading the page.
    revertEditInterface(wrapper, wrapperCopy, contentDiv)
  })
}

// The same button used to start editing is now a button to cancel editing.
function changeEditOption(editBtn, contentDiv) {
  // Clone button to clear it from old listeners
  let newButton = editBtn.cloneNode(true)
  editBtn.replaceWith(newButton)
  newButton.addEventListener('click', (ev) => {
    // Transform the interface back into the old post. Also change the edit button back to its original state.
    cancelEditInterface(ev.currentTarget, contentDiv)
    let wrapper = contentDiv.parentNode.parentNode
    // Restore the listener to wrapper that got removed in makeEditAreaPost.
    wrapper.addEventListener('click', listenerSinglePostHandler)
  })
  newButton.innerHTML = 'Close Editing'
}

function cancelEditInterface(element, contentDiv) {
  let wrapper = element.parentNode.parentNode.parentNode.parentNode
  wrapper.querySelector('#input-area').replaceWith(contentDiv)
  if (wrapper.querySelector('.type-div').innerHTML === 'post') {
    element.innerHTML = 'Edit Post'
  } else {
    element.innerHTML = 'Edit Comment'
  }
  // Once again clone button to clear up listeners. This is done every time this button changes, as is obvious by now.
  let newButton = element.cloneNode(true)
  element.replaceWith(newButton)
  newButton.addEventListener('click', (ev) => {
    makeEditInterface(ev.currentTarget)
  })
}

// This is called when the post is actually edited and transposes the new input into the post's content in the frontend.
// Also changed the edit button in a similar way to the cancel edit function.
function revertEditInterface(wrapper, wrapperCopy, contentDiv) {
  displayEditedPost(wrapper, wrapperCopy, contentDiv)
  let button = wrapper.querySelector('.edit-btn')
  let newButton = button.cloneNode(true)
  button.replaceWith(newButton)
  if (wrapper.querySelector('.type-div').innerHTML === 'post') {
    newButton.innerHTML = 'Edit Post'
  } else {
    newButton.innerHTML = 'Edit Comment'
  }
  newButton.addEventListener('click', (ev) => {
    makeEditInterface(ev.currentTarget)
  })
}

function displayEditedPost(wrapper, wrapperCopy, contentDiv) {
  let postArea = wrapper.querySelector('#input-area')
  let newContent = wrapperCopy.querySelector('#post-input').value
  let newImage = wrapperCopy.querySelector('#image-input').value
  postArea.replaceWith(contentDiv)
  contentDiv.querySelector('.content').innerHTML = newContent
  // This try/catch is needed in case the post doesn't have an image, which breaks the querySelector.
  try {
    wrapper.querySelector('.post-image').src = newImage
  } catch {}
}
