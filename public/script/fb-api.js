window.fbAsyncInit = function() {
  FB.init({
    appId      : '598835211473533',
    cookie     : true,
    xfbml      : true,
    version    : 'v12.0'
  });

  FB.AppEvents.logPageView();
  checkLoginState()
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

function statusChangeCallback(response){
  if(response.status === 'connected'){
    console.log("Is in");
    setElements(true);
    testAPI();
  } else {
    console.log("Not in");
    setElements(false);
  }
}

function testAPI(){
  FB.api(
    '/me',
    'GET',
    {"fields":"name,email,birthday,photos,picture"},
    function(response){
      if(response && !response.error){
        buildProfile(response);
      }
    }
  );
  FB.api(
    '/me',
    'GET',
    {"fields":"feed"},
    function(response){
      if(response && !response.error){
        buildFeed(response);
      }
    }
  );
}

function buildProfile(user){
  document.getElementById('profile').innerHTML = `
    <div class="profile-image">
      <img src="${user.picture.data.url}" alt="profile picture">
    </div>
    <div class="profile-username">
      <h3>${user.name}</h3>
      <p>${user.id}</p>
    </div>
    <ul class="profile-list">
      <li class="profile-item">Email: ${user.email}</li>
      <li class="profile-item">Birthday: ${user.birthday}</li>
    </ul>
  `;
}

function buildFeed(post){
  let output = '';
  for(let i in post.feed.data){
    if(post.feed.data[i].message){
      output += `
        <div class="post-item">
          <p class="post-msg">${post.feed.data[i].message.substring(0, 300)} ...</p>
          <p class="post-time">${post.feed.data[i].created_time.substring(0,10)}</p>
        </div>
      `;
    }
  }

  document.getElementById('post').innerHTML = output;
}

function setElements(isLoggedIn){
  if(isLoggedIn){
    document.getElementById('login-index').style.display = 'block';
    document.getElementById('default-index').style.display = 'none';
    document.getElementById('login').style.display = 'none';
    document.getElementById('logout').style.display = 'block';
    // document.getElementById('feed').style.display = 'block';
    // document.getElementById('heading').style.display = 'none';
  } else {
    document.getElementById('login-index').style.display = 'none';
    document.getElementById('default-index').style.display = 'block';
    document.getElementById('login').style.display = 'block';
    document.getElementById('logout').style.display = 'none';
    // document.getElementById('feed').style.display = 'none';
    // document.getElementById('heading').style.display = 'block';
  }
}

function logout(){
  FB.logout(function(){
    setElements(false);
  });
}

function refresh() {
  FB.api(
    '/me',
    'GET',
    {"fields":"feed"},
    function(response){
      if(response && !response.error){
        buildFeed(response);
      }
    }
  );
}
