# Putkikasvu – tehtävien 3–5 yhteinen hyväksyntärekisteri

Päiväys 22.10.2026. Tila: **TEKNINEN MYYNTIVERSIO / EI VIELÄ KAUPALLINEN GO**.

## 3. Tuotteistus
- [x] Enintään 3 sivua, hinta 590 €, kaksi 295 € erää, yksi koottu muutoskierros.
- [x] Esikatselu tavoite 5 arkipäivää aineistoista/ennakosta; julkaisu tavoite 2 arkipäivää hyväksynnästä/loppumaksusta kun infrastruktuuri valmis.
- [x] Domain ja hosting asiakkaan nimissä/erikseen; 29 €/kk ylläpito vain valinnainen.
- [ ] Vahvista 149 €/99 €/90 €/h lisätyöhinnat ja 29 €/kk sisällön/irtisanomisen lopullinen sopimus.
- [ ] Kirjaa ensimmäisen asiakkaan todelliset kulut ja työaika.

## 4. B2B/GDPR
- [x] Sopimus- ja tietosuojaluonnokset sekä käsittelysopimuksen luonnos nykyiseen samaan GitHub-haaraan.
- [x] Verohallinnon 20 000 € vähäisen toiminnan raja tarkistettu virallisesta lähteestä; kuluvan ja edellisen kalenterivuoden raja seurattava.
- [x] Virallinen YTJ tarkistettu selaimessa 22.10.2026: Y-tunnus 3581581-6, yksityinen elinkeinonharjoittaja, ainoa aktiivinen rekisteröinti Verohallinnon perustiedot.
- [ ] **P0 – ennakkoperintärekisteri ei näy**. Käyttäjä aikoo jättää paperisen Y6-ilmoituksen 23.10.2026 (suunniteltu, **ei vielä lähetetty**). Vahvista aikanaan saapuminen sekä voimaantulo YTJ:ssä, tai järjestä asiakkaan lakisääteinen ennakonpidätys. Ei normaalia 295 € + 295 € B2B-laskutusta ennen asian ratkaisua.
- [ ] ALV-rekisterimerkintää ei näy, mutta vahvista vähäisen toiminnan 20 000 € raja 2025 ja 2026 toteutuneesta liikevaihdosta.
- [ ] Vahvista toiminimen rekisterissä näkyvä virallinen nimi/osoite muusta luotettavasta lähteestä ennen tilausta; YTJ ei julkisesti näytä niitä.
- [ ] Hyväksy sopimuksen peruutusehdot, keskeytyksen 90 €/h enimmäisrajauksineen, käyttö-/luovutusoikeudet sekä mahdollinen palautussääntö.
- [ ] Varmista Gmail/Vercel-sopimusten henkilötietojen käsittelyn roolit, DPA- ja ETA-siirtoehtojen tosiasialliset asetukset.
- [ ] Toteuta tietosuojaluonnoksen 12 kk / 3 v / 90 pv säilytys- ja poistokäytäntö sähköpostiin/projektikansioihin: dokumentointi ei ole toteutus.
- [ ] Tuotantoevästeet ja palvelimen lokit tarkistettava ennen mahdollisesti julkista markkinointijulkaisua.
- [ ] Hyväksy asiakastiedon käsittelyyn soveltuva GDPR 28 artiklan käsittelysopimus tarvittaessa asiakkaan kanssa.

