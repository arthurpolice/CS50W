// Data retrievers

function getFeed(mode, page = 1) {
  document.querySelector('#profile-view').style.display = 'none'
  document.querySelector('#post-view').style.display = 'none'
  document.querySelector('#settings-view').style.display = 'none'
  document.querySelector('#user-list-view').style.display = 'none'
  document.querySelector('#post-list-view').style.display = 'block'
  document.querySelector('#comments-view').style.display = 'none'

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
      listenerSinglePost()
    })
  currentPage = document.querySelector('#current-page')
  currentPage.innerHTML = page
}

function profilePage(username, page = 1) {
  document.querySelector('#profile-view').style.display = 'block'
  document.querySelector('#post-view').style.display = 'none'
  document.querySelector('#settings-view').style.display = 'none'
  document.querySelector('#user-list-view').style.display = 'none'
  document.querySelector('#post-list-view').style.display = 'block'
  document.querySelector('#comments-view').style.display = 'none'
  if (username === document.querySelector('#current-user').value) {
    document.querySelector('#post-input-view').style.display = 'block'
  } else {
    document.querySelector('#post-input-view').style.display = 'none'
  }
  userInfo(username)
  getPosts(username, page)
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
      document.querySelector(
        '#followers'
      ).innerHTML = `${user['follower_amount']} `
      document.querySelector(
        '#following'
      ).innerHTML = `${user['followed_amount']} `
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
      listenerSinglePost()
    })
}

function getSinglePost(id) {
  document.querySelector('#profile-view').style.display = 'none'
  document.querySelector('#post-view').style.display = 'none'
  document.querySelector('#settings-view').style.display = 'none'
  document.querySelector('#user-list-view').style.display = 'none'
  document.querySelector('#post-list-view').style.display = 'block'
  document.querySelector('#post-input-view').style.display = 'none'
  document.querySelector('#comments-view').style.display = 'block'

  csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value

  fetch(`/post/${id}`, {
    method: 'POST',
    headers: { 'X-CSRFToken': csrftoken },
    mode: 'same-origin',
  })
    .then((response) => response.json())
    .then((response) => {
      displayPosts(response['post'])
      preexistingButtons = document
        .querySelector('.pagination')
        .classList.add('hidden')
      displayComments(response['comments'])
    })
}

function listenerSinglePost() {
  wrappers = document.querySelectorAll('.post-wrapper')
  wrappers.forEach((wrapper) => {
    wrapper.addEventListener('click', listenerSinglePostHandler)
  })
}

function listenerSinglePostHandler(ev) {
  if (
    ev.target.classList.contains('btn') === false &&
    ev.target.classList.contains('dropdown-menu') === false &&
    ev.target.classList.contains('dropdown-item') === false &&
    ev.target.classList.contains('username') === false
  ) {
    id = ev.currentTarget.querySelector('.id').value
    getSinglePost(id)
    history.pushState(
      {
        feed: 'single_post',
        id,
      },
      '',
      `/post/${id}`
    )
  }
}

// Data senders

function logData(parentNode, method, route) {
  content = parentNode.querySelector('.post-input')
  imageUrl = parentNode.querySelector('.image-input')
  if (method === 'PUT') {
    id = parentNode.querySelector('.id').value
  } else if (route === '/logcomment') {
    id = document.querySelector('.id').value
  } else {
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
        id,
      }),
      headers: { 'X-CSRFToken': csrftoken },
      mode: 'same-origin',
    })
    content.value = ''
    imageUrl.value = ''
    if (route === '/logpost') {
      username = document.querySelector('#current-user').value
      setTimeout(() => profilePage(username), 500)
    } else {
      getSinglePost(id)
    }
  }
}

function removeData(post) {
  route = 'remove' + post['type']
  console.log(route)
  id = post['id']
  console.log(id)
  fetch(`/${route}/${id}`, {
    method: 'post',
    headers: { 'X-CSRFToken': csrftoken },
    mode: 'same-origin',
  })
}
