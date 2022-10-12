// Data retrievers

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
    currentPage = document.querySelector('#current-page')
    currentPage.innerHTML = page
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
  userInfo(username)
  getPosts(username, 1)
}


function userInfo(username) {
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


function getSinglePost(id) {
  document.querySelector('#profile-view').style.display = 'block'
  document.querySelector('#post-view').style.display = 'none'
  document.querySelector('#settings-view').style.display = 'none'
  document.querySelector('#user-list-view').style.display = 'none'
  document.querySelector('#post-list-view').style.display = 'block'
  document.querySelector('#post-input-view').style.display = 'none'

  csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value

  fetch(`post/${id}`, {
    method: 'POST',
    headers: { 'X-CSRFToken': csrftoken },
    mode: 'same-origin'
  })
  .then((response) => response.json())
  .then((response) => {
    displayPosts(response['post'])
    userInfo(response['post']['user'])
    preexistingButtons = document.querySelector('.pagination').remove()
    displayComments(response['comments'])
  })
}


// Data senders

function logData(parentNode, method, route) {
  content = parentNode.querySelector('.post-input')
  imageUrl = parentNode.querySelector('.image-input')
  if (route === '/logcomment') {
    id = document.querySelector('.post-id').value
  }
  else if (method === 'PUT') {
    id = parentNode.querySelector('.post-id').value
  }
  else {
    id = null
  }
  if (
    (content.value != '' && content.value != null) ||
    (imageUrl.value != '' && imageUrl.value != null)
  ) {
    fetch(`${route}`, {
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