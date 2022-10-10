// Set up navbar and post input UI.

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#log').innerHTML === 'Log Out') {
    post_input_interface()
    document
      .querySelector('#current-user-profile')
      .addEventListener('click', () =>
        profile_page(document.querySelector('#current-user').value)
      )
    document
      .querySelector('#homepage')
      .addEventListener('click', () => get_feed('homepage'))
  }
  document
    .querySelector('#network-button')
    .addEventListener('click', () => get_feed('homepage'))
  document
    .querySelector('#all-posts')
    .addEventListener('click', () => get_feed('all_posts'))
})

// Backend Communication Section

function get_feed(mode, page = 1) {
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
      display_posts(posts['posts'])
      make_page_bar(posts)
    })
}

function log_post(parent_node, method) {
  content = parent_node.querySelector('#post-input')
  image_url = parent_node.querySelector('#image-input')
  if (method === 'PUT') {
    id = parent_node.querySelector('.post-id').value
  }
  if (
    (content.value != '' && content.value != null) ||
    (image_url.value != '' && image_url.value != null)
  ) {
    fetch('/logpost', {
      method: method,
      body: JSON.stringify({
        content: content.value,
        picture: image_url.value,
        id: id,
      }),
      headers: { 'X-CSRFToken': csrftoken },
      mode: 'same-origin',
    })
    content.value = ''
    image_url.value = ''
  }
}

function profile_page(username) {
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
      display_avatar(user)
      document.querySelector('#username').innerHTML = user['username']
      document.querySelector(
        '#join-date'
      ).innerHTML = `Joined ${user['join_date']}`
      make_follow_button(username, user['follow_status'])
      get_posts(username, 1)
    })
}

function get_posts(username, page) {
  csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  fetch(`/profile/${username}/${page}`, {
    method: 'POST',
    headers: { 'X-CSRFToken': csrftoken },
    mode: 'same-origin',
  })
    .then((posts) => posts.json())
    .then((posts) => {
      display_posts(posts['posts'])
      make_page_bar(posts)
    })
}

function search_user() {
  document.querySelector('#profile-view').style.display = 'none'
  document.querySelector('#post-view').style.display = 'none'
  document.querySelector('#settings-view').style.display = 'none'
  document.querySelector('#user-list-view').style.display = 'block'
  document.querySelector('#post-input-view').style.display = 'none'
  document.querySelector('#post-list-view').style.display = 'none'
}

// Frontend Creation Section

function post_input_interface() {
  post_btn = document.querySelector('#post-btn')
  input_area = document.querySelector('#input-area')
  csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  image_btn = document.querySelector('#image-btn')

  display_url_input(image_btn, post_btn)

  post_btn.addEventListener('click', () => log_post(input_area, 'POST'))
}

function make_follow_button(username, follow_status) {
  follow_button = document.querySelector('#follow-button')
  follow_button.replaceWith(follow_button.cloneNode(true))
  follow_button = document.querySelector('#follow-button')
  change_follow_button(follow_button, follow_status)

  csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  if (username === document.querySelector('#current-user').value) {
    follow_button.classList.add('hidden')
  } else if (follow_status === true) {
    follow_button.classList.add('already-followed')
    follow_button.innerHTML = 'Unfollow'
  }
  follow_button.addEventListener('click', () => {
    fetch(`/follow/${username}`, {
      method: 'POST',
      headers: { 'X-CSRFToken': csrftoken },
      mode: 'same-origin',
    })
  })
}

function change_follow_button(follow_button, follow_status) {
  if (follow_status === true) {
    follow_button.classList.add('already-followed')
    follow_button.innerHTML = 'Unfollow'
    follow_button.addEventListener('click', () => unfollow(follow_button))
  } else {
    follow_button.classList.remove('already-followed')
    follow_button.innerHTML = 'Follow'
    follow_status === true
    follow_button.addEventListener('click', () => follow(follow_button))
  }
}

function unfollow(follow_button) {
  follow_status = false
  follow_button.removeEventListener('click', () =>
    unfollow(follow_button, follow_status)
  )
  change_follow_button(follow_button, follow_status)
}

function follow(follow_button) {
  follow_status = true
  follow_button.removeEventListener('click', () =>
    follow(follow_button, follow_status)
  )
  change_follow_button(follow_button, follow_status)
}

