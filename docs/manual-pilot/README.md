# Ensimmäinen Putkikasvu-tilaus — manuaalinen pilotti

Versio 0.1 • 22.10.2026 • LUONNOS, ei maksamisen tai tuotannon aktivointia.
Standard 590 €: ennakko 295 € ja loppumaksu 295 €. Ylläpito ja domain erikseen.
Myyjä: Tmi Jami Harju, Y-tunnus 3581581-6. Sopimus- ja ALV-tiedot vahvistetaan
juridisessa työvirrassa ennen maksullista tilausta.

## Suositus

Ensimmäiselle asiakkaalle: yksi vastuuhenkilö (Jami), yksi tilauskortti ja yksi
rajattu asiakaskansio nykyisissä hyväksytyissä työkaluissa. Ei asiakasportaalia,
Supabase-tiliä, uutta tilaussovellusta tai uutta maksullista palvelua. Asiakas
hyväksyy tarjouksen ja valmiin toteutuksen kirjallisesti sähköpostissa. Aineistot
nykyisen sähköpostin tai jo hyväksytyn yksityisen tiedostonjaon kautta.

Tilauskorttia ja oikeita maksutodisteita ei tallenneta GitHubiin. GitHub sisältää
ainoastaan nämä pohjat, synteettisen tilakoneen ja testit. Tämä PR ei muuta sivustoa.

## Prosessi ja portit

| Vaihe | Vastuu ja toimi | Näyttö ennen seuraavaa vaihetta |
|---|---|---|
| 1. Hyväksytty tarjous | Jami lähettää tarjouksen erillisen hyväksynnän jälkeen; asiakas hyväksyy kirjallisesti | Tilaustunnus, yritys/Y-tunnus, hyväksyjän valtuus, tarjouksen ja ehtojen versio, 590 €, erät 295 € + 295 €, sovittu sisältö ja aikataulun alkamisehdot, alkuperäinen hyväksyntäviesti |
| 2. Ennakkomaksupyyntö | Käytetään vain erikseen hyväksyttyä olemassa olevaa maksutapaa/linkkiä | Pyynnössä tilaus- ja eräviite, 295 €, oikea saaja; linkin summa ja kohdistettavuus tarkistettu. Linkkiä ei muuteta tämän tehtävän perusteella |
| 3. Maksun varmennus | Jami avaa itse oman Revolut Pro -tapahtuman | Kaikki alla olevat todistekentät täsmäävät; tilaan merkitään erikseen tarkastettu suoritus |
| 4. Asiakkaan aineistot | Asiakas toimittaa sovitut yritystiedot, palvelut ja kuvat | Käyttöoikeudet vahvistettu, sisältörajaukset ja yhteystiedot tarkistettu; ei salasanoja sähköpostilla |
| 5. Toteutus | Jami rakentaa sovitun kokonaisuuden | Yksilöity esikatselu/build-versio, tekninen QA, koottu korjauskierros |
| 6. Hyväksyntä | Asiakas hyväksyy täsmälleen nimetyn version kirjallisesti | Hyväksyjä, valtuus, build-tunniste, päivä ja alkuperäinen hyväksyntäviesti; uusi versio vaatii uuden hyväksynnän |
| 7. Loppumaksu | Jami pyytää vasta hyväksynnän jälkeen 295 € ja varmentaa sen | Uusi yksilöllinen tapahtumatunniste; samat todistesäännöt kuin ennakossa |
| 8. Julkaisu | Jami tarkistaa molemmat maksut, hyväksynnän, domain-oikeudet ja QA:n | Ei avointa palautusta/riitaa, julkaistava versio on hyväksytty; erillinen lupa julkaisuun |

Hyväksyntä ≠ maksu. Maksupyyntö ≠ tapahtuma. Maksulinkin yleinen tila ≠
yksittäinen tilauskohtainen suoritus. Työn aloitus tai julkaisu ei perustu asiakkaan
ilmoitukseen, kuvakaappaukseen, maksulinkin paluuosoitteeseen tai vapaaseen muistiinpanoon.

## Luotettava maksutodiste

Luotettava lähde on myyjän itse avaama, todennettu Revolut Pro -tapahtuma tai siitä
myyjän itsensä hankkima alkuperäinen tapahtumaraportti. Asiakkaan toimittama kuitti
on selvitysvihje, ei yksin todiste. Pelkkä käsittelijän teksti "tarkistettu" ei riitä.

Kirjaa yksityiseen tilauskorttiin jokaisesta erästä:

1. Yksilöllinen palveluntarjoajan tapahtumatunniste ja todistetyyppi.
2. Oikea Pro-vastaanottotili tai sen sisäinen tunniste; ei koko tilinumeroa julkiseen aineistoon.
3. Bruttosuoritus täsmälleen 295,00 € ja valuutta EUR. Palvelumaksu ja nettotilitys
   kirjataan erikseen: nettotilityksen ei tarvitse olla 295 €. Yli-/alimaksu jää selvitykseen.
4. Tapahtuman todellinen maksutila sekä tieto tilityksestä. Tämän konservatiivisen
   ensimmäisen pilotin portti on varojen tilitys/saapuminen, ei pelkkä katevaraus.