## 5. Yhteydenotto
- [x] Keskitetty mailto-linkki visualjambo@gmail.com, UTF-8-esitäytetty aihe ja viesti; kuusi etusivun CTA:ta.
- [x] Näkyvä varapolku osoitteen kopioinnille; ei verkkopalvelimelle lähetettävää lomaketta.
- [x] Resend-kytkentä ei ole edellytys Gmail-vastaanotolle; putkikasvu.fi Resend on not_started.
- [x] Gmailissa on vahvistettu 22.10.2026 sisäinen lähetys ja vastaanotto samassa `visualjambo@gmail.com`-tilissä: testiviesti `QA-TESTI-20261022-CRO-01`, INBOX + SENT. Tämä ei todista ulkopuolisen lähettäjän tai mobiililaitteen mailto-ketjua.
- [ ] Testaa juuri tämän uuden esikatselun CTA mobiilin ulkoisella sähköpostisovelluksella (avaa luonnoksen, käyttäjä lähettää). Chromiumin mailto-klikkitesti kattaa vain selaimessa laukeavan linkin, ei iOS/Androidin omaa mail handleria; katso `docs/ops/CONTACT_BROWSER_TEST_SCOPE.md`.
- [ ] Varmista oikean ulkopuolisen käyttäjän vastaanottotesti ja käsittelyprosessi; älä lähetä kampanjaa.
- [x] Ensimmäisen asiakaspilotin käsin tarkastettava GO/NO-GO-työjärjestys: `docs/ops/FIRST_CUSTOMER_PILOT_RUNBOOK.md`. Ei hyväksymislupaa.

## Rakenteellinen turvallisuus
- Vercel Authentication pysyy käytössä.
- Ei Revolut checkout -linkkiä sivulle.
- Ei Supabasea, Resend API:ta, backend-reittejä, lähetyksiä tai asiakastietojen tallennusta.
- Zonerin DNS ja putkikasvu.fi jätetään ennalleen.
- PR tätä varten: erillinen tarkistettava PR main-haaraan; ei automaattista main-mergeä.
## Viralliset lähteet
- https://www.vero.fi/yritykset-ja-yhteisot/verot-ja-maksut/arvonlisaverotus/rekisterointi/
- https://vero.fi/syventavat-vero-ohjeet/ohje-hakusivu/48658/arvonlisaveroton-vahainen-toiminta/
- https://www.finlex.fi/fi/lainsaadanto/1997/1336
- https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=fi
- https://tietopalvelu.ytj.fi/yritys/3581581-6
- https://www.vero.fi/yritykset-ja-yhteisot/yritystoiminta/verohallinnon-rekisterit/ennakkoperintarekisteri/


## 22.10.2026 — PR #9:n hyväksyntäpaketti
- [x] Omistajan kirjallinen ehtojen hyväksyntämalli: `docs/legal/WRITTEN_APPROVAL_PACKAGE.md`.
- [x] Asiakkaan tarjous-, tilaushyväksyntä- ja julkaisuvalmiuden nimenomaisen hyväksynnän malli: `docs/legal/OFFER_AND_ACCEPTANCE_TEMPLATE.md`.
- [x] Käsittely-/poistotodistuksen pohja ja käyttöönoton ohje: `docs/legal/DATA_FLOW_AND_RETENTION.md`.
- [x] DPA-luonnoksen alikäsittelijä-, ohje- ja allekirjoitusliitteet: `docs/legal/DPA_TEMPLATE.md`.
- [x] Ehtoihin maantieteellisen osoitteen pakollisuus ja tarjouksen tallennettavuus; tietosuojaselosteeseen nykyisten palveluiden ja vahvistamattomien siirtojen ero.
- [ ] **Ei kuitattu:** virallinen maantieteellinen osoite, ennakkoperintä ja ALV-tiedot, omistajan 90 €/h/peruutus/lisenssipäätös, tosiasialliset Google/Vercel DPA- ja siirtotiedot, säilytys-/poistotestit, tuotantoevästeet, tarvittaessa asiakkaan DPA, maksun manuaalinen vastaanotto ja mobiili-QA.
- [ ] **Ei tehty:** merge, myynnin/kassan avaus, DNS-/backend-/maksujärjestelyjen muutos.

**Päätösjärjestys:** omistaja hyväksyy sisältöehdot kirjallisesti → P0-faktat ja tietosuojan ajantasaiset tiedot varmennetaan → vasta sen jälkeen kaupallisen tilaamisen erillinen GO → maksun ja julkaisun erilliset hyväksynnät.
