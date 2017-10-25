// Client ID and API key from the Developer Console
// var CLIENT_ID = '961066658125-oe4sj3rtmfrabeg6faq50tnir49pd8cg.apps.googleusercontent.com';
var CLIENT_ID = '961066658125-0iul8mdvbdmod26k5v76b1rniv4t5s72.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/gmail.settings.basic';

var loading = document.getElementById('loading');
var formContent = document.getElementById('form-content')
var setFilter = document.getElementById('set-filter-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        setFilter.onclick = handleFilterClick;
        
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        console.log('Signed in.');
        loading.style.display = 'none';
        formContent.style.display = 'block';
    } else {
        loading.style.display = 'block';
        formContent.style.display = 'none';
        authorize()
    }
}

/**
 *  Sign in the user upon button click.
 */
function authorize(event) {
    console.log('Authorizing...');
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function handleFilterClick(event) {
    let email = document.getElementById('email-input').value
    console.log(email);
    let reg = /\w+@\w+\.\w+/g
    if (reg.test(email)) {
        let filter = {
            userId: 'me',
            criteria: {
                from: email
            },
            action: {
                addLabelIds: [
                    'CATEGORY_PERSONAL',
                    'IMPORTANT'
                ]
            }
        }
        gapi.client.gmail.users.settings.filters.create(filter).then(function (response) {
            console.log(response);
            alert(`The email address ${email} has been added to a filter on your account.\nRedirecting you to Gmail now.`)
            window.location.href = 'https://mail.google.com'
        }).catch(console.log)
    } else {
        alert("Either you entered a non valid email address, or I need to get better at programming.")
    }

}