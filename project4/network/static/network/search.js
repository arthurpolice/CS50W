function search() {
  let searchBar = document.querySelector('#search-bar')
  searchBar.addEventListener('input', () => {
    // Try/catch needed because sometimes the elements being selected don't exist yet.
    try {
      document.querySelector('.suggestion-dropdown-div').remove()
      document
        .querySelectorAll('.suggestion-wrapper')
        .forEach((wrapper) => wrapper.remove())
    } catch {}
    username = searchBar.value
    // Prevent the fetch from happening with an empty string, because it breaks the backend.
    if (username === '') {
      return
    }
    fetch(`/search/${username}`)
      .then((response) => response.json())
      .then((response) => {
        makeProfileSuggestions(response['matches'])
      })
  })
}

// This function kickstarts the frontend generation for the search suggestions.
function makeProfileSuggestions(profiles) {
  let suggestions = document.createElement('div')
  // Try/catch in case there is a single profile only and forEach gives an error.
  try {
    profiles.forEach((profile) => {
      let suggestionDiv = makeSuggestion(profile)
      suggestionDiv.addEventListener('click', suggestionRedirection)
      suggestions.appendChild(suggestionDiv)
    })
  } catch {
    let suggestionDiv = makeSuggestion(profiles)
    suggestions.appendChild(suggestionDiv)
  }
  suggestions.classList.add('dropdown-menu', 'show', 'suggestion-dropdown-div')
  let dropdown = document.querySelector('#suggestion-dropdown')
  dropdown.appendChild(suggestions)
}

function suggestionRedirection(ev) {
  let username = ev.currentTarget.querySelector(
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
  let wrapper = document.createElement('div')
  wrapper.classList.add('suggestion-wrapper')

  let avatarDiv = makeSuggestionAvatar(profile)

  let profileInfo = makeSuggestionInfo(profile)

  wrapper.appendChild(avatarDiv)
  wrapper.appendChild(profileInfo)

  return wrapper
}

function makeSuggestionAvatar(profile) {
  let avatarDiv = document.createElement('div')
  avatarDiv.classList.add('suggestion-avatar-div')
  let avatar = document.createElement('img')
  avatar.classList.add('suggestion-avatar', 'avatar-small')
  // This checks if the avatar url is valid and returns a default icon otherwise.
  checkAvatar(avatar, profile['avatar'])
  avatarDiv.appendChild(avatar)

  return avatarDiv
}

function makeSuggestionInfo(profile) {
  let profileInfo = document.createElement('div')
  profileInfo.classList.add('suggestion-profile-info')

  let username = document.createElement('span')
  username.classList.add('suggestion-username')
  username.innerHTML = profile['username']

  let followStatus = document.createElement('span')
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
