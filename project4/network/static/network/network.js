// Backend Communication Section

function homepage(page) {
  document.querySelector("#profile-view").style.display = "none"
  document.querySelector("#post-view").style.display = "none"
  document.querySelector("#settings-view").style.display = "none"
  document.querySelector("#user-list-view").style.display = "none"
  document.querySelector("#homepage-view").style.display = "block"
  document.querySelector("#post-list-view").style.display = "block"
  csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value

  log_post()

  fetch(`/homepage/${page}`, {
    method: "POST",
    headers: { "X-CSRFToken": csrftoken },
    mode: "same-origin"
  })
    .then((posts) => posts.json())
    .then((posts) => {
      display_posts(posts['posts'])
      make_page_bar(posts)
    })
}


function log_post() {
  post_btn = document.querySelector("#post-btn")
  csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value
  image_btn = document.querySelector("#image-btn")
  
  display_url_input(image_btn, post_btn)

  post_btn.addEventListener("click", () => {
    content = document.querySelector("#post-input")
    image_url = document.querySelector("#image-input")
    if (((content.value != "") && (content.value != null)) || ((image_url.value != "") && (image_url.value != null))) {
      fetch("/logpost", {
        method: "POST",
        body: JSON.stringify({
          content: content.value,
          picture: image_url.value,
        }),
        headers: { "X-CSRFToken": csrftoken },
        mode: "same-origin",
      })
      content.value =""
      image_url.value =""
    }
  })
}

function profile_page(username) {
  document.querySelector("#profile-view").style.display = "block"
  document.querySelector("#post-view").style.display = "none"
  document.querySelector("#settings-view").style.display = "none"
  document.querySelector("#user-list-view").style.display = "none"
  document.querySelector("#homepage-view").style.display = "none"
  document.querySelector("#post-list-view").style.display = "block"
  csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value

  fetch(`/user/${username}`)
  .then((user) => user.json())
  .then((user) => {
    display_avatar(user)
    document.querySelector('#username').innerHTML = user['username']
    document.querySelector('#join-date').innerHTML = `Joined ${user['join_date']}`
    make_follow_button(username, user['follow_status'])
    get_posts(username, 1)
  })
}


function get_posts(username, page) {
  csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value
  fetch(`/profile/${username}/${page}`, {
    method: "POST",
    headers: { "X-CSRFToken": csrftoken },
    mode: "same-origin"
  })
  .then((posts) => posts.json())
  .then((posts) => {
    display_posts(posts['posts'])
    make_page_bar(posts)
  })
}

function search_user() {
  document.querySelector("#profile-view").style.display = "none"
  document.querySelector("#post-view").style.display = "none"
  document.querySelector("#settings-view").style.display = "none"
  document.querySelector("#user-list-view").style.display = "block"
  document.querySelector("#homepage-view").style.display = "none"
  document.querySelector("#post-list-view").style.display = "none"
}





// Frontend Creation Section

function make_follow_button(username, follow_status){
  follow_button = document.querySelector('#follow-button')
  follow_button.replaceWith(follow_button.cloneNode(true))
  follow_button = document.querySelector('#follow-button')
  change_follow_button(follow_button, follow_status)


  csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value
  if (username === document.querySelector('#current-user').value){
    follow_button.classList.add('hidden')
  }
  else if (follow_status === true) {
    follow_button.classList.add('already-followed')
    follow_button.innerHTML = "Unfollow"
  }
  follow_button.addEventListener('click', () => {
    fetch(`/follow/${username}`, {
      method: "POST",
      headers: { "X-CSRFToken": csrftoken },
      mode: "same-origin",
    })
  })
}

function change_follow_button(follow_button, follow_status) {
  if (follow_status === true) {
    follow_button.classList.add('already-followed')
    follow_button.innerHTML = "Unfollow"
    follow_button.addEventListener('click', () => unfollow(follow_button))
  }
  else {
    follow_button.classList.remove('already-followed')
    follow_button.innerHTML = "Follow"
    follow_status === true
    follow_button.addEventListener('click', () => follow(follow_button))
  }
}

function unfollow(follow_button) {
  follow_status = false
  follow_button.removeEventListener('click', () => unfollow(follow_button, follow_status))
  change_follow_button(follow_button, follow_status)
}

function follow(follow_button) {
  follow_status = true
  follow_button.removeEventListener('click', () => follow(follow_button, follow_status))
  change_follow_button(follow_button, follow_status)
}

function display_avatar(user) {
  avatar_wrapper = document.querySelector('#avatar-wrapper')
  if (avatar_wrapper.querySelector(".avatar") != null) {
    avatar_wrapper.removeChild(document.querySelector(".avatar"))
    avatar_wrapper = document.querySelector('#avatar-wrapper')
  }
  avatar = document.createElement('img')
  avatar.classList.add('avatar')
  check_avatar(avatar, user['avatar'])
  avatar_wrapper.appendChild(avatar)
}


