# Putkikasvu — tilausvalmiuden hyväksyntäraportti 23.10.2026

**Kokonaispäätös: ESTE.** Ensimmäisen 590 € tilauksen edellytyksiä parannettiin, mutta myyjän rekisteri-, vero- ja maksutietoja sekä asiakkaan demoavausta ei ole vielä todennettu. Ei viestejä, maksuja, tuotantojulkaisua tai PR-yhdistämistä.

| # | Kohde | Tila | Todennettu tulos ja jäljellä oleva vaatimus |
| --- | --- | --- | --- |
| 1 | PR #12 | VALMIS paikallisen tarkastuksen osalta | Lähtö-SHA 47eb50d, pohja b68bb1d; alkuperäinen diff 5 dokumenttia. Vercel-buildin syy toistettu: tietosuojainventaariosta puuttuivat testin vaatima käyttöönoton rajaus ja kuluttaja-Gmailin sopimusrajaus. Täydennetty dokumentti; testejä ei heikennetty. 18/18 testit, Next.js-tuotantobuild ja verify-export PASS; git diff --check PASS. Etä-CI uudelle commitille erikseen. PR jää Draftiksi. |
| 2 | Käsittelyrekisteri | ESTE | 9 järjestelmää kuvattu täydentävässä matriisissa; toteumat erotettu suunnitelmista. DPA:t, tilikohtaiset siirrot, alikäsittelijät, oikeudet ja useimmat poistot avoinna. Uusia oikeiden tietojen poistotestejä ei tehty. |
| 3 | Oikeutettu etu ja informointi | ESTE | Aiempi kontakti erotettu kiellosta. Viisi vastaanottajaryhmää ja estot käsitelty. Ei vastaanottajakohtaista yleislupaa; juridinen lähdevarmennus ja julkaistun selosteen vastaavuus avoinna. 22.10 informointia ei merkitty annetuksi. |
| 4 | Virallinen myyjä | ESTE | Myyjän identiteetti, Y-tunnus ja osoite ovat ilmoitettuja tietoja. Uusi YTJ-ote puuttuu. Y3-luonnos ei todista rekisteröintiä. PRH:n avoin data ei kata toiminimiyrittäjiä. |
| 5 | Ennakkoperintä ja ALV | ESTE | Nykyinen rekisteritila, 2025 ja 2026 liikevaihto ja soveltuva pidätysmenettely puuttuvat. Ehdoton ALV-väite poistettu tarjouspohjasta. Ei lisäystä sovittuun kokonaishintaan. |
| 6 | Revolut ja laskutus | ESTE | Ei maksutilin tai linkin vastaanottajan varmennusta, kuitti-/palautusnäyttöä tai maksua. Täsmäytykseen vaaditaan brutto, netto, mahdollinen pidätys, vastaanottaja ja tosite. |
| 7 | Tilausvahvistusluonnos | HYVÄKSYNTÄÄ ODOTTAVA | Täydennetty molempien osapuolten vahvistuksella, aikataulun alkuehdoilla, palautusehtojen v1.2-yhteenvedolla ja liiteversioiden arkistoinnilla. Ei käyttövalmis ennen kohtien 4–6 tietoja. Aiemmin hyväksyttyjä v1.2-kaupallisia ehtoja ei avattu uudelleen. |
| 8 | Kolme demoa | ESTE jakovalmiudelle | Kaikki READY, valtuutettu HTTP 200, anonyymi selain estetty, luonnokset näkyvät, ankkurit ehjät, ei kuvia/lomakkeita. Näkyvät tekstit vastaavat uudempaa arkistoa. Asiakkaan access-linkin testi ja tuore mobiili-QA puuttuvat. |
| 9 | Myyntivastaukset | VALMIS rajatulle tarkistukselle | Resend: kaikki 10 delivered, ei uusia pilotin toimitusvirheitä listauksessa. Gmail: kaikkien 10 tunnetun osoitteen haku kaikista kansioista ei osumia; aihe-/kieltohaku ei tuottanut pilotin vastausta. Toisesta osoitteesta tai välittymättömään Euronic-laatikkoon saapunutta vastausta ei suljeta pois. Delivered ei tarkoita luettua. |
| 10 | Hyväksyntäesteet | ESTE | Alla yksilöity; ei korvata omistajan hyväksynnällä puuttuvaa näyttöä. |
| 11 | Seuraava käytännön toimi | ESTE maksun pyytämiselle | Hanki tuore myyjän rekisteriote ja 2025/2026 liikevaihtoluvut; vahvista pidätys-/laskutusmenettely ja maksun vastaanottaja. Samalla tee asiakkaan näkökulmasta demoavaus ja mobiili-QA. Tavoite: 0 puuttuvaa P0-tietoa ennen ensimmäistä sitovaa tarjousta. |

