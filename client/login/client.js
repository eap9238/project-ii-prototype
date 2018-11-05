// handleLogin()
const handleLogin = (e) => {
  // Preventing default redirect behavior + hiding the Domo error
  e.preventDefault();
  $('#domoMessage').animate({ width: 'hide' }, 350);
  
  // IF not all the fields are filled in...
  if ($('#user').val() == '' || $('#pass').val() == '') {
    handleError("RAWR! Username or password is empty");
    return false;
  }
  
  console.log($('input[name=_csrf]').val());
  
  sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);
  
  return false;
};

// handleSignup()
const handleSignup = (e) => {
  // Preventing default redirect behavior + hiding the Domo error
  e.preventDefault();
  $('#domoMessage').animate({ width: 'hide' }, 350);
  
  // IF not all of the fields are filled in...
  if ($('#user').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }
  
  // IF both password fields are not the same...
  if ($('#pass').val() !== $('#pass2').val()) {
    handleError("RAWR! Passwords do not match");
    return false;
  }
  
  // 
  sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);
  
  return false;
};

// LoginWindow()
const LoginWindow = (props) => {
  return (
    <form id='loginForm'
          name='loginForm'
          onSubmit={handleLogin}
          action='/login'
          method='POST'
          className='mainForm'>
      <label htmlFor='username'>Username: </label>
      <input id='user' type='text' name='username' placeholder='username'/>
      <label htmlFor='pass'>Password: </label>
      <input id='pass' type='password' name='pass' placeholder='password'/>
      <input type='hidden' name='_csrf' value={props.csrf}/>
      <input className='formSubmit' type='submit' value='Sign In'/>
    </form>
  );
};

// SignupWindow()
const SignupWindow = (props) => {
  return (
    <form id='signupForm'
          name='signupForm'
          onSubmit={handleSignup}
          action='/signup'
          method='POST'
          className='mainForm'>
      <label htmlFor='username'>Username: </label>
      <input id='user' type='text' name='username' placeholder='username'/>
      <label htmlFor='pass'>Password: </label>
      <input id='pass' type='password' name='pass' placeholder='password'/>
      <label htmlFor='pass2'>Password: </label>
      <input id='pass2' type='password' name='pass2' placeholder='retype password'/>
      <input type='hidden' name='_csrf' value={props.csrf}/>
      <input className='formSubmit' type='submit' value='Sign Up'/>
    </form>
  );
};

// createLoginWindow()
const createLoginWindow = (csrf) => {
  console.log('Create Login Window');
  ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector('#content')
  );
};

// createSignupWindow()
const createSignupWindow = (csrf) => {
  ReactDOM.render(
    <SignupWindow csrf={csrf} />,
    document.querySelector('#content')
  );
};

// setup()
const setup = (csrf) => {
  const loginButton = document.querySelector('#loginButton');
  const signupButton = document.querySelector('#signupButton');
  
  signupButton.addEventListener('click', (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  
  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  
  // Setting up the default view
  createLoginWindow(csrf);
};

// getToken()
const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

// When the page has loaded...
$(document).ready(function() {
  getToken();
});
