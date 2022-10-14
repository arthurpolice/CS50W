function makePageBar(posts) {
  console.log('call')
  preexistingButtons = document.querySelectorAll('.page-number')
  preexistingButtons.forEach((button) => button.remove())
  pageNavbar = document.querySelector('.pagination')
  pageNavbar.classList.remove('hidden')
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
        page = ev.target.innerHTML
        getFeed(posts['source'], page)
        document.querySelector('#current-page').innerHTML = page
        history.pushState({
          feed: posts['source'],
          page,
        },
        '', `${posts['source']}/${page}`)
      })
    } else if (posts['source'] === 'profile_page') {
      li.addEventListener('click', (ev) => {
        username = posts['user']
        page = ev.target.innerHTML
        getPosts(posts['user'], page)
        document.querySelector('#current-page').innerHTML = page
        history.pushState({
          feed: 'profile',
          page,
          username
        },
        '', `/profile/${username}/${page}`)
      })
    }
    pageNavbar.insertBefore(li, pageNavbar.children[i + 1])
  }
}