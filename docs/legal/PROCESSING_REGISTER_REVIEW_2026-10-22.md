# Putkikasvu — käsittelytoimien inventaario ja käyttöönottotodennus
Päiväys 22.10.2026. **Tila: työversio, ei vahvistettu koko GDPR-käyttöönotto.**

Rekisterinpitäjä omassa myynnissä: Harju Jami / Putkikasvu (julkinen sopimusosoite vahvistamatta), jami@putkikasvu.fi.
Tämä täydentää olemassa olevaa DATA_FLOW_AND_RETENTION.md:tä, ei korvaa sitä.

| Käsittely | Rekisteröidyt ja tiedot | Tarkoitus / ehdotettu 6 artiklan peruste | Vastaanottajat ja järjestelmä | Säilytystavoite ja avoin näyttö |
| --- | --- | --- | --- | --- |
| Yritysprospektointi | Yrityksen yhteyshenkilöt, nimelliset työosoitteet, asema, lähde, verkkosivuhavainnot | Yritysasiakashankinta; 6(1)(f) vain ryhmä- ja tapauskohtaisesti hyväksytyn tasapainotestin jälkeen | Google Sheets/Drive, mahdolliset työaineistot | Ei-asiakkuudet arvioidaan viimeistään 12 kk viimeisestä asiallisesta kontaktista; ei automaattipoistoa vahvistettu |
| Sähköinen suoramarkkinointi | Lähettäjä/vastaanottaja, viesti, toimitustila, estot | Arvioitu oikeutettu etu sekä erillinen sähköisen markkinoinnin sallittavuus 917/2014 lain mukaan | Resend ja Google Sheets; Euronic/Gmail vastausten vastaanotto | Resendin tilin sopimustaso, säilytys, mahdollinen US-tallennus/siirtoperuste avoinna |
| Markkinointikielto | Osoite/domain ja välttämätön kieltoperuste | GDPR 21 vastustamisoikeuden noudattaminen; 6(1)(c) lakisääteisen velvoitteen osalta arvioitava | Sheets estolista ja Resend suppression | Säilytetään vain tarpeellinen esto niin kauan kuin se on relevantti; synkronointi ja poistomenettely todentamatta |
| Asiakasviestintä / tarjous | Nimi, yritys, tarjous, viestit, palvelutoiveet | 6(1)(b) sopimusta edeltävät toimet rekisteröidyn kanssa soveltuvin osin tai 6(1)(f) B2B-yhteyshenkilön tapauksessa | Gmail/Euronic, Sheets, mahdollinen Docs/Drive | Projektiviestien tarpeellisuusarvio yleensä 3 vuotta sopimuksen päättymisestä; todellinen poistopolku avoin |
| Sopimus ja lasku | Sopimusosapuolet, tapahtumat ja kirjanpitotositteet | 6(1)(b), 6(1)(c) tai 6(1)(f) tietoryhmäkohtaisesti | Sovittava laskutus- ja maksujärjestelmä; Revolut mahdollinen | Kirjanpitolain aineistolajikohtaiset säilytysvelvoitteet erikseen |
| Verkkosivun toiminta | IP-, suojaus- ja pyyntölokit mahdollisesti | Palvelun ylläpito ja tietoturva; todellinen peruste täsmennettävä | Vercel, project putkikasvu | Projektin SSO on päällä; logityypit, retention, DPA ja siirrot avoinna |
| Demojen aineisto | Yritysnimi, julkiset palvelutiedot, mahdolliset henkilötiedot | Yrityskohtaiset luonnokset, käsittelyperuste aineistosta riippuen | Kehitysympäristö, GitHub ja mahdollisesti Vercel | Demojen julkaisu-, käyttöoikeus- ja poistokäytäntö varmistettava |
| Tietosuoja-/perustamisasiakirjat | Omistajan henkilötiedot, mahdolliset tunnistetiedot | Hallinto ja lakisääteiset velvoitteet | Rajattu ChatGPT Library / työtila | Käyttöoikeudet, tarpeellisuus ja yksityisyys säilytettävä; ei julkiseen repositorioon |
| Brevo tili | Oma yritysosoite ja tili-/lähettäjätiedot | Markkinointijärjestelmän tilinhallinta; henkilötietojen peruste ja käyttötarkoitus tarkennettava | Brevo | Aktiivinen Free-tili, yksi oma kontakti ja SMTP-relay; ei näyttöä asiakaskampanjasta. Tilin DPA/siirrot ja poisto avoin |

