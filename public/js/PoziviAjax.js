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
        const url = 'http://localhost:3000/korisnik';
    
        ajaxRequest('GET', url, null, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function impl_putKorisnik(noviPodaci, fnCallback) {
        const url = 'http://localhost:3000/korisnik';
    
        ajaxRequest('PUT', url, noviPodaci, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        const url = 'http://localhost:3000/upit';
        const data = {
            nekretnina_id: nekretnina_id,
            tekst_upita: tekst_upita
        };
    
        ajaxRequest('POST', url, data, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function impl_getNekretnine(fnCallback) {
        const url = `http://localhost:3000/nekretnine`;

        ajaxRequest('GET', url, null, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function impl_postLogin(username, password, fnCallback) {
        const url = 'http://localhost:3000/login';
        const data = {
            username: username,
            password: password
        };
    
        ajaxRequest('POST', url, data, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }
    
    function impl_postLogout(fnCallback) {
        const url = 'http://localhost:3000/logout';

        ajaxRequest('POST', url, null, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function impl_getTop5Nekretnina(lokacija, fnCallback) {
        const url = `http://localhost:3000/nekretnine/top5?lokacija=${encodeURIComponent(lokacija)}`;

        ajaxRequest('GET', url, null, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function impl_getMojiUpiti(fnCallback) {
        const url = 'http://localhost:3000/upiti/moji';

        ajaxRequest('GET', url, null, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function impl_getNekretnina(nekretnina_id, fnCallback) {
        const url = `http://localhost:3000/nekretnina/${encodeURIComponent(nekretnina_id)}`;

        ajaxRequest('GET', url, null, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function impl_getNextUpiti(nekretnina_id, page, fnCallback) {
        const url = `http://localhost:3000/next/upiti/nekretnina/${encodeURIComponent(nekretnina_id)}?page=${encodeURIComponent(page)}`;

        ajaxRequest('GET', url, null, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function impl_getInteresovanja(nekretnina_id, fnCallback) {
        const url = `http://localhost:3000/nekretnina/${encodeURIComponent(nekretnina_id)}/interesovanja`;
        
        ajaxRequest('GET', url, null, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function impl_postZahtjev(nekretnina_id, tekst, trazeniDatum, fnCallback) {
        const url = `http://localhost:3000/nekretnina/${encodeURIComponent(nekretnina_id)}/zahtjev`;
        const data = {
            tekst: tekst,
            trazeniDatum: trazeniDatum
        };
    
        ajaxRequest('POST', url, data, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function impl_putZahtjev(nekretnina_id, zid, odobren, addToTekst, fnCallback) {
        const url = `http://localhost:3000/nekretnina/${encodeURIComponent(nekretnina_id)}/zahtjev/${encodeURIComponent(zid)}`;
        const data = {
            odobren: odobren,
            addToTekst: addToTekst
        };
        
        ajaxRequest('PUT', url, data, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
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
        getNextUpiti: impl_getNextUpiti,
        getInteresovanja: impl_getInteresovanja,
        postZahtjev: impl_postZahtjev,
        putZahtjev: impl_putZahtjev
    };
})();