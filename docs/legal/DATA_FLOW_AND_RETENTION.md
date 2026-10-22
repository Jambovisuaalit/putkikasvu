# Putkikasvu — tietosuojainventaario
Päivitetty 22.10.2026. Omistaja: Harju Jami / Putkikasvu, jami@putkikasvu.fi. Y-tunnus 3581581-6 on käyttäjän ilmoittama; rekisteriyhteyttä ei ole tässä tarkistuksessa vahvistettu.

## Toteutunut käsittely
Putkikasvu on oman prospektoinnin, markkinointikieltojen, sopimusten ja laskutuksen rekisterinpitäjä. Maksupalvelun oma lakisääteinen käsittely arvioidaan erikseen. Julkinen lähde ei yksin oikeuta sähköpostimarkkinointiin: henkilökohtaisen työosoitteen käyttötarkoitus, käsittelyperuste, tarvittaessa tasapainotesti ja GDPR 14 -informointi tarkistetaan ennen yhteydenottoa.

| Palvelu | Todettu käyttö ja tietoryhmät | Toteutunut säilytys / poisto | Puuttuva varmennus |
| --- | --- | --- | --- |
| Google Sheets / Drive | Aktiivinen myyntipilotin CRM: yritys, osoite, lähde, havainto, luonnos, lähetys- ja vastaustunnisteet sekä estot. Tarkistetun CRM-tiedoston jakaminen oli pois päältä ja näkyvissä oli vain omistajan oikeus. | Tietoja on yhä taulukossa. Automaattista rivien määräaikaispoistoa ei todettu. Rivin tyhjennys ei todista versiohistorian tai erillisten kopioiden poistumista. Drive-roskakori tyhjenee palvelun ohjeen mukaan 30 päivässä; pysyvä tiedostopoisto on erillinen toimi. | Tilikohtainen sopimus, tietojen sijainti, varmistukset sekä kaikkien kopioiden luettelo. |
| Gmail | Pilotin vastausten ja aiemman kontaktoinnin tarkistus, viestit ja luonnokset. | Ei havaittua automaattista säilytysrajaa. Viestit säilyvät, kunnes ne poistetaan. Roskakorin palvelukohtainen säilytys on 30 päivää, ellei sitä tyhjennetä aiemmin. Arkistointi ei poista viestiä. | Tilin tyyppi ja mahdollinen Vault-/organisaatiosäilytys; automaattinen poistokäytäntö ei vahvistettu. |
| Resend | Käytössä: pilotin 10 toimitettua viestiä; vastaanottaja, sisältö, Resend-ID, Message-ID, toimitustila ja estot. Tarkistetussa listassa 37 lähetystä. | Tilikohtaista säilytysasetusta ei saatu vahvistettua. Palvelun julkinen käytäntö: Free/Pro/Scale-viestit ja lokit 30 päivää; Enterprise sopimuskohtainen. Muu asiakasdata tilin päätyttyä enintään 90 päivää, varmistukset 7 päivää. Aikainen poisto pyydetään tuelta. | Oma sopimustaso ja poiston toteutuminen; Sheets- ja Gmail-kopiot poistettava erikseen. |
| Revolut | Käyttäjän toimivaksi vahvistama erillinen maksulinkki; maksutapahtumat ja kirjanpitoaineisto. Tässä tarkistuksessa ei luettu maksutiliä eikä tehty testimaksua. | Todellista tilikohtaista poistoa ei testattu. Finanssipalvelun lakisääteinen säilytys voi jatkua asiakkuuden päätyttyä; Revolutin ETA-selosteessa yleensä enintään 10 vuotta, poikkeukset mahdollisia. | Palveleva oikeushenkilö, käytetty tuote ja sopimuksen mukainen säilytys. Maksulinkin poisto ei poista pankin tapahtumahistoriaa. |
| Vercel | Putkikasvu-projekti, suojatut esikatselut, mahdolliset IP-/pyyntö- ja suojauslokit. SSO-suojaus kaikille deploymenteille tarkistettu. Asiakastietokantaa tai uutta workeria ei otettu käyttöön. | Projektin todellista lokisäilytystä ei vahvistettu. Julkisessa ohjeessa runtime-lokien säilytys riippuu paketista; se ei kuvaa kaikkia turvallisuus-, käyttö- ja laskutuslokeja. Deploymentin poistaminen ei todista kaikkien lokien poistoa. | Sopimustaso, lokityypit, alikäsittelijät, DPA ja siirtoperusteet. Asiakaskohtainen jakolinkki on käyttöoikeus, ei noindex-suojaus. |

Resend ilmoittaa asiakasdatan tallennuspaikaksi Yhdysvallat. Lähetysalue eu-west-1 ei tarkoita EU-tallennusta. Resendin mukaan DPA tulee voimaan rekisteröitymisellä; oman sopimuksen ja siirtoperusteen dokumentointi on silti kesken.

## Todellinen poistotesti
22.10.2026 luotiin henkilötiedoton synteettinen Drive-testitiedosto, luettiin sen metadata ja poistettiin se pysyvästi. Uusintaluku palautti NOT_FOUND / 404. Testi osoittaa yksittäisen tiedoston poistopolun toiminnan. Se ei osoita CRM-rivien, Googlen varmistusten, Gmailin, Resendin, Revolutin tai Vercelin tietojen poistumista. Oikeita asiakas- tai prospektitietoja ei poistettu.

## Säilytyssuunnitelma ja manuaalinen poistomenettely
Seuraavat ovat tavoitteita, eivät vahvistettuja automaattisia käytäntöjä: ei-asiakkaiden prospektitietojen tarpeellisuusarvio viimeistään 12 kuukaudessa viimeisestä asiallisesta yhteydenotosta; toimitusaineiston tarpeellisuusarvio 3 vuodessa; ylimääräisten siirtokopioiden arvio 90 päivässä. Aikoja ei pidä esittää toteutuvina ennen vastuuhenkilön suorittamaa tarkistusta. Sopimus-, kirjanpito- ja vaadeaineisto käsitellään erikseen soveltuvan velvoitteen mukaan.

Poistopyyntö käsitellään manuaalisesti: varmista pyytäjä ja kohde, hae nimi/Y-tunnus/osoite/domain kaikista käytössä olevista lähteistä, arvioi säilytysvelvoite, poista tarpeettomat aktiivikopiot ja viennit sekä pyydä tarvittaessa palveluntarjoajan poisto. Kirjaa toteutuspäivä, kohteet, todennus ja jäljelle jäävän säilytyksen peruste. Pelkkä CRM-rivin tyhjennys ei riitä. Markkinointikiellosta säilytetään vain tarpeellinen estotieto, jotta poistettua osoitetta ei oteta uudelleen yhteydenottoon; kiellon tarkoitusta ja tarpeellisuutta arvioidaan erikseen.

## Lähteet ja rajat
Tarkistetut palveluohjeet 22.10.2026:
- https://support.google.com/drive/answer/14933051
- https://support.google.com/mail/answer/7401
- https://resend.com/security/gdpr
- https://www.revolut.com/fi-FI/legal/privacy/
- https://vercel.com/docs/logs/runtime

Tämä on toiminnan inventaario, ei todistus kaikkien palvelusopimusten tarkastuksesta. Tunnuksia, esikatselujen pääsylinkkejä ja prospektien viestisisältöjä ei tallenneta julkiseen repositorioon.