## Toteutetut korjaukset
- Tietosuojainventaariossa näkyy kaikkien sopimusten, siirtojen ja poistojen keskeneräisyys sekä kuluttaja-Gmailin sopimusrajaus.
- Tarjouspohjan ALV-käsittely on ehdollinen ennen lähettämistä.
- Aiempi kontakti ei enää tarkoita automaattista markkinointikieltoa. Todettu kielto tarkoittaa estoa.
- Käsittelyrekisterissä on järjestelmäkohtainen tarkoitus, tiedot, roolirajaus, siirto-/alikäsittelijäpuutteet, säilytys, poisto, käyttöoikeudet ja näytön päivä.
- Tietosuojaselosteeseen valmisteltu erillinen muutosesitys; lähdesivu ei muutu tässä PR:ssä eikä tuotantoa julkaista. Tuotannon nykyistä versiota ei saatu verkkolukijalla varmennettua.
- Tilausvahvistukseen lisätty sopimusversiot, peruutus-/palautusyhteenveto ja toimittajan kirjallinen vahvistus.

## Jäljellä olevat esteet ja sulkemisnäyttö
| Este | Tarvittava näyttö | Vastuu |
| --- | --- | --- |
| Myyjän identiteetti/osoite/rekisterit | Tuore viranomaisote, jossa Y-tunnus kohdistuu myyjään; käytettävä laskutusosoite | Omistaja / viranomaislähde |
| Verotus | 2025/2026 liikevaihto, ALV-asema ja laskumerkintä; ennakkoperintä tai dokumentoitu maksajan pidätysmenettely | Omistaja / kirjanpito |
| Maksu | Vastaanottajan identiteetti, käytetty Revolut-tuote, tositteet, palautuspolku ja manuaalinen täsmäytys | Omistaja |
| Tietosuoja | Käytössä olevien tilien sopimus-/siirto-/alikäsittelijä- ja oikeustiedot, poistosuunnitelman vastuut; voimassaolon lähdevarmennus | Omistaja / tekninen ja juridinen tarkistus |
| Informointi | Täydellinen julkaisuversio ja vastaanottajakohtainen informoinnin tosite; ei takautuvaa kirjausta | Myyntioperaatiot |
| Demot | Linkin voimassaolo ja oikea yritys, asiakkaan avaus, mobiili/desktop ja CTA/navigaatio; ei salaisia linkkejä julkisiin dokumentteihin | Tekninen QA |
| Etä-CI | Uuden commitin GitHub-checkit ja Vercelin build; paikallinen PASS ei korvaa etätilaa | Tekninen QA |

## Ensimmäisen kiinnostuksen käytännön käsittely
1. Täsmäytä vastaus yritykseen ja alkuperäiseen Message-ID:hen; tarkista kielto ja valtuus.
2. Valitse vain kyseisen yrityksen yksityinen demo; varmista pääsy ja aineistot.
3. Täytä tarjousnumero, ostaja, sivut, aineistot, aikataulu, ehdot ja verokohtelu.
4. Tuo vastaus ja tarjous käyttäjän hyväksyttäväksi. Älä lähetä itsenäisesti.
5. Asiakkaan valtuutetun hyväksyntä ja toimittajan kirjallinen vahvistus arkistoidaan. Vasta suljettujen esteiden ja erillisen maksuluvan jälkeen voidaan pyytää sovittu ennakko.
6. CRM VOITETTU vasta hyväksytyn sopimuksen ja tositteellisesti täsmäytetyn maksun jälkeen; asiakkaan kuvakaappaus yksin ei riitä.

