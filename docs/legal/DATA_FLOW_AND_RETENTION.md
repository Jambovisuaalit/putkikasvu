# Putkikasvu — käsittelykartta ja poiston todennus v1.0
22.10.2026. **Suunnitellut aikarajat eivät vielä osoita toteutunutta poistamista.**

## 1. Havaittu, suunniteltu vai tuntematon
| Tietovirta | Rooli | Palvelu / tilanne | Nykyinen näyttö | Vaatimus ennen laajennusta |
| --- | --- | --- | --- | --- |
| Putkikasvun sivun kävijät, pyynnöt ja tekniset lokit | Putkikasvu rekisterinpitäjä omasta markkinoinnista; Vercelin rooli sopimuksesta riippuen | Vercel, nykyinen staattinen sivu / suojattu preview | Repon koodi ei sisällä omaa lomaketietokantaa eikä maksukassaa; Vercel-hosting tunnettu. Palvelulokit, evästeet, IP-käsittely, alueet ja tosiasialliset DPA-sopimusehdot **ei vahvistettu** | Projektin asetukset, tuotantoverkon Network/Storage, deployment security, lokit ja DPA/alikäsittelijät |
| Liidin lähettämä sähköposti | Putkikasvu rekisterinpitäjä | visualjambo@gmail.com / Gmail | Mailto avaa asiakkaan oman sähköpostisovelluksen; palvelimelle ei tallennu lomakeviestiä | Gmailin tilityyppi, käsittelysopimuksen soveltuvuus, suojaus, sijainnit, poistomalli |
| Tarjous, tilaussopimus, laskutustiedot | Putkikasvu rekisterinpitäjä | Sähköposti / manuaalinen arkistointi | Ei tuotantokelpoista maksulinkkiä eikä CRM-käsittelyrekisteriä tässä PR:ssä | Varsinainen tallennuspaikka, käyttöoikeudet, laki-/sopimusperuste, arkistointikäytäntö |
| Julkaisumateriaalien väliaikaiset kopiot | Putkikasvu joko käsittelijänä asiakkaan lukuun tai itsenäisenä rekisterinpitäjänä tilanteesta riippuen | Sovittava projektikohtaisesti | Ei vielä vahvistettua aineistokansiota, käyttöoikeusmallia eikä poistotodistetta | Materiaalien luokat, pääsynhallinta ja käsittelyroolin arvio, tarvittaessa DPA |
| Asiakkaan oman sivuston kävijät/lomakeviestit | Asiakas yleensä rekisterinpitäjä | Asiakkaan erikseen valitsema hosting | Ei oletusarvoista keräävää lomaketta Standardissa | Selvitä sivusto- ja hostingratkaisu, asiakkaan seloste, roolit, DPA, siirrot |
| Resend / Supabase / Revolut | Ei aktiivisena tämän PR:n tietovirrassa | Ei tässä versiossa | Ei liitettyjä lomake-, kanta- tai maksutoimintoja | Uusi dokumentointi ennen tulevaa käyttöönottoa |

**Julkiset toimittajatekstit eivät osoita tietyn tilin tarkkoja asetuksia.**
- Vercel DPA https://vercel.com/legal/dpa ja alikäsittelijälista https://security.vercel.com
- Google Privacy Policy https://policies.google.com/privacy ja kansainväliset siirrot https://policies.google.com/privacy/frameworks. **Kuluttaja-Gmailiin ei oleteta Google Workspace -DPA:ta.**
- GDPR EU 2016/679: https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=fi

## 2. Poistosäännöt hyväksyttäväksi ja toteutettavaksi
| Aineisto | Ehdotettu laskenta | Käytännön työ | Näyttö |
| --- | --- | --- | --- |
| Ei-kaupalliset yhteydenotot | 12 kk viimeisestä merkityksellisestä yhteydenotosta, jollei perusteltua poikkeusta ole | Rajaa Gmail-haulla viestit, tarkista poikkeukset, poista käsittelypaikasta ja mahdollisista kopioista | Päivä, viestien määrä, poikkeukset, tekijä |
| Sopimus-/projektiviestit | Sopimuksen ajan ja yleensä 3 vuotta päättymisestä vain tarpeellisin osin | Kokoa projektin päättymispäivä ja säilyttämisperuste, tarkista vuosittain | Tarkistuspäivä, säilytyksen perustelu |
| Asiakkaan ylimääräiset kuva- ja luonnoskopiot | 90 päivää hyväksytystä luovutuksesta, jollei perusteltua pidempää aikaa sovittu | Poista työ- ja jakokansiot, tiedostoversiot ja julkiset esikatselukopiot soveltuvin osin | Poistettu sijainti ja aika |
| Talousaineisto | Kirjanpitolain aineistolajikohtaiset 6/10 v vähimmäisajat | Säilytä erikseen muusta asiakasviestinnästä | Tilikausi + luokka + eräpäivä |
| Varmuuskopiot ja palvelun lokit | Todellisen toimittajan käytännön mukaan | Kirjaa tallennus-, poisto- ja restore-käytäntö; älä lupaa välitöntä lopullista poistamista | Toimittajan ohje/linkki/asetus |

Poistoja ei saa kirjata tehdyiksi ennen havaittua toteumaa. Rekisteröidyn poistopyyntö ei kumoa lakisääteistä säilytysvelvollisuutta; pyyntö ja vastaus kirjataan ilman tarpeettomia tietoja.

## 3. Yhden kuukauden käyttöönotto
1. **Päivä 0:** vahvista Gmailin tilityyppi, MFA, oikeutetut käyttäjät ja käytetyt projektikansiot; ota talteen asetuksia kuvaava päivätty todiste. Älä tallenna salaisuuksia tai henkilötietoja julkiseen GitHubiin.
2. **Päivä 0:** tarkista Vercelin oikea tuotanto-URL, suojauksen tila, evästeet/localStorage, kolmannen osapuolen kutsut ja palvelimelta mahdollisesti säilyvät IP-lokit.
3. **Päivä 1:** dokumentoi Vercelin ja Googlen sopimusasema, siirtojen perusteet, alikäsittelijät ja tiedonsaannin kanavat.
4. **Päivä 1:** tee ensimmäinen rajattu testipoisto **vain omasta keinotekoisesta testidatasta**, tallenna päivämäärä ja testin tulos (ei asiakasviestejä).
5. **Kuukausittain:** tarkista yli 12 kk ei-kaupalliset viestit ja 90 päivää ylittävät projektikopiot; tee poistot perustelluin poikkeuksin.
6. **Vuosittain:** käy läpi projektiviestien 3 vuoden säilytystarve, oikeutetun edun dokumentaatio ja markkinointikieltomerkinnät.

## 4. Todennekentät
- Tarkastaja / päivämäärä: [ ] / [ ]
- Gmailin tilityyppi ja voimassa olevat ehdot: [ ]
- Vercel-projekti, tuotannon eväste-/loki-/analytiikkahavainto: [ ]
- Vercel/Google kolmansien maiden siirtojen kartta ja sopimusperuste: [ ]
- Ensimmäinen testipoisto (ei henkilötietoja): [ ]
- Säilytysajat otettu käyttöön, omistaja: [ ]
- Poikkeamat ja seuraava korjauspäivä: [ ]

**Tila: EI TODETTU.** Tämä tiedosto on käsittelyrekisterin aloitus, ei väite toteutuneesta GDPR-vaatimustenmukaisuudesta.
