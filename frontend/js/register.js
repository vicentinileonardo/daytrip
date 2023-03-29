async function register(){
    
    const registerName = document.getElementById('registerName');
    const registerSurname = document.getElementById('registerSurname');
    const registerAddress = document.getElementById('registerAddress');
    const registerCity = document.getElementById('registerCity');
    const registerCountry = document.getElementById('registerCountry');
    const registerEmail = document.getElementById('registerEmail');
    const registerPassword = document.getElementById('registerPassword');
    const registerPassword2 = document.getElementById('registerPassword2');
  
    if(registerName.value==""){
      alert("Non-empty name is required")
      registerName.classList.add("bad-field");
      return;
    }

    if(registerSurname.value==""){
      alert("Non-empty surname is required")
      registerSurname.classList.add("bad-field");
      return;
    }

    if(registerAddress.value==""){
      alert("Non-empty address is required")
      registerCity.classList.add("bad-field");
      return;
    }

    if(registerCity.value==""){
      alert("Non-empty city is required")
      registerCity.classList.add("bad-field");
      return;
    }

    if(registerCountry.value==""){
      alert("Non-empty country is required")
      registerCountry.classList.add("bad-field");
      return;
    }

    if(registerEmail.value==""){
      alert("Non-empty email is required")
      registerEmail.classList.add("bad-field");
      return;
    }

    if(registerPassword.value==""){
      alert("Non-empty password is required")
      registerPassword.classList.add("bad-field");
      return;
    }

    if(registerPassword.value != registerPassword2.value){
      alert("The two passwords do not match")
      registerPassword.classList.add("bad-field");
      registerPassword2.classList.add("bad-field");
      return;
    }

    const url = `http://localhost/user_registration_service/api/v1/users/signup`; 

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: registerName.value,
        surname: registerSurname.value,
        address: registerAddress.value,
        city: registerCity.value,
        country: registerCountry.value,
        email: registerEmail.value,
        password: registerPassword.value,
        password_confirmation: registerPassword2.value
      })
    });

    const data = await response.json();

    if (data.status == "error") {
      // create a new div element for the error message
      const errorDiv = document.createElement('div');
      // add a class to the div
      errorDiv.className = 'alert alert-danger';
      errorDiv.style.width = "50%";
      errorDiv.style.margin = "auto";
      // create a text node and append it to the div
      errorDiv.appendChild(document.createTextNode(data.message));
      // get elements
      
      const formDiv = document.getElementById('form-div');
      formDiv.remove();

      const responseDiv = document.getElementById('response-div');
      responseDiv.appendChild(errorDiv);
      
      // clear error after 3 seconds
      //setTimeout(clearError, 5000);
      return;
    }

    if (data.status == "fail") {
      // create a new div element for the error message
      const errorDiv = document.createElement('div');
      // add a class to the div
      errorDiv.className = 'alert alert-danger';
      errorDiv.style.width = "50%";
      errorDiv.style.margin = "auto";
      // create a text node and append it to the div
      console.log("data")
      console.log(data);
      
      //get value of the first element of the object data.data
      

      errorDiv.appendChild(document.createTextNode(data.data[0]));
      // get elements

      const formDiv = document.getElementById('form-div');
      formDiv.remove();

      const responseDiv = document.getElementById('response-div');
      responseDiv.appendChild(errorDiv);

      //TODO gestisce errori di validazione


      // clear error after 3 seconds
      //setTimeout(clearError, 5000);
      return;
    }

    if (data.status == "success") {
      // create a new div element for the message
      const successDiv = document.createElement('div');
      // add a class to the div
      successDiv.className = 'alert alert-success';
      // create a text node and append it to the div
      //set size of the success div
      successDiv.style.width = "50%";
      successDiv.style.margin = "auto";
      successDiv.appendChild(document.createTextNode(data.message));

      const formDiv = document.getElementById('form-div');
      formDiv.remove();

      const responseDiv = document.getElementById('response-div');
      responseDiv.appendChild(successDiv);

      // clear message after 3 seconds
      //setTimeout(clearMessage, 5000);

      return;
    }

  }

async function getLocationFromIP(){

  //get ip address and store it in a variable
  let ip_address = await fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => data.ip)
  .catch((error) => {
    console.error('Error:', error);
  });

  //get location from ip address
  let base_url = `http://localhost/ip_api_adapter/api/v1/ip_info`;
  let url = `${base_url}?ip_address=${ip_address}`;

  try {
    let response = await fetch(url);
    let data = await response.json();
    
    if (data.status == "error") {
      alert(data.message);
      return;
    }
    if (data.status == "fail") {
      alert(data.data);
      return;
    }
    if (data.status == "success") {
      let ip_info = data.data.ip_info;
      console.log(ip_info);
      console.log(ip_info.city);
      console.log(ip_info.country);
      document.getElementById("registerCity").value = ip_info.city;
      document.getElementById("registerCountry").value = ip_info.country;
      console.log("Location set");
    }

  } catch (error) {
    console.log(error);
  }

}
