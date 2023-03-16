async function login(){

    const loginMail = document.getElementById('loginMail');
    const loginPassword = document.getElementById('loginPassword');
  
    if(loginMail.value==""){
      alert("Digit a non-empty email")
      loginMail.classList.add("bad-field");
      loginMail.style.zIndex = 1;
      return;
    }
    if(loginPassword.value==""){
      alert("Digit a non-empty password")
      loginPassword.classList.add("bad-field");
      loginMail.style.zIndex = 0;
      return;
    }
  
    const url = `http://localhost/user_login_service/api/sessions`;
  
    //fetch post request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: loginMail.value,
        password: loginPassword.value
      })
    });
  
    const data = await response.json()
  
    if (data["status"]=="error") {
      alert("Authentication failed! "+data["message"])
      loginMail.classList.add("bad-field");
      loginMail.style.zIndex = 1;
    }
    if (data["status"]=="fail") {
      alert("Authentication failed! "+data["data"]["password"])
      loginPassword.classList.add("bad-field");
      loginMail.style.zIndex = 0;
    }
    if (data["status"]=="success") {
        token=data["data"]["token"]
        decoded_token=parseJwt(token)["user"]

        document.cookie="token="+token;
        document.cookie="email="+decoded_token["email"];
        document.cookie="origin_name="+decoded_token["origin_name"];

        window.location.href = "/";
    }
  }

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