function display_avatar(user) {
  avatar_wrapper = document.querySelector('#avatar-wrapper')
  if (avatar_wrapper.querySelector('.avatar') != null) {
    avatar_wrapper.removeChild(document.querySelector('.avatar'))
    avatar_wrapper = document.querySelector('#avatar-wrapper')
  }
  avatar = document.createElement('img')
  avatar.classList.add('avatar')
  check_avatar(avatar, user['avatar'])
  avatar_wrapper.appendChild(avatar)
}

function make_page_bar(posts) {
  preexisting_buttons = document.querySelectorAll('.page-item')
  preexisting_buttons.forEach((button) => button.remove())
  page_navbar = document.querySelector('.pagination')
  number_of_pages = posts['pages']
  for (var i = 0; i < number_of_pages; i++) {
    var li = document.createElement('li')
    var a = document.createElement('a')
    li.classList.add('page-item')
    a.classList.add('page-link')
    page_number = i + 1
    a.innerHTML = page_number
    li.appendChild(a)
    if (posts['source'] === 'homepage' || posts['source'] === 'all_posts') {
      li.addEventListener('click', (ev) =>
        get_feed(posts['source'], ev.target.innerHTML)
      )
    } else if (posts['source'] === 'profile_page') {
      li.addEventListener('click', (ev) => {
        get_posts(posts['user'], ev.target.innerHTML)
      })
    }
    li.addEventListener('click', () => display_posts(posts['posts']))
    page_navbar.insertBefore(li, page_navbar.children[i + 1])
  }
}

function display_posts(posts) {
  post_wrappers = document.querySelectorAll('.post-wrapper')
  post_wrappers.forEach((post_wrapper) => post_wrapper.remove())
  separators = document.querySelectorAll('.separator')
  separators.forEach((separator) => separator.remove())
  posts.forEach((post) => {
    separator = document.createElement('div')
    separator.classList.add('separator')

    wrapper = document.createElement('div')
    wrapper.classList.add('post-wrapper')

    avatar_div = make_post_avatar(post)
    post_div = make_post(post)

    wrapper.appendChild(avatar_div)
    wrapper.appendChild(post_div)

    document.querySelector('#posts').appendChild(separator)
    document.querySelector('#posts').appendChild(wrapper)
  })
}

function make_post(post) {
  post_div = document.createElement('div')
  post_div.classList.add('post-div')

  header_div = make_post_header(post)

  content_div = make_post_content(post)

  like_div = make_post_like_div(post)

  image_div = make_post_image_div(post)

  post_div.appendChild(header_div)
  post_div.appendChild(content_div)
  post_div.appendChild(image_div)
  post_div.appendChild(like_div)

  return post_div
}

function make_post_avatar(post) {
  avatar_div = document.createElement('div')
  avatar_div.classList.add('avatar-div')
  avatar = document.createElement('img')
  avatar.classList.add('avatar-small')
  check_avatar(avatar, post['avatar'])
  avatar_div.appendChild(avatar)

  return avatar_div
}

function make_post_header(post) {
  header_div = document.createElement('div')
  header_div.classList.add('post-header')

  username = document.createElement('a')
  username.classList.add('username')
  username.innerHTML = post['user']
  username.addEventListener('click', () => profile_page(post['user']))

  post_time = document.createElement('p')
  post_time.classList.add('post-timestamp')
  post_time.innerHTML = post['timestamp']

  options = make_options_btn()

  header_div.appendChild(username)
  header_div.appendChild(post_time)
  header_div.appendChild(options)

  return header_div
}

function make_options_btn() {
  btn_div = document.createElement('div')
  btn_div.classList.add('dropdown')

  options_div = document.createElement('div')
  options_div.classList.add('dropdown-menu')

  btn = document.createElement('button')
  btn.classList.add('btn', 'btn-light', 'options-btn')
  btn.setAttribute('data-toggle', 'dropdown')
  btn.setAttribute('type', 'button')
  btn.setAttribute('aria-expanded', 'false')
  btn.innerHTML = '...'

  edit_option = document.createElement('a')
  edit_option.classList.add('dropdown-item', 'edit-btn')
  edit_option.innerHTML = 'Edit Post'
  edit_option.addEventListener('click', (ev) =>
    make_edit_interface(ev.currentTarget)
  )

  btn_div.appendChild(btn)
  options_div.appendChild(edit_option)
  btn_div.appendChild(options_div)

  return btn_div
}

