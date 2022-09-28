// When back arrow is clicked, show previous section
window.onpopstate = function(event) {
  console.log(event.state.mailbox);
  if (event.state.mailbox !== "compose") {
    load_mailbox(event.state.mailbox);
  }
  else {
    compose_email()
  }
}

document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#display-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Submit information as json when the user clicks the button
  document.querySelector('#compose-form').onsubmit = (event) => {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result)
    })
    setTimeout(load_mailbox, 2000, 'sent')
    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
    event.preventDefault();
  }
  history.pushState({mailbox: "compose"}, "", 'compose');
}

function render_emails(mailbox) {
    // Get the objects from the API
    fetch(`emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
        console.log(emails);
        // For each object, make a div with the relevant information, then append them to inbox
        emails.forEach((email) => {
  
          mail_div = document.createElement('div');
          mail_div.classList.add('mail-wrapper');
  
          mail_sender = document.createElement('h5');
          mail_sender.classList.add('mail-sender');
          mail_sender.innerHTML = email['sender'];
  
          mail_subject = document.createElement('p');
          mail_subject.classList.add('mail-subject');
          mail_subject.innerHTML = email['subject'];

          mail_time = document.createElement('p');
          mail_time.classList.add('mail-time');
          mail_time.innerHTML = email['timestamp'];

          mail_id = document.createElement('input');
          mail_id.setAttribute('name', 'mail-id');
          mail_id.classList.add('hidden');
          mail_id.value = email['id'];

          if (email['read'] === true) {
            mail_div.classList.add('read');
          }
          mail_div.addEventListener('click', event => display_content(event))
          mail_div.appendChild(mail_sender);
          mail_div.appendChild(mail_subject);
          mail_div.appendChild(mail_time);
          mail_div.appendChild(mail_id);
          inbox.appendChild(mail_div);
      })
    })
    // Finally, append inbox to emails-view
    document.querySelector('#emails-view').appendChild(inbox);
}

// This is a function to attach the event listener to change the archived status in the database.
// The parameters are passed in to determine if it's a case of archiving or unarchiving the email.
// This is used by the display_content function.
function archive_handler(id, string, boolean) {
  archive_button = document.querySelector('#archive-btn');
  archive_button.replaceWith(archive_button.cloneNode(true));
  archive_button = document.querySelector('#archive-btn');
  archive_button.innerHTML = string;
  archive_button.addEventListener('click', () => {
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
          archived: boolean
      })
    })
    // Timeout to give the server enough time to update before displaying the inbox again.
    return setTimeout(load_mailbox, 2000, 'inbox') 
  })
}

function display_content(event) {

  var element = event.currentTarget; 
  mail_id = element.querySelector('[name="mail-id"]').value;
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#display-view').style.display = 'block';
  fetch(`emails/${mail_id}`)
  .then(response => response.json())
  .then(email => {
    document.querySelector('[name="display-id"]').value = email['id'];
    document.querySelector('#sender').value = email['sender'];
    document.querySelector('#display-subject').value = email['subject'];
    document.querySelector('#display-body').value = email['body'];
    document.querySelector('#display-recipients').value = email['recipients'].join(', ');
    if (email['archived'] === false){
      archive_handler(mail_id, "Archive", true)
    }
    else {
      archive_handler(mail_id, "Unarchive", false)
    }
  })
  fetch(`emails/${mail_id}`, {
    method: 'PUT',
    body: JSON.stringify({
    read: true
    })
  })
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#display-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Set the div to display the emails
  inbox = document.createElement('div');
  inbox.setAttribute('id', 'mailbox');

  // Add the current state to the history
  history.pushState({mailbox: mailbox}, "", `${mailbox}`);
  render_emails(mailbox);
}