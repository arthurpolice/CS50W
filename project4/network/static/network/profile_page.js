function makeFollowButton(username, followStatus) {
  let followButton = document.querySelector('#follow-button')
  let newFollowButton = followButton.cloneNode(true)
  newFollowButton.classList.remove('hidden')
  followButton.replaceWith(newFollowButton)
  changeFollowButton(newFollowButton, followStatus)

  csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  console.log(username === document.querySelector('#current-user').value)
  if (username === document.querySelector('#current-user').value) {
    newFollowButton.classList.add('hidden')
  } else if (followStatus === true) {
    newFollowButton.classList.add('already-followed')
    newFollowButton.innerHTML = 'Unfollow'
  }
  newFollowButton.addEventListener('click', () => {
    fetch(`/follow/${username}`, {
      method: 'POST',
      headers: { 'X-CSRFToken': csrftoken },
      mode: 'same-origin',
    })
  })
}

function changeFollowButton(followButton, followStatus) {
  if (followStatus === true) {
    followButton.classList.add('already-followed')
    followButton.innerHTML = 'Unfollow'
    followButton.addEventListener('click', () => unfollow(followButton))
  } else {
    followButton.classList.remove('already-followed')
    followButton.innerHTML = 'Follow'
    followStatus === true
    followButton.addEventListener('click', () => follow(followButton))
  }
}

function unfollow(followButton) {
  followStatus = false
  followButton.removeEventListener('click', () =>
    unfollow(followButton, followStatus)
  )
  changeFollowButton(followButton, followStatus)
}

function follow(followButton) {
  followStatus = true
  followButton.removeEventListener('click', () =>
    follow(followButton, followStatus)
  )
  changeFollowButton(followButton, followStatus)
}

function displayAvatar(user) {
  avatarWrapper = document.querySelector('#avatar-wrapper')
  if (avatarWrapper.querySelector('.avatar') != null) {
    avatarWrapper.removeChild(document.querySelector('.avatar'))
    avatarWrapper = document.querySelector('#avatar-wrapper')
  }
  avatar = document.createElement('img')
  avatar.classList.add('avatar')
  checkAvatar(avatar, user['avatar'])
  avatarWrapper.appendChild(avatar)
}