const form = document.getElementById('loginForm');
const errorDiv = document.getElementById('error');

form.addEventListener('submit',function(e) {
    e.preventDefault();


    const username=document.getElementById('username').value;
    const password=document.getElementById('password').value;

    fetch('/login', {
        method:'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({username,password})
    })

    .then(res=> res.json())
    .then(data=> {
        if(data.success){
            window.location.href="/inicio";
        } else {
            errorDiv.style.display="block";
        }
    });
});