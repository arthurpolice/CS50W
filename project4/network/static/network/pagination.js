function makePageBar(posts) {
  preexistingButtons = document.querySelectorAll('.page-number')
  preexistingButtons.forEach((button) => button.remove())
  pageNavbar = document.querySelector('.pagination')
  numberOfPages = posts['pages']
  for (var i = 0; i < numberOfPages; i++) {
    var li = document.createElement('li')
    var a = document.createElement('a')
    li.classList.add('page-item', 'page-number')
    a.classList.add('page-link')
    pageNumber = i + 1
    a.innerHTML = pageNumber
    li.appendChild(a)
    if (posts['source'] === 'homepage' || posts['source'] === 'all_posts') {
      li.addEventListener('click', (ev) => {
        getFeed(posts['source'], ev.target.innerHTML)
        document.querySelector('#current-page').innerHTML = ev.target.innerHTML
      })
    } else if (posts['source'] === 'profile_page') {
      li.addEventListener('click', (ev) => {
        getPosts(posts['user'], ev.target.innerHTML)
        document.querySelector('#current-page').innerHTML = ev.target.innerHTML
      })
    }
    pageNavbar.insertBefore(li, pageNavbar.children[i + 1])
  }
}