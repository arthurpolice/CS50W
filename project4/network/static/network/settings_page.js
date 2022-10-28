// Set up the correct views, automatically fill the profile info fields, set up the listeners to send information to the backend.
function settingsPage() {
  document.querySelector('#profile-view').style.display = 'none'
  document.querySelector('#post-view').style.display = 'none'
  document.querySelector('#settings-view').style.display = 'block'
  document.querySelector('#user-list-view').style.display = 'none'
  document.querySelector('#post-list-view').style.display = 'none'
  document.querySelector('#comments-view').style.display = 'none'
  document.querySelector('#post-input-view').style.display = 'none'

  autoFill()

  document
    .querySelector('#submit-profile-info')
    .addEventListener('click', submitProfileInfo)
  document
    .querySelector('#submit-password')
    .addEventListener('click', submitPassword)
}

// This function retrieves the user information from the backend and displays it in the settings page fields for easy editing.
function autoFill() {
  const usernameField = document.querySelector('#username-edit')
  const avatarField = document.querySelector('#avatar-edit')
  const emailField = document.querySelector('#email-edit')

  fetch('/settings')
    .then((response) => response.json())
    .then((response) => {
      usernameField.value = response['username']
      avatarField.value = response['avatar']
      emailField.value = response['email']
    })
}

function submitProfileInfo() {
  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  const username = document.querySelector('#username-edit').value
  const avatar = document.querySelector('#avatar-edit').value
  const email = document.querySelector('#email-edit').value

  fetch('/edit_profile', {
    method: 'PUT',
    body: JSON.stringify({
      username,
      avatar,
      email,
    }),
    headers: { 'X-CSRFToken': csrftoken },
    mode: 'same-origin',
  })
    .then((response) => response.json())
    .then((response) => {
      document.querySelector('#settings-message').innerHTML =
        response['message']
    })
}

function submitPassword() {
  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value
  const oldPassword = document.querySelector('#old-password-edit').value
  const newPassword = document.querySelector('#password-edit').value
  const confirmation = document.querySelector('#password-edit-confirm').value

  fetch('/edit_password', {
    method: 'PUT',
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
      confirmation,
    }),
    headers: { 'X-CSRFToken': csrftoken },
    mode: 'same-origin',
  })
    .then((response) => response.json())
    .then((response) => {
      document.querySelector('#settings-message').innerHTML =
        response['message']
    })
}