function make_page_bar(posts) {
  console.log(posts['source'])
  preexisting_buttons = document.querySelectorAll('.page-item')
  preexisting_buttons.forEach((button) => button.remove())
  page_navbar = document.querySelector(".pagination")
  number_of_pages = posts['pages']
  for (var i = 0; i < number_of_pages; i++) {
    var li = document.createElement("li")
    var a = document.createElement("a")
    li.classList.add("page-item")
    a.classList.add("page-link")
    page_number = i + 1
    a.innerHTML = page_number
    li.appendChild(a)
    if (posts['source'] === "homepage"){
      li.addEventListener('click', (ev) => homepage(ev.target.innerHTML))
    }
    else if (posts['source'] === "profile_page") {
      li.addEventListener('click', (ev) => {
        get_posts(posts['user'], ev.target.innerHTML
        )}
      )
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

    separator = document.createElement("div")
    separator.classList.add("separator")

    wrapper = document.createElement("div")
    wrapper.classList.add("post-wrapper")

    post_div = document.createElement("div")
    post_div.classList.add("post-div")

    avatar_div = document.createElement("div")
    avatar_div.classList.add("avatar-div")

    like_div = document.createElement("div")
    like_div.classList.add("like-div")

    avatar = document.createElement("img")
    avatar.classList.add("avatar-small")
    check_avatar(avatar, post['avatar'])

    header_div = document.createElement("div")
    header_div.classList.add("post-header")

    username = document.createElement("a")
    username.classList.add("username")
    username.innerHTML = post["user"]
    username.addEventListener('click', () => profile_page(post['user']))

    post_time = document.createElement("p")
    post_time.classList.add("post-timestamp")
    post_time.innerHTML = post["timestamp"]

    content_div = document.createElement("div")
    content_div.classList.add("post-content")

    content = document.createElement("p")
    content.classList.add("content")
    content.innerHTML = post['content']

    image_div = document.createElement("div")
    image_div.classList.add("post-image-wrapper")

    if (post['image_url'] != null && post['image_url'] != ""){
 
      image = document.createElement('img')
      image.classList.add('post-image')
      image.src = post['image_url']

      image_div.appendChild(image)
    }

    post_id = document.createElement('input')
    post_id.value = post['id']
    post_id.classList.add('hidden')

    svg_heart = document.querySelector(".svg-heart")

    like_btn = document.createElement("button")
    like_btn.classList.add("like-btn")
    like_btn.appendChild(svg_heart.cloneNode(true))
    if (post['like_status'] === true) {
      like_btn.classList.add('already-liked')
      like_btn.querySelector('svg').classList.add('white-heart')
    }
    else {
      like_btn.classList.add('not-liked')
      like_btn.querySelector('svg').classList.add('red-heart')
    }
    like_btn.addEventListener('click', (ev) => {
      csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value
      parent = ev.currentTarget.parentNode
      post_id = parent.querySelector('input').value
      fetch(`/like/post/${post_id}`, {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        mode: "same-origin"
      })
      color_like_btn(ev.target)
    })

    like_div.appendChild(post_id)
    like_div.appendChild(like_btn)

    avatar_div.appendChild(avatar)

    header_div.appendChild(username)
    header_div.appendChild(post_time)

    content_div.appendChild(content)

    post_div.appendChild(header_div)
    post_div.appendChild(content_div)
    post_div.appendChild(image_div)
    post_div.appendChild(like_div)

    wrapper.appendChild(avatar_div)
    wrapper.appendChild(post_div)

    document.querySelector("#posts").appendChild(separator)
    document.querySelector("#posts").appendChild(wrapper)
  })
}






// Embelishments Section

function move_post_btn(post_btn) {
    if (post_btn.classList.contains("move-down")) {
      post_btn.style.animationPlayState = "running"
      post_btn.addEventListener("animationend", () => {
        post_btn.classList.remove("move-down")
        post_btn.classList.add("move-up")
        post_btn.style.animationPlayState = "paused"
      })
    } else {
      post_btn.style.animationPlayState = "running"
      post_btn.addEventListener("animationend", () => {
        post_btn.classList.remove("move-up")
        post_btn.classList.add("move-down")
        post_btn.style.animationPlayState = "paused"
      })
    }
  }

function display_url_input(image_btn, post_btn) {
  image_url_div = document.querySelector("#image-input-div")
  image_btn.addEventListener("click", () => {
    image_btn.disabled = true
    setTimeout(() => image_btn.disabled = false, 1000)
    if (image_url_div.classList.contains("hidden-image-input")) {
      image_url_div.style.animationPlayState = "running"
      move_post_btn(post_btn)
      image_url_div.addEventListener("animationend", () => {
        image_url_div.classList.remove("hidden-image-input")
        image_url_div.classList.add("unhidden-image-input")
        image_url_div.style.animationPlayState = "paused"
      })
    } else {
      image_url_div.style.animationPlayState = "running"
      move_post_btn(post_btn)
      image_url_div.addEventListener("animationend", () => {
        image_url_div.classList.add("hidden-image-input")
        image_url_div.classList.remove("unhidden-image-input")
        image_url_div.style.animationPlayState = "paused"
      })
    }
  })
}

function check_avatar(avatar_element, avatar_url){
  try {
    new URL(avatar_url)
    url = true
  }
  catch(e) {
    url = false
  }
  if(url === true) {
    avatar_element.src = avatar_url
  }
  else {
    avatar_element.src = "https://cdn3.vectorstock.com/i/thumb-large/11/72/outline-profil-user-or-avatar-icon-isolated-vector-35681172.jpg"
  }
}

function color_like_btn(like_btn) {
  if (like_btn.classList.contains("already-liked")) {
    like_btn.style.animationPlayState = "running"
    like_btn.addEventListener("animationend", () => {
      like_btn.classList.remove("already-liked")
      like_btn.classList.add("not-liked")
      like_btn.style.animationPlayState = "paused"
      like_btn.querySelector('svg').classList.remove('white-heart')
      like_btn.querySelector('svg').classList.add('red-heart')
    })
  } else {
    like_btn.style.animationPlayState = "running"
    like_btn.addEventListener("animationend", () => {
      like_btn.classList.remove("not-liked")
      like_btn.classList.add("already-liked")
      like_btn.style.animationPlayState = "paused"
      like_btn.querySelector('svg').classList.add('white-heart')
      like_btn.querySelector('svg').classList.remove('red-heart')
    })
  }
}