**Tarkistusnäyttö:**
- Google Sheets: 12 välilehteä, 30 yrityksen tutkimusjoukko, 10 lähetystä ja estolista (aiemmin tarkistettu). Historialliset viestit säilytetään.
- Resend: 10/10 delivered aiemmin varmennettu, avausseuranta ei käytössä; nykyisten tapahtumien muutokset tarkistetaan erikseen.
- Gmail: ei pilotin tunnetuista lähettäjistä löytyneitä vastauksia 22.10 alkaen tarkistushetkellä; eri osoitteesta tuleva vastaus mahdollinen.
- Vercel: Next.js-projekti tunnistettu, SSO suojaa kaikkia deploymenteja, viimeisissä deploymenteissa myös keskeneräisiä/virheellisiä tiloja. Kolmea yksittäistä asiakasdemoa ei varmennettu.
- Brevo: account Get onnistui; Free, SMTP relay enabled, yksi oma yhteysosoite kontaktina. Ei näyttöä ulkoisista kontakteista.
- Euronic: mailbox-/forwarding-testi aiemmassa Gmailissa osoitti vastaanoton; hallintapalvelun nykyisiä käyttöoikeuksia, sopimusta, retentionia ei tarkistettu.
- Revolut: maksulinkin käyttö käyttäjän ilmoitus, tiliä/tapahtumia ei luettu.
- GitHub: hyväksyntäluonnokset ovat kehityshaarassa. Käytettyjen testitietojen tarkistus avoin.
 
**Toimenpidelista, EI hyväksytyt kontrollit:**
- [ ] Art. 14 tietosuojaselosteen julkisen version ja lähde-/vastaanottajatietojen tarkistus.
- [ ] 6(1)(f) tarpeellisuus ja tasapainotesti yritys- ja osoitetyypeittäin.
- [ ] DPA:t, alikäsittelijät, kolmansien maiden siirrot ja käyttöoikeuksien todentaminen.
- [ ] Oikeiden säilytysrajojen ja synteettisten palvelukohtaisten poistotestien dokumentointi.
- [ ] Varmista, että 22.10 jo lähetettyjen viestien informointia ei väitetä annetuksi jälkikäteen ilman todistetta.
 
Viranomaispohja: https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=fi

## Täsmennys 23.10.2026 — lähteet ja vastuut
Ensisijainen toteumainventaario: [DATA_FLOW_AND_RETENTION.md](DATA_FLOW_AND_RETENTION.md). Tämän tiedoston historiallisia havaintoja ei käsitellä uutena tilikohtaisena varmennuksena. Tarkastaja: tämän toimeksiannon suorittanut agentti; operatiivinen vastuuhenkilö ja käyttöoikeuksien hyväksyjä: palvelun omistaja. Oikeusperusteet ovat arvioitavia ehdotuksia, eivät tämän työn uutta oikeudellista hyväksyntää.

