# Putkikasvu — käsittelykartta ja poiston todennus v1.0
22.10.2026. **Suunnitellut aikarajat eivät vielä osoita toteutunutta poistamista.**

## 1. Rekisterinpitäjä ja nykyiset tietovirrat
Palveluntarjoaja ja rekisterinpitäjä: Harju Jami, Putkikasvu, Y-tunnus 3581581-6
(rekisteriyhteys tarkistettava). Osoite Mannerheimintie 109, Helsinki; kotipaikka Helsinki.
Yhteys: jami@putkikasvu.fi, https://putkikasvu.fi.
Tiedot ovat omistajan ilmoittamia; rekisterivarmennusta ei kuitata.

Putkikasvu toimii oman asiakashankintansa, markkinointikieltojensa, sopimustensa ja
laskutuksensa osalta itsenäisenä rekisterinpitäjänä.

| Käsittely | Rooli ja palvelu | Todettu käyttö | Vielä todennettava |
| --- | --- | --- | --- |
| Prospektointi, CRM ja estolista | Putkikasvu rekisterinpitäjä; Google Sheets / Drive | Nykyinen myyntipilottitaulukko, kontaktit, lähetysloki ja seuranta käytössä | Käsittelyperuste, informointi, käyttöoikeudet, säilytys ja poistot |
| Markkinointiviestit | Putkikasvu rekisterinpitäjä; Resend | 10 viestin toimitus tarkistettu 22.10.2026; avaus- ja klikkausseuranta pois | Palvelusopimukset, roolit, säilytys, siirtoperusteet |
| Yhteydenotot ja vastaukset | Putkikasvu rekisterinpitäjä; domainin sähköpostipalvelu ja Gmail | jami@putkikasvu.fi → visualjambo@gmail.com vastaanottoreitti varmennettu | Gmailin tilityyppi ja ehdot, suojaus, kansainväliset siirrot ja poistot |
| Tarjoukset, sopimukset ja laskutus | Putkikasvu rekisterinpitäjä; sähköposti ja yksityinen arkistointi | Tekstipohjat olemassa; ei näyttöä ensimmäisestä maksavasta tilauksesta | Asiakaskohtainen tallennuspaikka, pääsynhallinta, sopimus- ja lakiperuste |
| Maksut | Putkikasvu oman laskutuksensa rekisterinpitäjä; Revolutin oma rooli määräytyy ehdoista | Omistaja vahvisti maksulinkin toimivaksi; manuaalinen täsmäytys suunniteltu | Maksunsaaja ja tilauskohtainen tapahtumatodiste; palveluehdot |
| Hosting ja tekniset lokit | Putkikasvu oman sivunsa rekisterinpitäjä; Vercelin rooli sopimuksesta | Vercel-projekti ja suojatut previewt tunnettu | Todellisen tuotannon lokit, evästeet, alueet ja sopimukset |
| Asiakkaan aineistot ja sivuston henkilötiedot | Roolit arvioidaan projektikohtaisesti; asiakas yleensä oman sivustonsa rekisterinpitäjä | Standard ei oletusarvoisesti sisällä keräävää lomaketta | Tarvittaessa DPA ennen asiakkaan puolesta käsittelyä; aineistojen oikeudet |
| Suunniteltu Supabase-onboarding ja maksutausta | Ei todettua aktiivista käsittelyä | Kehityshaaran API:t dokumentoitu aktivoimattomiksi | Erillinen käyttöönotto ja testit; ei kuvata nykyiseksi palveluksi |

### Prospektien informointi ja oikeutettu etu
Julkisista lähteistä kerättyjen henkilökohtaisten yhteystietojen käsittelylle
dokumentoidaan käsittelyperuste, informointi ja tarvittaessa oikeutetun edun
tasapainotesti. Kun perusteeksi valitaan oikeutettu etu, dokumentoidaan tarkoitus,
tarpeellisuus ja rekisteröidyn etujen sekä oikeuksien punninta ennen käsittelyä.
Julkisuus ei yksin merkitse suostumusta.

Jos tietoja käytetään yhteydenottoon, GDPR 14 artiklan tiedot annetaan viimeistään
ensimmäisen yhteydenoton yhteydessä, ellei soveltuva poikkeus täyty; muut 14 artiklan
määräajat huomioidaan. Markkinoinnin vastustamisoikeus tuodaan esiin selkeästi.
GDPR-käsittelyperuste ei yksin ratkaise sähköisen suoramarkkinoinnin sallittavuutta.

Informointiin sisällytetään rekisterinpitäjä ja yhteys, tarkoitus ja peruste,
tietoryhmät ja lähteet, vastaanottajat, mahdolliset siirrot, säilytys,
rekisteröidyn oikeudet ja valitusoikeus. Tietyn prospektin lähde ja toimitettu
informointiversio kirjataan yksityiseen CRM:ään; henkilötietoja ei kopioida julkiseen repoon.
Tämä ohje ei todista aiempien viestien informoinnin tai tasapainotestin toteutusta.

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
