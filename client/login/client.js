// handleLogin()
const handleLogin = (e) => {
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
const handleSignup = (e) => {
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
const LoginWindow = (props) => {
  return (
    <div className="text-center" id="bodyContainer">
        <form   className="form-signin mainForm"
                id='loginForm'
                name='loginForm'
                onSubmit={handleLogin}
                action='/login'
                method='POST'
         >

            <img className="mb-4" src="/assets/img/face.png" alt="" width="146" height="146"/>
      
            <br/>
      
            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
      
            <br/>

            <label for="inputEmail" className="sr-only">Email address</label>
            <input id="inputEmail" type="text" name='username' className="form-control" required autofocus placeholder="Username"/>
            <label for="inputPassword" className="sr-only">Password</label>
            <input type="password" name='pass' id="inputPassword" className="form-control" required placeholder="Password"/>

            <input type='hidden' name='_csrf' value={props.csrf} />
      
            <br/>

            <button className='formSubmit btn btn-lg btn-primary btn-block' type='submit' type="submit">Sign in</button>
      
            <br/>
      
            <p class="mt-5 mb-3 text-muted">&copy; 2017-2018</p>
        </form>
    </div>
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
      <input id='inputEmail' type='text' name='username' placeholder='username'/>
      <label htmlFor='pass'>Password: </label>
      <input id='inputPassword' type='password' name='pass' placeholder='password'/>
      <label htmlFor='pass2'>Password: </label>
      <input id='inputPassword2' type='password' name='pass2' placeholder='retype password'/>
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