Uutta varmennettua prospektierää ei tässä tarkistuksessa muodostettu. Vanhaa erää ei lähetetty uudelleen eikä muistutuksia ajastettu. CRM:n seurantarivit vastaavat tarkistetuilta toimitus- ja vastauskentiltään uutta havaintoa; niiden vanhaa tarkistusleimaa ei muutettu uudeksi ilman kirjausta.

## Lähteet ja rajaukset
- GitHub PR #12 ja PR #9 sekä yllä mainitut commitit: https://github.com/Jambovisuaalit/putkikasvu/pull/12 ja https://github.com/Jambovisuaalit/putkikasvu/pull/9 .
- CRM: käyttäjän yksilöimä taulukko, välilehdet ja 10 seurantariviä luettu 23.10.2026.
- Resendin tuore lähetyslista ja Gmailin lähettäjä-/aihehaut 23.10.2026; ei avaus- tai klikkausnäyttöä.
- Vercel: projekti, kolmen demon metadata, HTTP-vastaukset ja anonyymin selaimen DOM 23.10.2026.
- PRH https://avoindata.prh.fi/faq.html/info/swagger-ui : toiminimiyrittäjät eivät kuulu API:n tietosisältöön.
- Verohallinnon ohje https://www.vero.fi/syventavat-vero-ohjeet/ohje-hakusivu/48658/arvonlisaveroton-vahainen-toiminta/ luettu; verkkolähde, ei MCP-varmennettu oikeustila eikä myyjän verostatuksen vahvistus.
- Lähdevarmennus epäonnistui – en voi vahvistaa oikeustilaa. Virhekoodi REQUIRED_VERIFIER_TOOL_UNAVAILABLE. Lakimies AI -ohjeen vaatimat ajallisuuden varmennustyökalut eivät ole istunnossa saatavilla. Voimassaoloa ei voitu varmentaa.

## Tilausvahvistuksen tarkistettu luonnos
# Putkikasvu Standard — kirjallisen tilausvahvistuksen malli
Päiväys 22.10.2026. **SISÄINEN LUONNOS — EI LÄHETETTY, EI SOPIMUSTA, EI LASKUA.**
 
Tilaaja: [yrityksen virallinen nimi, Y-tunnus, yhteyshenkilö, laskutustiedot]
Palveluntarjoaja: [vahvistettava virallinen yritysidentiteetti ja laskutusosoite]
Yhteys: jami@putkikasvu.fi
Viite: Putkikasvu Standard – [asiakasyritys]

## Sovittu toimitus
Enintään kolme sivua, mobiilioptimoitu, selkeä sähköpostiin/puhelimeen johtava yhteydenotto, SEO-perusasetukset ja yksi sovittu korjauskierros. Demoluonnos esitellään ennen ostopäätöstä. Todennettavat palvelut ja toimialue sovitaan kirjallisesti.
Ei sisällä verkkotunnusta, sähköpostilaatikkoa, jatkuvaa ylläpitoa, mainontaa tai liiditakuuta. Asiakkaan omistama domain ja hosting erikseen.

## Hinta ja maksuerät
**Yhteensä 590 euroa [ALV-käsittely vahvistetaan ennen sopimusta ja laskua].**
1. 295 € kirjallisen tilauksen jälkeen; erä ja mahdollinen ennakonpidätysmenettely täsmennetään ennen maksua.
2. 295 € asiakkaan nimenomaisen kirjallisen hyväksynnän jälkeen **ennen julkaisua**.

Maksu tapahtuu vasta, kun palveluntarjoajan tiedot, ALV-laskumerkintä, asiakkaan mahdollinen ennakonpidätys ja todennettava maksuväline sekä maksukuitti ovat valmiit. Revolut-linkkiä ei lähetetä automaattisesti.