function make_post_content(post) {
  content_div = document.createElement('div')
  content_div.classList.add('post-content')

  content = document.createElement('p')
  content.classList.add('content')
  content.innerHTML = post['content']

  content_div.appendChild(content)

  return content_div
}

function make_post_image_div(post) {
  image_div = document.createElement('div')
  image_div.classList.add('post-image-wrapper')

  if (post['image_url'] != null && post['image_url'] != '') {
    image = document.createElement('img')
    image.classList.add('post-image')
    image.src = post['image_url']

    image_div.appendChild(image)
  }
  return image_div
}

function make_post_like_div(post) {
  like_div = document.createElement('div')
  like_div.classList.add('like-div')

  post_id = document.createElement('input')
  post_id.value = post['id']
  post_id.classList.add('hidden', 'post-id')

  svg_heart = document.querySelector('.svg-heart')

  like_btn = make_post_like_btn(post)
  like_counter = make_post_like_counter(post)

  like_div.appendChild(post_id)
  like_div.appendChild(like_btn)
  like_div.appendChild(like_counter)

  return like_div
}

function make_post_like_btn(post) {
  like_btn = document.createElement('button')
  like_btn.classList.add('like-btn')
  like_btn.appendChild(svg_heart.cloneNode(true))
  like_status_checker(like_btn, post)
  like_btn.addEventListener('click', (ev) => {
    ev.currentTarget.disabled = true
    csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
    parent = ev.currentTarget.parentNode
    post_id = parent.querySelector('input').value
    fetch(`/like/post/${post_id}`, {
      method: 'POST',
      headers: { 'X-CSRFToken': csrftoken },
      mode: 'same-origin',
    })
    icon = ev.currentTarget.querySelector('.svg-heart')
    like_btn_press(ev.currentTarget, icon)
  })
  return like_btn
}

function make_post_like_counter(post) {
  like_counter = document.createElement('span')
  like_counter.classList.add('like-counter')
  like_counter.innerHTML = post['likes_amount']

  return like_counter
}

function like_status_checker(like_btn, post) {
  if (post['like_status'] === true) {
    like_btn.classList.add('already-liked')
    like_btn.querySelector('svg').classList.add('red-heart')
  } else {
    like_btn.classList.add('not-liked')
    like_btn.querySelector('svg').classList.add('white-heart')
  }
}

function make_edit_interface(edit_btn) {
  menu = edit_btn.parentNode
  menu_div = menu.parentNode
  header_div = menu_div.parentNode
  wrapper = header_div.parentNode

  content_div = wrapper.querySelector('.post-content')
  content = content_div.querySelector('.content').innerHTML
  image_div = wrapper.querySelector('.post-image-wrapper')
  try {
    image_url = image_div.querySelector('img').src
  } catch {
    image_url = ''
  }

  input_area = document.querySelector('#input-area')

  make_edit_area_post(content_div, wrapper, input_area)

  change_edit_option(edit_btn, content_div)
}

function make_edit_area_post(content_div, wrapper, input_area) {
  content_div.replaceWith(input_area.cloneNode(true))
  new_post_input = wrapper.querySelector('#post-input')
  new_post_input.innerHTML = content
  wrapper.querySelector('#image-input').value = image_url

  image_btn = wrapper.querySelector('#image-btn')
  post_btn = wrapper.querySelector('#post-btn')
  post_btn.replaceWith(post_btn.cloneNode(true))
  edit_btn = wrapper.querySelector('#post-btn')
  edit_btn.innerHTML = 'Edit'

  display_url_input(image_btn, edit_btn)
  edit_btn.addEventListener('click', (ev) => {
    wrapper = ev.currentTarget.parentNode.parentNode.parentNode
    wrapper_copy = wrapper.cloneNode(true)
    log_post(wrapper, 'PUT')
    revert_edit_interface(wrapper, wrapper_copy, content_div)
  })
}

function change_edit_option(edit_btn, content_div) {
  new_button = edit_btn.cloneNode(true)
  edit_btn.replaceWith(new_button)
  new_button.addEventListener('click', (ev) =>
    cancel_edit_interface(ev.currentTarget, content_div)
  )
  new_button.innerHTML = 'Close Editing'
}

function cancel_edit_interface(element, content_div) {
  wrapper = element.parentNode.parentNode.parentNode.parentNode
  wrapper.querySelector('#input-area').replaceWith(content_div)
  element.innerHTML = 'Edit'
  new_button = element.cloneNode(true)
  element.replaceWith(new_button)
  new_button.addEventListener('click', (ev) => make_edit_interface(ev.currentTarget))
}