| Järjestelmä | Tarkoitus, tietoryhmät ja rooli | Sijainti, siirrot ja alikäsittelijät | Säilytys, poisto ja oikeudet | Näyttö 23.10.2026 |
| --- | --- | --- | --- | --- |
| Sheets / Drive | CRM ja sopimusaineisto; Putkikasvu rekisterinpitäjä; Googlen käsittelijärooli sopimuksesta | Tilikohtainen sijainti, sopimus ja siirtoperuste avoinna | Suunniteltu tarpeellisuusarvio 12 kk; poistopolku pääinventaarion mukaan. Käyttöoikeuslista tarkistettava uudelleen | 12 välilehteä ja seurannan 10 riviä luettu; ei tämän työn jakamisoikeus- tai poistotestiä |
| Gmail | Vastaukset, tarjoukset, kiellot; omat myyntitiedot | Kuluttaja-/Workspace-sopimus, sijainti, siirrot ja alikäsittelijät avoinna | Todennettua automaattipoistoa ei ole; viesti, roskakori ja kopiot erikseen; käyttöoikeudet avoinna | Lähettäjä- ja aihehaut suoritettu; ei pilotin vastausosumia |
| Euronic | Yritysposti ja mahdollinen välitys Gmailiin | Sopimus, oikeushenkilö, sijainti ja alikäsittelijät avoinna | Palvelimen, välitettyjen kopioiden ja varmistusten poisto erikseen; laatikko-oikeudet avoinna | Aiempi vastaanottohavainto, ei uutta hallintavarmennusta |
| Resend | Kymmenen pilotin viestin toimitusmetadata; Putkikasvu rekisterinpitäjä | Tilikohtainen DPA, US-siirtoperuste ja alikäsittelijäluettelo dokumentoitava | Julkinen palvelupolitiikka ei todista tilikohtaista poistoa; paikalliskopiot erikseen | Tuore listaus: pilotin 10 viestiä delivered; ei avausnäyttöä |
| Vercel | Sivusto, demot, tekniset lokit | Demojen region iad1; tämä ei kuvaa kaikkien lokien tai tukipalveluiden sijaintia. DPA/siirrot/alikäsittelijät avoinna | Kolme demoa READY; SSO all. Lokisäilytys ja asiakaskohtainen pääsynrajaus varmistettava | Projektin ja kolmen deploymentin metadata luettu |
| GitHub | Lähdekoodi ja dokumentaatio; mahdolliset julkiset yritysyhteystiedot | Repojen näkyvyys, sopimus, siirrot ja alikäsittelijät tarkistettava | Git-historia ja kloonit eivät poistu tiedoston poistolla; ei salaisuuksia tai henkilötunnuksia | PR #12 ja pohjahaara luettu; uusi sisältö rajattu dokumentteihin |
| ChatGPT / työaineistot | Tutkimus, demot ja asiakirjat; asiakkaan aineistot vain tarpeellisin osin | Työtilatyyppi, sopimus, sijainti, koulutuskäyttö ja alikäsittelijät avoinna | Arkistot, paikalliskopiot ja keskustelut erillisiä; poistot ja jakamisoikeudet avoinna | Kaksi nimettyä demoarkistoa haettu, ei yksityisiä perustamispapereita julkiseen repoon |
| Brevo | Historiallisen havainnon mukaan oma tili ja oma kontakti | Palveleva oikeushenkilö, DPA, siirrot ja alikäsittelijät avoinna | Kontaktin, SMTP-lokien ja tilitietojen todellinen säilytys/poisto avoinna | Ei uutta tililukua; ei väitettä uusista kampanjoista |
| Revolut | Käyttäjän ilmoittama maksulinkki; mahdolliset maksaja- ja tapahtumatiedot | Vastaanottaja, tuote, oikeushenkilö, rooli ja siirrot avoinna | Lakisääteiset palveluntarjoajan säilytykset erotettava omista tositteista; ei poistotestiä | Ei tililukua eikä maksua; maksujen käsittelyä ei varmennettu |

Kieltoprosessi: havaittu kielto keskeyttää kyseisen vastaanottajan markkinoinnin. Vastuuhenkilö täsmäyttää osoitteen ja tunnetut aliakset, kirjaa vain tarpeellisen estotiedon sekä varmistaa Sheets- ja Resend-estot ennen uutta lähetystä. Tämä on suunniteltu manuaalinen prosessi; automaattista synkronointia ei ole tämän työn perusteella todistettu.
