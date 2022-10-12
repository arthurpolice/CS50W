// Set up navbar and post input UI.

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#log').innerHTML === 'Log Out') {
    postInputInterface()
    document
      .querySelector('#current-user-profile')
      .addEventListener('click', () =>
        profilePage(document.querySelector('#current-user').value)
      )
    document
      .querySelector('#homepage')
      .addEventListener('click', () => getFeed('homepage'))
  }
  document
    .querySelector('#network-button')
    .addEventListener('click', () => getFeed('homepage'))
  document
    .querySelector('#all-posts')
    .addEventListener('click', () => getFeed('all_posts'))
})

// Backend Communication Section


function searchUser() {
  document.querySelector('#profile-view').style.display = 'none'
  document.querySelector('#post-view').style.display = 'none'
  document.querySelector('#settings-view').style.display = 'none'
  document.querySelector('#user-list-view').style.display = 'block'
  document.querySelector('#post-input-view').style.display = 'none'
  document.querySelector('#post-list-view').style.display = 'none'
}

// Frontend Creation


// Embelishments Section

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
    avatarElement.src =
      '../static/network/default_avatar.png'
  }
}