## Hyväksyntä- ja työprosessi
- Tilaaja vahvistaa kirjallisesti lopullisen sisällön, toimituslaajuuden ja toimitusaikataulun.
- Esikatselun tavoite v1.2 ehtojen mukaan 5 arkipäivää edellytysten täyttymisestä; julkaisutavoite 2 arkipäivää loppuhyväksynnän jälkeen, kun maksuehdot ja muut edellytykset täyttyvät. Nämä ovat tavoitteita, ellei toimituspäiviä vahvisteta erikseen.
- Asiakkaan materiaaleihin ja henkilötietoihin sovitaan käyttöoikeus ja tarvittaessa DPA.
- Peruutus, keskeytys, tekijänoikeudet ja lisätyö noudattavat **Putkikasvu Standard v1.2** -ehtoja, jotka toimitetaan asiakkaalle ennen hyväksyntää.

## Kirjallinen hyväksyntä (ei vielä tehty)
[ ] Hyväksymme hinnan, laajuuden, ehdot ja aikataulun.
Asiakkaan valtuutetun henkilön nimi ja asema: [ ]
Hyväksymispäivä: [ ]
Kirjallisen hyväksynnän tunniste: [ ]

## Maksun todennus ennen VOITETTU-tilaa
- [ ] Lopullinen yritysidentiteetti, ALV-status ja ennakonpidätys on varmistettu.
- [ ] Maksun viite/ID, maksumäärä, maksaja, vastaanottaja, päivä ja mahdollinen pidätys kirjattu.
- [ ] Maksupalvelun vahvistus + tili-/tositenäyttö saatu (ei asiakkaan kuvakaappaus yksin).
- [ ] CRM-tila VOITETTU vain hyväksytyn tilauksen ja vahvistetun maksutapahtuman jälkeen.

Älä lähetä tätä asiakasviestinä ilman käyttäjän hyväksyntää.

## Täytettävät ehdot ja molempien osapuolten vahvistus
Sopimustunnus [ ], sivut [ ], aineistot ja oikeudet [ ], tavoitepäivät ja alkuehdot [ ], eräpäivät [ ], domain-/hostingvastuu [ ]. Asiakkaalle toimitetaan ennen hyväksyntää muuttumattomat Standard v1.2 -ehdot: lähde `app/ehdot/page.jsx`, pohja `docs/legal/OFFER_AND_ACCEPTANCE_TEMPLATE.md`, omistajan sisältöhyväksyntä `docs/legal/WRITTEN_APPROVAL_PACKAGE.md`. Pelkkä muuttuva verkkolinkki ei ole arkistoitu ehtoversio.

Hyväksyttyjen v1.2-tekstiehtojen mukaan ennen työn aloitusta ennakko palautetaan kokonaan, ellei asiakkaan etukäteen hyväksymiä peruuttamattomia ulkoisia kuluja ole. Aloituksen jälkeisessä asiakkaan keskeytyksessä todennettava työ 90 €/h ja hyväksytyt peruuttamattomat kulut, Standardin osalta enintään 590 €; maksettu ennakko hyvitetään. Vahvistettu palautussumma palautetaan 14 kalenteripäivässä. Sopimusrikkomusta koskevat oikeudet säilyvät ehtojen mukaan. Tämä on aiemmin hyväksytyn tekstin yhteenveto, ei uusi oikeustilan varmennus.

Asiakas: hyväksyntäviesti [ ], valtuus [ ], päivä [ ], tarjous- ja liiteversiot [ ].
Palveluntarjoaja: vahvistan yksilöidyn tilauksen, hinnan, ehdot ja aikataulun; nimi [ ], päivä [ ], vahvistusviestin tunniste [ ]. Ei hyväksyntää hiljaisuudesta.

Jos ennakonpidätys soveltuu, maksuerän täsmäytykseen merkitään sovittu bruttomäärä, soveltuva veron peruste, pidätys, myyjälle maksettu netto ja maksajan tosite. Veroprosenttia tai laskumerkintää ei täytetä oletuksella.

## GitHub-viennin tietosuojatarkistus
Repositorio varmennettiin julkiseksi. Uudesta raportista poistettiin myyjän nimen ja Y-tunnuksen tarpeeton toisto; yksityisiä perustamispapereita, henkilötunnuksia tai access-linkkejä ei lisätty. Ensimmäinen push estettiin automaattisessa riskitarkistuksessa; tämä paikallinen versio vähentää tietosisältöä ennen mahdollista vientiä.

