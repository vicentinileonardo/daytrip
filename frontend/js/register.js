async function register(){

    const registerName = document.getElementById('registerName');
    const registerSurname = document.getElementById('registerSurname');
    const registerCity = document.getElementById('registerCity');
    const registerCountry = document.getElementById('registerCountry');
    const registerEmail = document.getElementById('registerEmail');
    const registerPassword = document.getElementById('registerPassword');
    const registerPassword2 = document.getElementById('registerPassword2');
  
    if(registerName.value==""){
      alert("Digit a non-empty name")
      registerName.classList.add("bad-field");
      return;
    }

    if(registerSurname.value==""){
      alert("Digit a non-empty surname")
      registerSurname.classList.add("bad-field");
      return;
    }

    if(registerCity.value==""){
      alert("Digit a non-empty city")
      registerCity.classList.add("bad-field");
      return;
    }

    if(registerCountry.value==""){
      alert("Digit a non-empty country")
      registerCountry.classList.add("bad-field");
      return;
    }

    if(registerEmail.value==""){
      alert("Digit a non-empty email")
      registerEmail.classList.add("bad-field");
      return;
    }

    if(registerPassword.value==""){
      alert("Digit a non-empty password")
      registerPassword.classList.add("bad-field");
      return;
    }

    if(registerPassword.value != registerPassword2.value){
      alert("The two passwords doesn't match")
      registerPassword.classList.add("bad-field");
      registerPassword2.classList.add("bad-field");
      return;
    }

  
  }