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
- [ ] **P0 – ennakkoperintärekisteri ei näy**. Hae merkintää OmaVerossa tai varmista työkorvauksen ennakonpidätys yritysasiakkaalle. Ei normaalia 295 € + 295 € B2B-laskutusta ennen asian ratkaisua.
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
- [x] Gmailissa aiemmin havaittu vastaanotettu Putkikasvu-aiheinen testiviesti (ei tässä muutoksessa lähetetty).
- [ ] Testaa juuri tämän uuden esikatselun CTA mobiilin ulkoisella sähköpostisovelluksella (avaat luonnoksen, käyttäjä lähettää).
- [ ] Varmista oikean ulkopuolisen käyttäjän vastaanottotesti ja käsittelyprosessi; älä lähetä kampanjaa.

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