## Omistajan täsmennys 23.10.2026 — statusmuutos

Omistaja vahvistaa: myyjä **ei ole ALV-velvollinen**, vuotuinen liikevaihto on **alle 20 000 €**, Verohallinnon **perusilmoitus on tehty**, ja käytössä oleva **Revolut Pro -maksulinkki toimii**. Tämä **päivittää** raportin alkuosan historiallisia puutemerkintöjä, joissa ilmoitus ja toimiva maksulinkki kuvattiin puuttuviksi. Omistajan ilmoitus ei ole sama kuin tuore viranomaisote tai maksutapahtuman testitosite.

Jäljelle jäävä rajattu varmennus: ALV-rajan soveltaminen edelliseen ja kuluvaan kalenterivuoteen sekä rekisteriasema; ennakkoperintärekisterin merkintä tai asiakkaan ennakonpidätyskäytäntö; myyjän virallinen laskutusosoite; Revolut Pro -maksun saajan, tositteen ja palautuspolun näkyvyys. Demojen asiakaskohtainen linkki-/mobiili-QA on edelleen erillinen avoin työ. Ei maksua tai lähetystä tämän kirjauksen perusteella.

## Myynnin ja maksun erottaminen — omistajan päätös 23.10.2026

**Ennakkoperintärekisterihakemus tehdään viikonlopun 24.–25.10.2026 aikana (omistajan ilmoitus, ei vielä toteutuneeksi vahvistettu).** Hakemuksen vireillepano tai rekisterimerkinnän odottaminen **ei ole myyntikiellon eikä tarjousten tekemisen ehto**. Verohallinnon ohje vahvistaa, ettei ennakkoperintärekisteriin kuuluminen ole pakollista ja että rekisteriin kuulumaton henkilö voi toimia toimeksiantosuhteessa: https://www.vero.fi/syventavat-vero-ohjeet/ohje-hakusivu/47881/ennakkoperintarekisteroinnin-vaikutukset-yritystoimintaan5/ .

**Toimintojen erottelu:**
- **GO / myyntityö:** jatka prospektitutkimusta ja sallittua asiakashankintaa, demoesittelyitä, asiakasneuvotteluita sekä tarjousten ja tilausluonnosten valmistelua. Noudatetaan erillisiä markkinoinnin, henkilötietojen ja käyttäjän lähetyshyväksyntärajoja.
- **GO / sopiminen ehdollisesti:** toimeksiantosopimusta ei sinänsä estä ennakkoperintärekisterin puute. Oikea sopimusosapuoli, tuotteen ehdot ja verokohtelu varmistetaan ennen sitovaa hyväksyntää.
- **MAKSUN EHTO:** jos myyjä ei maksupäivänä ole rekisterissä, ostajayrityksen tulee yleensä toimittaa työkorvauksesta ennakonpidätys. Yksityinen elinkeinonharjoittaja antaa työkorvauksen verokortin; ilman sitä pidätys on yleensä 60 %. Sopimuksen bruttomäärä 590 € ja maksuerien bruttomäärät 295 € eivät muutu; myyjälle maksettu netto ja Verohallinnolle tilitetty pidätys dokumentoidaan erikseen. Revolut Pro -linkkiä ei käytetä veloittamaan automaattisesti täyttä 295 €:a, jos maksajan on tehtävä pidätys. Lähde: https://www.vero.fi/yritykset-ja-yhteisot/yritystoiminta/verohallinnon-rekisterit/ennakkoperintarekisteri/ .
- **HALLINNOLLINEN TEHTÄVÄ:** tee hakemus viikonloppuna ja tarkista sen vastaanotto sekä myöhempi rekisterimerkintä. Ei viivästytetä myyntityötä tämän takia.

**Rajaus:** Tämä päivitys ei ole lupa lähettää uusia myyntiviestejä, julkaista demoja tuotantoon, aktivoida maksamista tai yhdistää PR:ää. Aiempien hyväksyntäpaketin P0-merkintöjen tulkinta tulee päivittää niin, etteivät ne väitä rekisteröinnin puuttumisen estävän kaikkia tarjouksia tai neuvotteluita.
