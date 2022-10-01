// Set up the default view
document.addEventListener("DOMContentLoaded", () => {
  log_post()
})

function log_post() {
  let post_btn = document.querySelector('#post-btn');
  let image_btn = document.querySelector('#image-btn');
  let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
  let content = document.querySelector('#post-input');
  let image_url = document.querySelector('#image-input');
  let image_url_div = document.querySelector('#image-input-div');
  image_btn.addEventListener('click', () =>{
    if (image_url_div.classList.contains('hidden-image-input')){
      image_url_div.style.animationPlayState = 'running';
      post_btn.style.animationPlayState='running';
      image_url_div.addEventListener('animationend', () =>{
        image_url_div.classList.remove('hidden-image-input');
        image_url_div.classList.add('unhidden-image-input');
        post_btn.classList.remove('move-down');
        post_btn.classList.add('move-up');
        image_url_div.style.animationPlayState = 'paused';
        post_btn.style.animationPlayState='paused';
      })
    }
    else {
      image_url_div.style.animationPlayState = 'running';
      post_btn.style.animationPlayState='running';
      image_url_div.addEventListener('animationend', () =>{
        image_url_div.classList.add('hidden-image-input');
        image_url_div.classList.remove('unhidden-image-input');
        post_btn.classList.remove('move-up');
        post_btn.classList.add('move-down');
        image_url_div.style.animationPlayState = 'paused';
        post_btn.style.animationPlayState='paused';
      }
    )}
  })

  post_btn.addEventListener('click', () => {
    if ((content.value != "" &&  content.value != null) || (image_url.value != "" && image_url.value != null )){
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
    }
  })
}
