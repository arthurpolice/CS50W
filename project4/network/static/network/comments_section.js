function displayComments(comments) {
  commentInputInterface()
  let commentWrappers = document.querySelectorAll('.comment-wrapper')
  commentWrappers.forEach((commentWrapper) => commentWrapper.remove())
  separators = document.querySelectorAll('.separator')
  separators.forEach((separator) => separator.remove())
  try {
  comments.forEach((comment) => makeCommentWrapper(comment))
  }
  catch {
    makeCommentWrapper(comments)
  }
}

function commentInputInterface() {
  commentBtn = document.querySelector('#comment-btn')
  inputArea = document.querySelector('#comment-input-area')
  csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  imageBtn = document.querySelector('#comment-image-btn')
  displayUrlInput(imageBtn, commentBtn)

  commentBtn.addEventListener('click', () => logData(inputArea, 'POST', '/logcomment'))
}

function makeCommentWrapper(comment) {
  separator = document.createElement('div')
  separator.classList.add('separator')

  wrapper = document.createElement('div')
  wrapper.classList.add('comment-wrapper')

  avatarDiv = makePostAvatar(comment)
  postDiv = makePost(comment)

  wrapper.appendChild(avatarDiv)
  wrapper.appendChild(postDiv)

  document.querySelector('#comments').appendChild(separator)
  document.querySelector('#comments').appendChild(wrapper)
}