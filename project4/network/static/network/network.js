// Set up the default view
document.addEventListener("DOMContentLoaded", () => {
  log_post()
})

function log_post() {
  let post_btn = document.querySelector('#post-btn');
  let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
  let content = document.querySelector('#post-input');
  let image_url = document.querySelector('#image-input');
  post_btn.addEventListener('click', () => {
    fetch("/logpost", {
      method: "POST",
      body: JSON.stringify({
        content: content.value,
        image_url: image_url.value
      }),
      headers: {'X-CSRFToken': csrftoken},
      mode: 'same-origin' 
    })
    content.value = "";
    image_url.value = "";
    console.log("meep")
  })
}