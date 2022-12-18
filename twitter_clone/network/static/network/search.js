function search() {
  const searchBar = document.querySelector('#search-bar')
  searchBar.addEventListener('input', () => {
    // Try/catch needed because sometimes the elements being selected don't exist yet.
    try {
      document.querySelector('.suggestion-dropdown-div').remove()
      document
        .querySelectorAll('.suggestion-wrapper')
        .forEach((wrapper) => wrapper.remove())
    } catch {}
    const username = searchBar.value
    // Prevent the fetch from happening with an empty string, because it breaks the backend.
    if (username === '' || username === null) {
      document.querySelector('.suggestion-dropdown-div').remove()
    }
    else {
      fetch(`/search/${username}`)
      .then((response) => response.json())
      .then((response) => {
        makeProfileSuggestions(response['matches'])
      })
    }
  })
}

// This function kickstarts the frontend generation for the search suggestions.
function makeProfileSuggestions(profiles) {
  const suggestions = document.createElement('div')
  // Try/catch in case there is a single profile only and forEach gives an error.
  try {
    profiles.forEach((profile) => {
      const suggestionDiv = makeSuggestion(profile)
      suggestionDiv.addEventListener('click', suggestionRedirection)
      suggestions.appendChild(suggestionDiv)
    })
  } catch {
    const suggestionDiv = makeSuggestion(profiles)
    suggestions.appendChild(suggestionDiv)
  }
  suggestions.classList.add('dropdown-menu', 'show', 'suggestion-dropdown-div')
  const dropdown = document.querySelector('#suggestion-dropdown')
  dropdown.appendChild(suggestions)
}

function suggestionRedirection(ev) {
  const username = ev.currentTarget.querySelector(
    '.suggestion-username'
  ).innerHTML
  profilePage(username)
  document.querySelector('#search-bar').value = ''
  document.querySelector('.suggestion-dropdown-div').remove()
  history.pushState(
    {
      feed: 'profile',
      page: 1,
      username,
    },
    '',
    `/profile/${username}/1`
  )
}

function makeSuggestion(profile) {
  const wrapper = document.createElement('div')
  wrapper.classList.add('suggestion-wrapper')

  const avatarDiv = makeSuggestionAvatar(profile)

  const profileInfo = makeSuggestionInfo(profile)

  wrapper.appendChild(avatarDiv)
  wrapper.appendChild(profileInfo)

  return wrapper
}

function makeSuggestionAvatar(profile) {
  const avatarDiv = document.createElement('div')
  avatarDiv.classList.add('suggestion-avatar-div')
  const avatar = document.createElement('img')
  avatar.classList.add('suggestion-avatar', 'avatar-small')
  // This checks if the avatar url is valid and returns a default icon otherwise.
  checkAvatar(avatar, profile['avatar'])
  avatarDiv.appendChild(avatar)

  return avatarDiv
}

function makeSuggestionInfo(profile) {
  const profileInfo = document.createElement('div')
  profileInfo.classList.add('suggestion-profile-info')

  const username = document.createElement('span')
  username.classList.add('suggestion-username')
  username.innerHTML = profile['username']

  const followStatus = document.createElement('span')
  followStatus.classList.add('suggestion-follow-status')
  if (profile['follow_status'] === true) {
    followStatus.innerHTML = 'Followed'
  } else if (profile['follow_status'] === false) {
    followStatus.innerHTML = 'Not Followed'
  } else {
    followStatus.innerHTML = ''
  }

  profileInfo.appendChild(username)
  profileInfo.appendChild(followStatus)

  return profileInfo
}
