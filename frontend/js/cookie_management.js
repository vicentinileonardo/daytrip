function checkIfLogged (div_name) {
    if(getCookie("token")){
      let login_div=document.getElementById(div_name);
  
      let login_div_content=`
        <h1 class="h3">Logout</h1>
        <p>You are already authenticated</p>
        <button class="btn btn-lg btn-danger btn-block" onclick="logout()">Logout</button>
        `;
      
        login_div.innerHTML=login_div_content;
    }
  }
  
  function checkIfLoggedHomepage(){
    if(getCookie("token")){
        let nav_right_div=document.getElementById("nav_right_div");
    
        let nav_right_div_content=`<a href="/login"><button type="button" class="btn btn-danger btn-small btn-nav" onclick="logout()">Logout</button></a>`;
        nav_right_div.innerHTML=nav_right_div_content;

        document.getElementById("address-input").value=getCookie("origin_name")

      }
  }

  function logout(){
    eraseCookie("token");
    location.reload();
  }
  
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=0'
  }