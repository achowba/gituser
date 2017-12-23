document.addEventListener ("DOMContentLoaded", function (e) {

    let searchBar = document.querySelector('#searchUser');
    let userProfile = document.querySelector('#profile');
    let myHeaders = new Headers();
    let myInit = {
        method: 'GET',
        headers: myHeaders,
        data: {
            client_id: 'c2e911e7e9864234202c',
            client_secret: 'cbcf24a5d60154cedbeef33a37e2b1c822e0c3c9',
            sort: 'created_asc',
            per_page: 10
        }
    };

    searchBar.addEventListener("keyup", getUserInfo);

    function getUserInfo (event) {

        let username = event.target.value.trim();
        let userUrl = 'https://api.github.com/users/'+username;

        if (username === '') {
            showError("Please Enter a Username");
        } else {
            fetch(userUrl, myInit)
              .then(response => response.json())
              .then(function (response) {
                // console.log(response);
                displayUserInfo(response);
                getUserRepo(username);
              }).catch(errorMessage => {
                console.log ("Failed to fetch: " + errorMessage);
              })
        }
    }

    function getUserRepo (userName) {
        let repoUrl = 'https://api.github.com/users/'+userName+'/repos';

        fetch(repoUrl, myInit)
            .then(response => response.json())
            .then(function (response) {
                console.log(response);
                displayUserRepo(response);
            }).catch(errorMessage => {
                console.log ("Failed to fetch: " + errorMessage);
            })
    }

    function displayUserInfo (data) {
        let userFound = `
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h3 class="panel-title">${data.name}</h3>
                </div>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-3 user-bio-image">
                            <img class="thumbnail avatar" src=${data.avatar_url} />
                            <a target="_blank" class="btn btn-primary btn-block" href="${data.html_url}">View Profile</a>
                        </div>
                        <div class="col-md-9">
                            <span class="label label-default"><b>Public Repos: </b>${data.public_repos}</span>
                            <span class="label label-primary"><b>Public Gists: </b>${data.public_gist}</span>
                            <span class="label label-success"><b>Followers: </b>${data.followers}</span>
                            <span class="label label-info"><b>Following: </b>${data.following}</span>
                            <br/><br/>
                            <ul class="list-group">
                                <li class="list-group-item"><b>Company: </b>${data.company}</li>
                                <li class="list-group-item"><b>Website: </b>${data.blog}</li>
                                <li class="list-group-item"><b>Location: </b>${data.location}</li>
                                <li class="list-group-item"><b>Member Since: </b>${data.created_at}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <h3 class="page-header">Repositories by <b>${data.name}</b></h3>
            <div id="repos"></div>
        `;

        let userNotFound = `
            <div class="alert alert-danger" role="alert">
                <p class="text-center">User Not Found! 🙁</p>
            </div>
        `

        if (data.name === null || data.name === undefined) {
            userProfile.innerHTML = userNotFound;
        } else {
            userProfile.innerHTML = userFound;
        }
    }

    function displayUserRepo (repoData) {
        let userRepo = document.querySelector('#repos');
        repoData.map((repo) => {
            return userRepo.innerHTML += `
                <div class="well">
                    <div class="row">
                        <div class="col-md-12">
                            <strong>${repo.name}</strong>: ${repo.description}
                        </div>
                        <div class="col-md-8 mrg-btm-10">
                            <span class="label label-default"><b>Forks: </b>${repo.forks_count}</span>
                            <span class="label label-primary"><b>Watchers: </b>${repo.watchers_count}</span>
                            <span class="label label-success"><b>Stars: </b>${repo.stargazers_count}</span>
                        </div>
                        <div class="col-md-4 mrg-btm-10">
                            <a target="_blank" class="btn btn-primary btn-block" href="${repo.html_url}">Repo Page</a>
                        </div>
                    </div>
                </div>
            `;
        })

        // userRepo.innerHTML = repoFound;
    }

    function showError (errorMessage) {
        let displayError = `
            <div class="alert alert-danger" role="alert">
                <p class="text-center">Failed to fetch! 🙁: ${errorMessage}</p>
            </div>
        `
        userProfile.innerHTML = displayError;
        // console.log(errorMessage)
    }
})