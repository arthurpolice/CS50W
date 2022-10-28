// This is the comment variant of the displayPosts() function.
function displayComments(comments) {
  if (document.querySelector('#log').innerHTML === 'Log Out') {
  commentInputInterface()
  }
  const commentWrappers = document.querySelectorAll('.comment-wrapper')
  commentWrappers.forEach((commentWrapper) => commentWrapper.remove())
  const separators = document.querySelectorAll('.separator')
  separators.forEach((separator) => separator.remove())
  try {
    comments.forEach((comment) => makeCommentWrapper(comment))
  } catch {
    makeCommentWrapper(comments)
  }
}

// This is a separate function from the posts ones, because the comment input area is different, so we need to select different elements.
function commentInputInterface() {
  const commentBtn = document.querySelector('#comment-btn')
  const inputArea = document.querySelector('#comment-input-area')
  const imageBtn = document.querySelector('#comment-image-btn')
  displayUrlInput(imageBtn, commentBtn)

  commentBtn.addEventListener('click', () =>
    logData(inputArea, 'POST', '/logcomment')
  )
}

// After this point, we start using the functions in display_posts.js
function makeCommentWrapper(comment) {
  const separator = document.createElement('div')
  separator.classList.add('separator')

  const wrapper = document.createElement('div')
  wrapper.classList.add('comment-wrapper')

  const avatarDiv = makePostAvatar(comment)
  const postDiv = makePost(comment)

  wrapper.appendChild(avatarDiv)
  wrapper.appendChild(postDiv)

  document.querySelector('#comments').appendChild(separator)
  document.querySelector('#comments').appendChild(wrapper)
}
