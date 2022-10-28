// This file contains functions that set up the layout or enable basic functions of the page that are reused often.

// Set up navbar and post input UI.
document.addEventListener('DOMContentLoaded', () => {
  navAvatar()
  search()
  // This is a hacky way to check whether the user is logged in or not without calling the backend.
  if (document.querySelector('#log').innerHTML === 'Log Out') {
    // If the user is indeed logged in, go ahead and load the post interface (this is only loaded once throughout the whole time the user is on the page)
    // Furthermore just set up the click event listeners for each of the navigation buttons and give them their respective push states.
    postInputInterface()
    document
      .querySelector('#current-user-profile')
      .addEventListener('click', () => {
        username = document.querySelector('#current-user').value
        page = 1
        profilePage(username)
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
    document.querySelector('#homepage').addEventListener('click', () => {
      getFeed('homepage')
      history.pushState(
        {
          feed: 'homepage',
          page: 1,
        },
        '',
        '/homepage/1'
      )
    })
    document.querySelector('#network-button').addEventListener('click', () => {
      getFeed('homepage')
      history.pushState(
        {
          feed: 'homepage',
          page: 1,
        },
        '',
        '/homepage/1'
      )
    })
  } else {
    document.querySelector('#network-button').addEventListener('click', () => {
      getFeed('all_posts')
      history.pushState(
        {
          feed: 'all_posts',
          page: 1,
        },
        '',
        '/all_posts/1'
      )
    })
  }
  document.querySelector('#all-posts').addEventListener('click', () => {
    getFeed('all_posts')
    history.pushState(
      {
        feed: 'all_posts',
        page: 1,
      },
      '',
      '/all_posts/1'
    )
  })
  document
    .querySelector('#settings-btn-img')
    .addEventListener('click', (ev) => {
      settingsPage(ev)
      history.pushState(
        {
          feed: 'settings',
        },
        '',
        '/settings'
      )
    })
})

// When the user goes backwards/forwards on navigation, we analyze the information in the state to decide where to send them.
// The state is comprised of feed, page and/or id. This is manually determined at the moment of the push state. More information later.
window.onpopstate = function (ev) {
  switch(ev.state.feed) {
    case 'homepage':
      getFeed(ev.state.feed, ev.state.page)
      break
    case 'all_posts':
      getFeed(ev.state.feed, ev.state.page)
      break
    case 'profile':
      profilePage(ev.state.username, ev.state.page)
      break
    case 'single_post':
      getSinglePost(ev.state.id)
      break
    case 'settings':
      settingsPage()
      break
    default:
      getFeed('homepage', 1)
      break
  }
}


// This function checks whether an avatar has a valid URL and replaces it with a default icon otherwise.
function checkAvatar(avatarElement, avatarUrl) {
  avatarUrl !== null ? (avatarElement.src = avatarUrl) : (avatarElement.src = '/static/network/default_avatar.png')
}


function navAvatar() {
  try {
    const avatarElement = document.querySelector('#nav-avatar')
    const username = document.querySelector('#current-user').value
    fetch(`/user/${username}`)
    .then((response) => response.json())
    .then((response) => {
      checkAvatar(avatarElement, response['avatar'])
    })
  }
  catch {}
}