5. Maksun ja tilityksen aika. Ennakko ei edellä hyväksyntää; loppumaksu ei edellä build-hyväksyntää.
6. Yksiselitteinen yhteys tähän yritykseen, tilaukseen ja maksuerään, nähtävissä
   tapahtumatiedosta/alkuperäisestä raportista. Jos maksaja toimii yrityksen puolesta,
   poikkeama ja valtuus selvitetään ja dokumentoidaan ennen vahvistusta.
7. Ei tunnettua peruutusta, palautusta, riitautusta tai päällekkäistä kohdistusta.
8. Tarkastajan nimi, tarkastusaika ja viite yksityiseen alkuperäistodisteeseen.

Jos olemassa olevan maksulinkin tiedot eivät mahdollista yksiselitteistä kohdistusta,
**älä merkitse maksua varmennetuksi**. Selvitä asia tapahtumatiedoista/palveluntarjoajan
kanssa ja hyväksytä tarvittava maksuprosessin muutos erikseen. Maksajan nimi, samansuuruinen
maksu tai ajallinen läheisyys eivät yksin riitä luotettavaan kohdistukseen.

Revolutin Pro-ohjeen mukaan ensimmäisen tilityksen odotusaika voi olla 7 päivää;
myöhempi nopeampi tilitys riippuu tilin historiasta ja tarkistuksista. Tämän tilin
käytännön aikataulua ei ole tarkistettu. Älä lupaa työn alkua heti maksulinkin käytön
jälkeen. Palvelumaksuja voi syntyä oikeista maksuista; tässä tehtävässä ei tehty maksuja.

## Poikkeamat

- Pending/authorised/epäselvä tai väärä maksu: ei vahvistusta; säilytä selvitystila.
- Sama tapahtuma uudelleen: sama kohdistus on idempotentti; eri tilaus/erä hylätään.
- Epäselvä yritys/maksaja: varmista valtuus ja tapahtuman tilauskytkentä.
- Aineistojen käyttöoikeus puuttuu: toteutus ei etene.
- Korjauspyyntö: paluu toteutukseen; uusi build ja uusi kirjallinen hyväksyntä.
- Palautus, riita tai peruutus: pysäytä eteneminen ja kirjaa syy. Älä poista aiempaa
  maksua tai lokimerkintää. Todellinen palautus vaatii erillisen päätöksen/toimenpiteen.
- Julkaisun jälkeinen riita: manuaalinen käsittely; malli ei poista julkaistua sivustoa.

## Synteettinen toteutus ja luottamusraja

`tools/manual-pilot/workflow.mjs` on offline-malli, ei tuotantovarmennin. Se ei avaa
maksulinkkejä, kirjoita levyä, kutsu verkkoa tai julkaise sivustoa. Se ei ole Next-sivun
importti, API tai asiakasportaali. Tuotantotila (`mode: live`, oletus) hylkää kaikki
maksuvahvistukset virheellä `LIVE_VERIFIER_NOT_CONFIGURED` ja estää testitodisteiden
syötön. Sitä ei pidä käyttää oikeiden tilauksien kirjanpitona.

Synteettinen tila luottaa vain käynnistyksessä annettuun fiktiiviseen tapahtumarekisteriin,
josta haetaan tapahtuma tunnisteella. Varmennuspyynnön lähettäjä ei voi syöttää summaa,
saajaa tai "maksettu"-lippua todisteeksi. Rekisteri on vain testien luottamusjuuri,
ei Revolutin allekirjoitus tai oikea pankkitodiste. Mallin reviewer-lista ei ole
kirjautumisjärjestelmä; se testaa rooliportin. Kaikki tallennus on vain prosessin muistissa.

Live-integraatiota ei pidä rakentaa pelkän evidenceNote-tekstin tai asiakkaan kuittikuvan
varaan. Oikea palvelinvarmennin vaatisi erikseen todennetun Pro-tapahtumalähteen,
pysyvän yksilöllisyysrajoitteen, atomisen tilasiirtymän, käyttöoikeudet ja auditoinnin.
Revolut Merchant API:n saatavuutta tälle Pro-tilille ei ole oletettu tai tarkistettu.

## Testaus

`npm test` ajaa myös tämän mallin testit; `npm run build` varmentaa, ettei malli
muutu verkkosivun maksu- tai tallennustoiminnoksi. Testit kattavat koko kahdeksanvaiheisen
ketjun, väärät todisteet, tilajärjestyksen, uusintapyynnöt, päällekkäisen kohdistuksen,
roolit, vanhentuneen version, palautus/riitapysäytyksen sekä julkaisun portit.

## Viralliset lähteet (luettu 22.10.2026)

- https://help.revolut.com/help/more/revolut-pro/accepting-customer-payments/pro-settlement-time/
- https://help.revolut.com/help/more/revolut-pro/about-revpro-and-it-being-free/
- https://www.revolut.com/revolut-pro/

Tilin todellinen käyttöliittymä, maksulinkki, tapahtumien kentät ja kohdistettavuus
on vielä varmennettava omassa Pro-tilissä. Tämä työ ei tee sitä hyväksytyksi.
