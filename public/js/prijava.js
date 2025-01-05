window.onload = () => {
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    
    let dugme = document.getElementById("dugme");
    
    dugme.onclick = () => {
        PoziviAjax.postLogin(username.value, password.value, (err, data) => {
            if (err != null) {
                window.alert(err);
            } else {
                let message = JSON.parse(data);
                if (message.poruka == "Neuspješna prijava") {
                    let divElement = document.getElementById("areaBelow");
                    divElement.innerHTML = "<h2>Neispravni podaci</h2>";
                } else {
                    window.location.href = "http://localhost:3000/nekretnine.html";
                }
            }
        });
    };
}