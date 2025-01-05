const listaNekretnina = [
    {
        id: 1,
        tip_nekretnine: "Stan",
        naziv: "Useljiv stan Sarajevo",
        kvadratura: 58,
        cijena: 232000,
        tip_grijanja: "plin",
        lokacija: "Novo Sarajevo",
        godina_izgradnje: 2019,
        datum_objave: "01.10.2023.",
        opis: "Sociis natoque penatibus.",
        upiti: [
            {
                korisnik_id: 1,
                tekst_upita: "Nullam eu pede mollis pretium."
            },
            {
                korisnik_id: 2,
                tekst_upita: "Phasellus viverra nulla."
            }
        ]
    },
    {
        id: 1,
        tip_nekretnine: "Stan",
        naziv: "Useljiv stan Sarajevo",
        kvadratura: 58,
        cijena: 32000,
        tip_grijanja: "plin",
        lokacija: "Novo Sarajevo",
        godina_izgradnje: 2019,
        datum_objave: "01.10.2009.",
        opis: "Sociis natoque penatibus.",
        upiti: [
            {
                korisnik_id: 1,
                tekst_upita: "Nullam eu pede mollis pretium."
            },
            {
                korisnik_id: 2,
                tekst_upita: "Phasellus viverra nulla."
            }
        ]
    },
    {
        id: 1,
        tip_nekretnine: "Stan",
        naziv: "Useljiv stan Sarajevo",
        kvadratura: 58,
        cijena: 232000,
        tip_grijanja: "plin",
        lokacija: "Novo Sarajevo",
        godina_izgradnje: 2019,
        datum_objave: "01.10.2003.",
        opis: "Sociis natoque penatibus.",
        upiti: [
            {
                korisnik_id: 1,
                tekst_upita: "Nullam eu pede mollis pretium."
            },
            {
                korisnik_id: 2,
                tekst_upita: "Phasellus viverra nulla."
            }
        ]
    },
    {
        id: 2,
        tip_nekretnine: "Kuća",
        naziv: "Mali poslovni prostor",
        kvadratura: 20,
        cijena: 70000,
        tip_grijanja: "struja",
        lokacija: "Centar",
        godina_izgradnje: 2005,
        datum_objave: "20.08.2023.",
        opis: "Magnis dis parturient montes.",
        upiti: [
            {
                korisnik_id: 2,
                tekst_upita: "Integer tincidunt."
            }
        ]
    },
    {
        id: 3,
        tip_nekretnine: "Kuća",
        naziv: "Mali poslovni prostor",
        kvadratura: 20,
        cijena: 70000,
        tip_grijanja: "struja",
        lokacija: "Centar",
        godina_izgradnje: 2005,
        datum_objave: "20.08.2023.",
        opis: "Magnis dis parturient montes.",
        upiti: [
            {
                korisnik_id: 2,
                tekst_upita: "Integer tincidunt."
            }
        ]
    },
    {
        id: 4,
        tip_nekretnine: "Kuća",
        naziv: "Mali poslovni prostor",
        kvadratura: 20,
        cijena: 70000,
        tip_grijanja: "struja",
        lokacija: "Centar",
        godina_izgradnje: 2005,
        datum_objave: "20.08.2023.",
        opis: "Magnis dis parturient montes.",
        upiti: [
            {
                korisnik_id: 2,
                tekst_upita: "Integer tincidunt."
            }
        ]
    }
]

const listaKorisnika = [
    {
        id: 1,
        ime: "Neko",
        prezime: "Nekic",
        username: "username1",
    },
    {
        id: 2,
        ime: "Neko2",
        prezime: "Nekic2",
        username: "username2",
    }
]

const propertiesList = [
    {
        id: 1000001,
        tip_nekretnine: "Stan",
        naziv: "Useljiv stan Sarajevo",
        kvadratura: 120,
        cijena: 232000,
        tip_grijanja: "plin",
        lokacija: "Novo Sarajevo",
        godina_izgradnje: 2019,
        datum_objave: "01.10.2023.",
        opis: "Sociis natoque penatibus.",
        upiti: []
    },
    {
        id: 1000002,
        tip_nekretnine: "Stan",
        naziv: "Useljiv stan Sarajevo",
        kvadratura: 160,
        cijena: 32000,
        tip_grijanja: "plin",
        lokacija: "Novo Sarajevo",
        godina_izgradnje: 2019,
        datum_objave: "01.10.2009.",
        opis: "Sociis natoque penatibus.",
        upiti: [
            {
                korisnik_id: 2000001,
                tekst_upita: "Nullam eu pede mollis pretium."
            }
        ]
    },
    {
        id: 1000003,
        tip_nekretnine: "Stan",
        naziv: "Useljiv stan Sarajevo",
        kvadratura: 155,
        cijena: 232000,
        tip_grijanja: "plin",
        lokacija: "Novo Sarajevo",
        godina_izgradnje: 2019,
        datum_objave: "01.10.2003.",
        opis: "Sociis natoque penatibus.",
        upiti: [
            {
                korisnik_id: 2000002,
                tekst_upita: "Nullam eu pede mollis pretium."
            }
        ]
    },
    {
        id: 1000004,
        tip_nekretnine: "Kuća",
        naziv: "Mali poslovni prostor",
        kvadratura: 250,
        cijena: 70000,
        tip_grijanja: "struja",
        lokacija: "Centar",
        godina_izgradnje: 2005,
        datum_objave: "20.08.2023.",
        opis: "Magnis dis parturient montes.",
        upiti: [
            {
                korisnik_id: 2000001,
                tekst_upita: "Integer tincidunt."
            },
            {
                korisnik_id: 2000002,
                tekst_upita: "Integer tincidunt."
            }
        ]
    },
    {
        id: 1000005,
        tip_nekretnine: "Kuća",
        naziv: "Mali poslovni prostor",
        kvadratura: 255,
        cijena: 290000,
        tip_grijanja: "struja",
        lokacija: "Centar",
        godina_izgradnje: 2005,
        datum_objave: "20.08.2023.",
        opis: "Magnis dis parturient montes.",
        upiti: [
            {
                korisnik_id: 2000001,
                tekst_upita: "Nullam eu pede mollis pretium."
            },
            {
                korisnik_id: 2000002,
                tekst_upita: "Nullam eu pede mollis pretium."
            },
            {
                korisnik_id: 2000001,
                tekst_upita: "Phasellus viverra nulla."
            },
            {
                korisnik_id: 2000002,
                tekst_upita: "Phasellus viverra nulla."
            }
        ]
    },
    {
        id: 1000006,
        tip_nekretnine: "Kuća",
        naziv: "Mali poslovni prostor",
        kvadratura: 260,
        cijena: 300000,
        tip_grijanja: "struja",
        lokacija: "Centar",
        godina_izgradnje: 2005,
        datum_objave: "20.08.2023.",
        opis: "Magnis dis parturient montes.",
        upiti: [
            {
                korisnik_id: 2000002,
                tekst_upita: "Integer tincidunt."
            },
            {
                korisnik_id: 2000002,
                tekst_upita: "Integer tincidunt."
            },
            {
                korisnik_id: 2000002,
                tekst_upita: "Integer tincidunt."
            }
        ]
    }
]

const usersList = [
    {
        id: 2000001,
        ime: "Neko1",
        prezime: "Nekic1",
        username: "username1",
    },
    {
        id: 2000002,
        ime: "Neko2",
        prezime: "Nekic2",
        username: "username2",
    },
    {
        id: 2000003,
        ime: "Neko3",
        prezime: "Nekic3",
        username: "username3",
    }
]

