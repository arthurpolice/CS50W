// Set up the default view
document.addEventListener("DOMContentLoaded", () => {
  homepage(1)
  log_post()
})

function homepage(page) {
  document.querySelector("#profile-view").style.display = "none"
  document.querySelector("#post-view").style.display = "none"
  document.querySelector("#settings-view").style.display = "none"
  document.querySelector("#user-list-view").style.display = "none"
  document.querySelector("#homepage-view").style.display = "block"
  document.querySelector("#post-list-view").style.display = "block"
  fetch(`/homepage/${page}`)
    .then((posts) => posts.json())
    .then((posts) => {
      console.log(posts)
      display_posts(posts['posts'])
      make_page_bar(posts)
    })
}

function profile_page(username) {
  document.querySelector("#profile-view").style.display = "block"
  document.querySelector("#post-view").style.display = "none"
  document.querySelector("#settings-view").style.display = "none"
  document.querySelector("#user-list-view").style.display = "none"
  document.querySelector("#homepage-view").style.display = "none"
  document.querySelector("#post-list-view").style.display = "block"

  fetch(`user/${username}`)
  .then((user) => user.json())
  .then((user) => {
    console.log("call")
    display_avatar(user)
    document.querySelector('#username').innerHTML = user['username']
    document.querySelector('#join-date').innerHTML = user['join_date']
  })

  make_follow_button()
  make_post_section(username)
}

function make_post_section(username, page) {
  fetch(`/profile/${username}/${page}`)
  .then((posts) => posts.json())
  .then((posts) => {
    display_posts(posts['posts'])
    make_page_bar(posts['pages'])
  })
}

function make_follow_button(){
  follow_button = document.querySelector('#follow-button')
  follow_button.replaceWith(follow_button.cloneNode(true))
  follow_button = document.querySelector('#follow-button')
  csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value

  follow_button.addEventListener('click', () => {
    fetch("/follow", {
      method: "POST",
      body: JSON.stringify({
        username: document.querySelector('#username').innerHTML
      }),
      headers: { "X-CSRFToken": csrftoken },
      mode: "same-origin",
    })
  })
}

function display_avatar(user) {
  avatar_wrapper = document.querySelector('#avatar-wrapper')
  avatar = document.createElement('img')
  avatar.classList.add('avatar')
  try {
    new URL(user['avatar'])
    url = true
  }
  catch(e) {
    url = false
  }
  if(url === true) {
    avatar.src = user['avatar']
  }
  else {
    avatar.src = "https://cdn3.vectorstock.com/i/thumb-large/11/72/outline-profil-user-or-avatar-icon-isolated-vector-35681172.jpg"
  }
  avatar_wrapper.appendChild(avatar)
}

function make_page_bar(posts) {
  preexisting_buttons = document.querySelectorAll('.page-item')
  preexisting_buttons.forEach((button) => button.remove())
  page_navbar = document.querySelector(".pagination")
  number_of_pages = posts['pages']
  for (var i = 0; i > number_of_pages; i++) {
    var li = document.createElement("li")
    var a = document.createElement("a")
    li.classList.add("page-item")
    a.classList.add("page-link")
    page_number = i + 1
    a.innerHTML = page_number
    li.appendChild(a)
    if (posts['source'] === "homepage"){
      li.addEventListener('click', () => homepage(page_number))
    }
    else if (posts['source'] === "profile_page") {
      li.addEventListener('click', () => make_post_section(posts['user'], page_number))
    }
    li.addEventListener('click', () => display_posts(posts['posts']))
    page_navbar.insertBefore(li, page_navbar.children[i + 1])
  }
}

function display_posts(posts) {
  post_wrappers = document.querySelectorAll('.post-wrapper')
  post_wrappers.forEach((post_wrapper) => post_wrapper.remove())
  posts.forEach((post) => {
    console.log(post)
    wrapper = document.createElement("div")
    wrapper.classList.add("post-wrapper")

    header_div = document.createElement("div")
    header_div.classList.add("post-header")

    username = document.createElement("p")
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
    if (post['image_url' != null]){
 
      image = document.createElement('img')
      image.classList.add('post-image')
      image.src = post['image_url']

      image_div.appendChild(image)
    }


    header_div.appendChild(username)
    header_div.appendChild(post_time)

    content_div.appendChild(content)


    wrapper.appendChild(header_div)
    wrapper.appendChild(content_div)
    wrapper.appendChild(image_div)

    document.querySelector("#posts").appendChild(wrapper)
  })
}

function log_post() {
  post_btn = document.querySelector("#post-btn")
  csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value
  content = document.querySelector("#post-input")
  image_url = document.querySelector("#image-input")
  image_btn = document.querySelector("#image-btn")
  display_url_input(image_btn)
  move_post_btn(image_btn, post_btn)

  post_btn.addEventListener("click", () => {
    if (
      (content.value != "" && content.value != null) ||
      (image_url.value != "" && image_url.value != null)
    ) {
      fetch("/logpost", {
        method: "POST",
        body: JSON.stringify({
          content: content.value,
          image_url: image_url.value,
        }),
        headers: { "X-CSRFToken": csrftoken },
        mode: "same-origin",
      })
      content.value = ""
      image_url.value = ""
    }
  })
}

function display_url_input(image_btn) {
  image_url_div = document.querySelector("#image-input-div")
  image_btn.addEventListener("click", () => {
    if (image_url_div.classList.contains("hidden-image-input")) {
      image_url_div.style.animationPlayState = "running"
      image_url_div.addEventListener("animationend", () => {
        image_url_div.classList.remove("hidden-image-input")
        image_url_div.classList.add("unhidden-image-input")
        image_url_div.style.animationPlayState = "paused"
      })
    } else {
      image_url_div.style.animationPlayState = "running"
      image_url_div.addEventListener("animationend", () => {
        image_url_div.classList.add("hidden-image-input")
        image_url_div.classList.remove("unhidden-image-input")
        image_url_div.style.animationPlayState = "paused"
      })
    }
  })
}

function move_post_btn(image_btn, post_btn) {
  image_btn.addEventListener("click", () => {
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