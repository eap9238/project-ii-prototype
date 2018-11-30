'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// handleLogin()
var handleLogin = function handleLogin(e) {
  // Preventing default redirect behavior + hiding the Domo error
  e.preventDefault();
  $('#domoMessage').animate({ width: 'hide' }, 350);

  // IF not all the fields are filled in...
  if ($('#inputEmail').val() == '' || $('#inputPassword').val() == '') {
    handleError("Either Username or password fields are blank");
    return false;
  }

  console.log($('input[name=_csrf]').val());

  sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);

  return false;
};

// handleSignup()
var handleSignup = function handleSignup(e) {
  // Preventing default redirect behavior + hiding the Domo error
  e.preventDefault();
  $('#domoMessage').animate({ width: 'hide' }, 350);

  // IF not all of the fields are filled in...
  if ($('#inputEmail').val() == '' || $('#inputPassword').val() == '' || $('#inputPassword2').val() == '') {
    handleError("Please select options for all fields");
    return false;
  }

  // IF both password fields are not the same...
  if ($('#inputPassword').val() !== $('#inputPassword2').val()) {
    handleError("Passwords do not match");
    return false;
  }

  // 
  sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);

  return false;
};

// LoginWindow()
var LoginWindow = function LoginWindow(props) {
  return React.createElement(
    'div',
    { className: 'text-center', id: 'bodyContainer' },
    React.createElement(
      'form',
      { className: 'form-signin mainForm',
        id: 'loginForm',
        name: 'loginForm',
        onSubmit: handleLogin,
        action: '/login',
        method: 'POST'
      },
      React.createElement('img', { className: 'mb-4', src: '/assets/img/face.png', alt: '', width: '146', height: '146' }),
      React.createElement('br', null),
      React.createElement(
        'h1',
        { className: 'h3 mb-3 font-weight-normal' },
        'Please sign in'
      ),
      React.createElement('br', null),
      React.createElement(
        'label',
        { 'for': 'inputEmail', className: 'sr-only' },
        'Email address'
      ),
      React.createElement('input', { id: 'inputEmail', type: 'text', name: 'username', className: 'form-control', required: true, autofocus: true, placeholder: 'Username' }),
      React.createElement(
        'label',
        { 'for': 'inputPassword', className: 'sr-only' },
        'Password'
      ),
      React.createElement('input', { type: 'password', name: 'pass', id: 'inputPassword', className: 'form-control', required: true, placeholder: 'Password' }),
      React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
      React.createElement('br', null),
      React.createElement(
        'button',
        _defineProperty({ className: 'formSubmit btn btn-lg btn-primary btn-block', type: 'submit' }, 'type', 'submit'),
        'Sign in'
      ),
      React.createElement('br', null),
      React.createElement(
        'p',
        { 'class': 'mt-5 mb-3 text-muted' },
        '\xA9 2017-2018'
      )
    )
  );
};

// SignupWindow()
var SignupWindow = function SignupWindow(props) {
  return React.createElement(
    'form',
    { id: 'signupForm',
      name: 'signupForm',
      onSubmit: handleSignup,
      action: '/signup',
      method: 'POST',
      className: 'mainForm' },
    React.createElement(
      'label',
      { htmlFor: 'username' },
      'Username: '
    ),
    React.createElement('input', { id: 'inputEmail', type: 'text', name: 'username', placeholder: 'username' }),
    React.createElement(
      'label',
      { htmlFor: 'pass' },
      'Password: '
    ),
    React.createElement('input', { id: 'inputPassword', type: 'password', name: 'pass', placeholder: 'password' }),
    React.createElement(
      'label',
      { htmlFor: 'pass2' },
      'Password: '
    ),
    React.createElement('input', { id: 'inputPassword2', type: 'password', name: 'pass2', placeholder: 'retype password' }),
    React.createElement('input', { type: 'hidden', name: '_csrf', value: props.csrf }),
    React.createElement('input', { className: 'formSubmit', type: 'submit', value: 'Sign Up' })
  );
};

// createLoginWindow()
var createLoginWindow = function createLoginWindow(csrf) {
  console.log('Create Login Window');
  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector('#content'));
};

// createSignupWindow()
var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector('#content'));
};

// setup()
var setup = function setup(csrf) {
  var loginButton = document.querySelector('#loginButton');
  var signupButton = document.querySelector('#signupButton');

  signupButton.addEventListener('click', function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });

  loginButton.addEventListener('click', function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });

  // Setting up the default view
  createLoginWindow(csrf);
};

// getToken()
var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

// When the page has loaded...
$(document).ready(function () {
  getToken();
});
'use strict';

// handleError()
var handleError = function handleError(msg) {
  /*
  $('#errorMessage').text(msg);
  $('#domoMessage').animate({ width: 'toggle' }, 350);
  */

  window.alert(msg);
};

// redirect()
var redirect = function redirect(response) {
  $('#domoMessage').animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

// sendAjax()
var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      console.log(xhr.responseText);
      var msgObj = JSON.parse(xhr.responseText);
      handleError(msgObj.error);
    }
  });
};
