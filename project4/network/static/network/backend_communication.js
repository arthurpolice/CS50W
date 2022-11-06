// Data retrievers

// Gets posts for the called app mode. It'll either be homepage or all posts for this one.
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

  let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  // Fetch the data, then send it to the frontend functions.
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
  // Set up the current-page element, so the next and previous pagination arrows can use it.
  let currentPage = document.querySelector('#current-page')
  currentPage.innerHTML = page
}

// Gets posts corresponding to a given user's profile. Also gets that profile's data.
function profilePage(username, page = 1) {
  document.querySelector('#profile-view').style.display = 'block'
  document.querySelector('#post-view').style.display = 'none'
  document.querySelector('#settings-view').style.display = 'none'
  document.querySelector('#user-list-view').style.display = 'none'
  document.querySelector('#post-list-view').style.display = 'block'
  document.querySelector('#comments-view').style.display = 'none'

  try {
  // If the current user is visiting their own profile, they can post new things.
    if (username === document.querySelector('#current-user').value) {
      document.querySelector('#post-input-view').style.display = 'block'
    } else {
      document.querySelector('#post-input-view').style.display = 'none'
    }
  }
  catch {
    document.querySelector('#post-input-view').style.display = 'none'
  }
  userInfo(username)
  getPosts(username, page)
}

// This function is in charge of the header of the profile page.
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

// Fetches the posts from a user, then sends them to the frontend functions. Is called by profilePage.
function getPosts(username, page) {
  let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
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

// Retrieves a single post from the database and sends it to the frontend functions. Also calls the comments functions (which come with the data from this route).
function getSinglePost(id) {
  document.querySelector('#profile-view').style.display = 'none'
  document.querySelector('#post-view').style.display = 'none'
  document.querySelector('#settings-view').style.display = 'none'
  document.querySelector('#user-list-view').style.display = 'none'
  document.querySelector('#post-list-view').style.display = 'block'
  document.querySelector('#post-input-view').style.display = 'none'
  document.querySelector('#comments-view').style.display = 'block'

  let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value

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

// Sets up a click listener on the wrappers to send the user to the singlePost page corresponding to that clicked post.
function listenerSinglePost() {
  let wrappers = document.querySelectorAll('.post-wrapper')
  wrappers.forEach(wrapper => {
    wrapper.addEventListener('click', listenerSinglePostHandler)
  })
}

// Prevents the triggering of listenerSinglePost when clicking on elements that should take priority over it.
// Some elements within the wrapper have the stopPropagation() approach instead.
function listenerSinglePostHandler(ev) {
  if (
    ev.target.classList.contains('btn') === false &&
    ev.target.classList.contains('dropdown-menu') === false &&
    ev.target.classList.contains('dropdown-item') === false &&
    ev.target.classList.contains('username') === false
  ) {
    // This id is contained in every single wrapper and is hidden by default.
    let id = ev.currentTarget.querySelector('.id').value
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
  const content = parentNode.querySelector('.post-input')
  const imageUrl = parentNode.querySelector('.image-input')
  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  // The decision process is as follows:
  // Base state is sending a new post to the database and there being no existing ID to consult.
  let id = null
  // Method PUT means we're altering a post with an existing id, so we can catch it.
  if (method === 'PUT') {
    id = parentNode.querySelector('.id').value
  }
  // Route /logcomment means we're sending a comment to a posts's reply section. That post has a preexisting id to be caught.
  // This query selector catches the first element of class id, which is, in this design, always going to be the post's ID.
  // Should this design change, this might need to be changed, as even comments have IDs.
  else if (route === '/logcomment') {
    id = document.querySelector('.id').value
  }
  // Make sure the post/comment isn't completely empty. (AKA it must have at least some text OR an image.)
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
    // Reset the input area to be empty after the fetch is done.
    content.value = ''
    imageUrl.value = ''
    // Display the user's profile page, if it's a new post.
    if (route === '/logpost') {
      const username = document.querySelector('#current-user').value
      setTimeout(() => profilePage(username), 500)
    } else {
      getSinglePost(id)
    }
  }
}

function removeData(post) {
  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  // Route for post deletion is based on the 'type' key attributed to the backend to this post/comment.
  const route = 'remove' + post['type']
  const id = post['id']
  fetch(`/${route}/${id}`, {
    method: 'post',
    headers: { 'X-CSRFToken': csrftoken },
    mode: 'same-origin',
  })
}
