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
        window.location.replace("/");
    }
  }