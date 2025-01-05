const PoziviAjax = (() => {

    // fnCallback se u svim metodama poziva kada stigne odgovor sa servera putem Ajax-a
    // svaki callback kao parametre ima error i data
    // ako je status 200 -> error je null, data je tijelo odgovora
    // ako postoji greška -> error je poruka greške, data je null

    function ajaxRequest(method, url, data, callback) {
        const ajax = new XMLHttpRequest();

        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    callback(null, ajax.responseText);
                } else {
                    callback({ status: ajax.status, statusText: ajax.statusText }, null);
                }
            }
        };

        ajax.open(method, url, true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.send(data ? JSON.stringify(data) : null);
    }

    function impl_getKorisnik(fnCallback) {
        let ajax = new XMLHttpRequest();

        ajax.onreadystatechange = () => {
            if (ajax.readyState == 4) {
                if (ajax.status == 200) {
                    console.log('Uspješan zahtjev, status 200');
                    fnCallback(null, JSON.parse(ajax.responseText));
                } else if (ajax.status == 401) {
                    console.log('Neuspješan zahtjev, status 401');
                    fnCallback('error', null);
                } else {
                    console.log('Nepoznat status:', ajax.status);
                }
            }
        };

        ajax.open('GET', 'http://localhost:3000/korisnik', true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.send();
    }

    function impl_putKorisnik(noviPodaci, fnCallback) {
        if (!req.session.username) {
            return fnCallback({ status: 401, statusText: 'Neautorizovan pristup' }, null);
        }

        // Get data from request body
        const { ime, prezime, username, password } = noviPodaci;

        const users = readJsonFile('korisnici');
        const user = users.find((u) => u.username === req.session.username);

        if (!user) {
            // User not found (should not happen if users are correctly managed)
            return fnCallback({ status: 401, statusText: 'Neautorizovan pristup' }, null);
        }

        if (ime) user.ime = ime;
        if (prezime) user.prezime = prezime;
        if (username) user.username = username;
        if (password) user.password = password;

        saveJsonFile('korisnici', users);
        fnCallback(null, { poruka: 'Podaci su uspješno ažurirani' });
    }

    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        if (!req.session.username) {
            return fnCallback({ status: 401, statusText: 'Neautorizovan pristup' }, null);
        }

        // Read user data from the JSON file asynchronously
        readJsonFileAsync('korisnici', (err, users) => {
            if (err) {
                return fnCallback({ status: 500, statusText: 'Internal Server Error' }, null);
            }

            // Read properties data from the JSON file asynchronously
            readJsonFileAsync('nekretnine', (err, nekretnine) => {
                if (err) {
                    return fnCallback({ status: 500, statusText: 'Internal Server Error' }, null);
                }

                const user = users.find((u) => u.username === req.session.username);
                const property = nekretnine.find((p) => p.id === nekretnina_id);

                if (!property) {
                    return fnCallback({ status: 400, statusText: `Nekretnina sa id-em ${nekretnina_id} ne postoji` }, null);
                }

                property.upiti.push({
                    korisnik_id: user.id,
                    tekst_upita: tekst_upita
                });

                // Save the updated properties data back to the JSON file asynchronously
                saveJsonFileAsync('nekretnine', nekretnine, (err) => {
                    if (err) {
                        return fnCallback({ status: 500, statusText: 'Internal Server Error' }, null);
                    }

                    fnCallback(null, { poruka: 'Upit je uspješno dodan' });
                });
            });
        });
    }

    function impl_getNekretnine(fnCallback) {
        ajaxRequest('GET', '/nekretnine', null, (error, data) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(data));
                } catch (parseError) {
                    fnCallback(parseError, null);
                }
            }
        });
    }

    function impl_postLogin(username, password, fnCallback) {
        const ajax = new XMLHttpRequest();

        ajax.onreadystatechange = () => {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response);
            } else if (ajax.readyState == 4) {
                fnCallback(ajax.statusText, null);
            }
        };

        ajax.open('POST', 'http://localhost:3000/login', true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.send(JSON.stringify({
            'username': username,
            'password': password
        }));
    }

    function impl_postLogout(fnCallback) {
        let ajax = new XMLHttpRequest();

        ajax.onreadystatechange = () => {
            if (ajax.readyState == 4 && ajax.status == 200) {
                fnCallback(null, ajax.response);
            } else if (ajax.readyState == 4) {
                fnCallback(ajax.statusText, null);
            }
        };

        ajax.open('POST', 'http://localhost:3000/logout', true);
        ajax.send();
    }

    function impl_getTop5Nekretnina(lokacija, fnCallback) {
        const url = `http://localhost:3000/nekretnine/top5?lokacija=${encodeURIComponent(lokacija)}`;

        ajaxRequest('GET', url, null, (error, response) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError, null);
                }
            }
        });
    }

    function impl_getMojiUpiti(fnCallback) {
        const url = 'http://localhost:3000/upiti/moji';

        ajaxRequest('GET', url, null, (error, response) => {
            if (error) {
                fnCallback(error, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError, null);
                }
            }
        });
    }

    function impl_getNekretnina(nekretnina_id, fnCallback) {

    }

    function impl_getNextUpiti(nekretnina_id, page, fnCallback) {

    }

    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine,
        getTop5Nekretnina: impl_getTop5Nekretnina,
        getMojiUpiti: impl_getMojiUpiti,
        getNekretnina: impl_getNekretnina,
        getNextUpiti: impl_getNextUpiti
    };
})();