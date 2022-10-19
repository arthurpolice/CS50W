// Take the number of pages given by the backend and set up navigation through them.
function makePageBar(posts) {
  // Remove old buttons from other pages in the app.
  let preexistingButtons = document.querySelectorAll('.page-number')
  preexistingButtons.forEach((button) => button.remove())
  // Remove the hidden class from the arrow buttons (this is added when loading comments on single post pages)
  let pageNavbar = document.querySelector('.pagination')
  pageNavbar.classList.remove('hidden')
  // The backend gives the amount of pages and this function makes a button for each of those.
  let numberOfPages = posts['pages']
  for (var i = 0; i < numberOfPages; i++) {
    let li = document.createElement('li')
    let a = document.createElement('a')
    li.classList.add('page-item', 'page-number')
    a.classList.add('page-link')
    let pageNumber = i + 1
    a.innerHTML = pageNumber
    // This determines what clicking on this list item will do.
    navItemListenerHandler(li, posts)
    li.appendChild(a)
    // Insert this newest list item before the i + 1 position, which is always the "next" arrow.
    pageNavbar.insertBefore(li, pageNavbar.children[i + 1])
  }
}

function navItemListenerHandler(li, posts) {
  // The backend gives information about what part of the app these posts relate to.
  // This function simply takes that information and sets up the correct function in the event listener to call the same part of the app.
  if (posts['source'] === 'homepage' || posts['source'] === 'all_posts') {
    li.addEventListener('click', (ev) => {
      page = ev.target.innerHTML
      getFeed(posts['source'], page)
      document.querySelector('#current-page').innerHTML = page
      // Notice that this push state uses the event target to save which page the user was visiting, and the source to know in which part of the app
      history.pushState(
        {
          feed: posts['source'],
          page,
        },
        '',
        `/${posts['source']}/${page}`
      )
    })
  } else if (posts['source'] === 'profile_page') {
    li.addEventListener('click', (ev) => {
      username = posts['user']
      page = ev.target.innerHTML
      getPosts(posts['user'], page)
      document.querySelector('#current-page').innerHTML = page
      // Same deal as the previous push state.
      history.pushState(
        {
          feed: 'profile',
          page,
          username,
        },
        '',
        `/profile/${username}/${page}`
      )
    })
  }
}
