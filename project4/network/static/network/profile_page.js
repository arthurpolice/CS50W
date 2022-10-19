// This file sets up elements unique to the profile page part of the app.

function makeFollowButton(username, followStatus) {
  // Clone the follow button to remove old listeners.
  let followButton = document.querySelector('#follow-button')
  let newFollowButton = followButton.cloneNode(true)
  // Remove hidden class (which is added when the user visits their own profile page)
  newFollowButton.classList.remove('hidden')
  followButton.replaceWith(newFollowButton)
  // This sets up the visual behavior when the button is clicked
  changeFollowButton(newFollowButton, followStatus)

  let csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  // Here we hide the button when the user is visiting their own profile page
  if (username === document.querySelector('#current-user').value) {
    newFollowButton.classList.add('hidden')
  }
  // If the user is not visiting their own page, we check if the backend has said that this profile is already followed by the user or not.
  else if (followStatus === true) {
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

// Changes color and inner HTML of the button.
// It's a facade to make the website seem snappier than it is by excluding the need to fetch.
function changeFollowButton(followButton, followStatus) {
  if (followStatus === true) {
    followButton.classList.add('already-followed')
    followButton.innerHTML = 'Unfollow'
    followButton.addEventListener('click', unfollow)
  } else {
    followButton.classList.remove('already-followed')
    followButton.innerHTML = 'Follow'
    followButton.addEventListener('click', follow)
  }
}

// Changes the number of followers without having to fetch.
// Notice the recursion with the changeFollowButton function.
function unfollow(ev) {
  let followStatus = false
  let followerAmount = document.querySelector('#followers')
  followerAmount.innerHTML = `${parseInt(followerAmount.innerHTML) - 1} `
  ev.currentTarget.removeEventListener('click', unfollow)
  changeFollowButton(ev.currentTarget, followStatus)
}

// Changes the number of followers without having to fetch.
function follow(ev) {
  let followStatus = true
  let followerAmount = document.querySelector('#followers')
  followerAmount.innerHTML = `${parseInt(followerAmount.innerHTML) + 1} `
  ev.currentTarget.removeEventListener('click', follow)
  changeFollowButton(ev.currentTarget, followStatus)
}

// This is a bigger avatar that is attached to the profile page.
function displayAvatar(user) {
  let avatarWrapper = document.querySelector('#avatar-wrapper')
  if (avatarWrapper.querySelector('.avatar') != null) {
    avatarWrapper.removeChild(document.querySelector('.avatar'))
    avatarWrapper = document.querySelector('#avatar-wrapper')
  }
  let avatar = document.createElement('img')
  avatar.classList.add('avatar')
  checkAvatar(avatar, user['avatar'])
  avatarWrapper.appendChild(avatar)
}
