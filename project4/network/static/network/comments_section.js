// This is the comment variant of the displayPosts() function.
function displayComments(comments) {
  if (document.querySelector('#log').innerHTML === 'Log Out') {
  commentInputInterface()
  }
  let commentWrappers = document.querySelectorAll('.comment-wrapper')
  commentWrappers.forEach((commentWrapper) => commentWrapper.remove())
  let separators = document.querySelectorAll('.separator')
  separators.forEach((separator) => separator.remove())
  try {
    comments.forEach((comment) => makeCommentWrapper(comment))
  } catch {
    makeCommentWrapper(comments)
  }
}

// This is a separate function from the posts ones, because the comment input area is different, so we need to select different elements.
function commentInputInterface() {
  let commentBtn = document.querySelector('#comment-btn')
  let inputArea = document.querySelector('#comment-input-area')
  let imageBtn = document.querySelector('#comment-image-btn')
  displayUrlInput(imageBtn, commentBtn)

  commentBtn.addEventListener('click', () =>
    logData(inputArea, 'POST', '/logcomment')
  )
}

// After this point, we start using the functions in display_posts.js
function makeCommentWrapper(comment) {
  let separator = document.createElement('div')
  separator.classList.add('separator')

  let wrapper = document.createElement('div')
  wrapper.classList.add('comment-wrapper')

  let avatarDiv = makePostAvatar(comment)
  let postDiv = makePost(comment)

  wrapper.appendChild(avatarDiv)
  wrapper.appendChild(postDiv)

  document.querySelector('#comments').appendChild(separator)
  document.querySelector('#comments').appendChild(wrapper)
}
