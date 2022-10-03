// Set up the default view
document.addEventListener("DOMContentLoaded", () => {
  homepage()
  log_post()
})

function homepage() {
  document.querySelector("#profile-view").style.display = "none"
  document.querySelector("#post-view").style.display = "none"
  document.querySelector("#settings-view").style.display = "none"
  document.querySelector("#follower-list-view").style.display = "none"
  document.querySelector("#homepage-view").style.display = "block"
  document.querySelector("#post-list-view").style.display = "block"
  fetch("/homepage")
    .then((pages) => pages.json())
    .then((pages) => {
      display_posts(pages)
      make_page_bar(pages)
    })
}

function make_page_bar(pages) {
  document.querySelectorAll('.page-item').remove()
  page_navbar = document.querySelector(".pagination")
  number_of_pages = pages.length
  for (var i = 0; i > number_of_pages; i++) {
    var li = document.createElement("li")
    var a = document.createElement("a")
    li.classList.add("page-item")
    a.classList.add("page-link")
    page_number = i + 1
    a.innerHTML = page_number
    li.appendChild(a)
    li.addEventListener('click', display_posts(pages, i))
    page_navbar.insertBefore(li, page_navbar.children[i + 1])
  }
}

function display_posts(pages, i = 0) {
  document.querySelectorAll('.post-wrapper').remove()
  pages[i].forEach((post) => {
    wrapper = document.createElement("div")
    wrapper.classList.add("post-wrapper")

    header_div = document.createElement("div")
    div.classList.add("post-header")

    username = document.createElement("p")
    username.classList.add("username")
    username.innerHTML = post["user"]

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
  let post_btn = document.querySelector("#post-btn")
  let csrftoken = document.querySelector("[name=csrfmiddlewaretoken]").value
  let content = document.querySelector("#post-input")
  let image_url = document.querySelector("#image-input")
  let image_btn = document.querySelector("#image-btn")
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
  let image_url_div = document.querySelector("#image-input-div")
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