function revert_edit_interface(wrapper, wrapper_copy, content_div) {
  display_edited_post(wrapper, wrapper_copy, content_div)
  button = wrapper.querySelector('.edit-btn')
  new_button = button.cloneNode(true)
  button.replaceWith(new_button)
  new_button.innerHTML = 'Edit'
  new_button.addEventListener('click', (ev) => make_edit_interface(ev.currentTarget))
}

function display_edited_post(wrapper, wrapper_copy, content_div) {
  post_area = wrapper.querySelector('#input-area')
  new_content = wrapper_copy.querySelector('#post-input').value
  new_image = wrapper_copy.querySelector('#image-input').value
  post_area.replaceWith(content_div)
  content_div.querySelector('.content').innerHTML = new_content
  wrapper.querySelector('.post-image').src = new_image
}

// Embelishments Section

function move_post_btn(post_btn) {
  if (post_btn.classList.contains('move-down')) {
    post_btn.style.animationPlayState = 'running'
    post_btn.addEventListener('animationend', () => {
      post_btn.classList.remove('move-down')
      post_btn.classList.add('move-up')
      post_btn.style.animationPlayState = 'paused'
    })
  } else {
    post_btn.style.animationPlayState = 'running'
    post_btn.addEventListener('animationend', () => {
      post_btn.classList.remove('move-up')
      post_btn.classList.add('move-down')
      post_btn.style.animationPlayState = 'paused'
    })
  }
}

function display_url_input(image_btn, post_btn) {
  button_div = image_btn.parentNode
  input_div = button_div.parentNode
  image_url_div = input_div.querySelector('#image-input-div')
  image_btn.addEventListener('click', () => {
    image_btn.disabled = true
    setTimeout(() => (image_btn.disabled = false), 1000)
    if (image_url_div.classList.contains('hidden-image-input')) {
      image_url_div.style.animationPlayState = 'running'
      move_post_btn(post_btn)
      image_url_div.addEventListener('animationend', () => {
        image_url_div.classList.remove('hidden-image-input')
        image_url_div.classList.add('unhidden-image-input')
        image_url_div.style.animationPlayState = 'paused'
      })
    } else {
      image_url_div.style.animationPlayState = 'running'
      move_post_btn(post_btn)
      image_url_div.addEventListener('animationend', () => {
        image_url_div.classList.add('hidden-image-input')
        image_url_div.classList.remove('unhidden-image-input')
        image_url_div.style.animationPlayState = 'paused'
      })
    }
  })
}

function check_avatar(avatar_element, avatar_url) {
  try {
    new URL(avatar_url)
    url = true
  } catch (e) {
    url = false
  }
  if (url === true) {
    avatar_element.src = avatar_url
  } else {
    avatar_element.src =
      'https://cdn3.vectorstock.com/i/thumb-large/11/72/outline-profil-user-or-avatar-icon-isolated-vector-35681172.jpg'
  }
}

function like_btn_press(like_btn, icon) {
  if (like_btn.classList.contains('already-liked')) {
    like_btn.style.animationPlayState = 'running'
    icon.style.animationPlayState = 'running'
    change_like_counter(like_btn, -1)
    like_btn.addEventListener('animationend', () => {
      like_btn.classList.remove('already-liked')
      like_btn.classList.add('not-liked')
      like_btn.style.animationPlayState = 'paused'
      icon.style.animationPlayState = 'paused'
      icon.classList.remove('red-heart')
      icon.classList.add('white-heart')
      like_btn.disabled = false
    })
  } else {
    icon.style.animationPlayState = 'running'
    like_btn.style.animationPlayState = 'running'
    change_like_counter(like_btn, 1)
    like_btn.addEventListener('animationend', () => {
      like_btn.classList.remove('not-liked')
      like_btn.classList.add('already-liked')
      like_btn.style.animationPlayState = 'paused'
      icon.style.animationPlayState = 'paused'
      icon.classList.add('red-heart')
      icon.classList.remove('white-heart')
      like_btn.disabled = false
    })
  }
}

function change_like_counter(like_btn, amount) {
  like_counter = like_btn.parentNode.querySelector('.like-counter')
  like_counter.innerHTML = parseInt(like_counter.innerHTML) + parseInt(amount)
}
