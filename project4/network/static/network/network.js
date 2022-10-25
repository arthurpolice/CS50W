// This file contains functions that set up the layout or enable basic functions of the page that are reused often.

// Set up navbar and post input UI.
document.addEventListener('DOMContentLoaded', () => {
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
  if (ev.state.feed === 'homepage' || ev.state.feed === 'all_posts') {
    getFeed(ev.state.feed, ev.state.page)
  } else if (ev.state.feed === 'profile') {
    profilePage(ev.state.username, ev.state.page)
  } else if (ev.state.feed === 'single_post') {
    getSinglePost(ev.state.id)
  } else if (ev.state.feed === 'settings') {
    settingsPage()
  }
}

// TODO
function searchUser() {
  document.querySelector('#profile-view').style.display = 'none'
  document.querySelector('#post-view').style.display = 'none'
  document.querySelector('#settings-view').style.display = 'none'
  document.querySelector('#user-list-view').style.display = 'block'
  document.querySelector('#post-input-view').style.display = 'none'
  document.querySelector('#post-list-view').style.display = 'none'
}

// This function checks whether an avatar has a valid URL and replaces it with a default icon otherwise.
function checkAvatar(avatarElement, avatarUrl) {
  try {
    new URL(avatarUrl)
    url = true
  } catch (e) {
    url = false
  }
  if (url === true) {
    avatarElement.src = avatarUrl
  } else {
    avatarElement.src = '/static/network/default_avatar.png'
  }
}
