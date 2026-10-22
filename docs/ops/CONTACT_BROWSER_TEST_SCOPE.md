# Yhteydenoton laitekohtainen hyväksyntä – PR #9
22.10.2026 · Teknisen testin ja ulkoisen toimituksen erottelu.

### Olemassa olevat todisteet
- `tests/contact-flow.test.mjs`: 6 CTA:n vastaanottaja, UTF-8-koodattu aihe + tekstipohja, kopiointivaihtoehto, ei lomaketta eikä maksu-API:a.
- `scripts/browser-qa.mjs`: todellisessa Chromiumissa *paikallisen staattisen buildin* kautta CTA:ta klikataan ja mailto siirtyminen estetään testissä tarkoituksella; tarkistetaan vastaanottaja, aihe, esitäytetyt kentät sekä kopiointipainikkeen käyttäytyminen. Se ei avaa laitteen sähköpostiohjelmaa eikä lähetä viestiä.
- 22.10.2026: sisäinen Gmail→sama Gmail testi, tunnisteet `INBOX` ja `SENT` (viite QA-TESTI-20261022-CRO-01), ei ulkoinen liidi.
- Vercel on SSO-suojattu. Testit eivät todista Verceliin kirjautuneen puhelimen tai iOS:n mail-handlerin toimivuutta.

### Lopullinen laitekohtainen hyväksyntä (tehdään omistajan oikealla laitteella)
1. Avaa Vercelin suojattu PR #9 -esikatselu sillä puhelimella, jossa käytät sähköpostisovellusta.
2. Paina yhtä `Pyydä esimerkkisivu` -painiketta. Varmista, että luonnoksen vastaanottaja on `visualjambo@gmail.com` ja aihe `Putkikasvu | Esimerkkisivupyyntö`.
3. Lisää aiheriville `[LAITETESTI]` ja tekstin loppuun päiväys. Lähetä ainoastaan itselle, ei asiakkaalle.
4. Varmista Gmailin `INBOX`-kansiosta juuri tämä aihe/tunniste, lähettäjä ja viestin saapumisaika.
5. Jos sähköpostisovellusta ei ole asetettu, avaa varayhteystapa `#yhteys`, kopioi osoite ja lähetä samansisältöinen testi itse.
6. Kirjaa tulos `PASS/FAIL`, käytetty laite, selain, sähköpostisovellus ja tarkistuspäivä yksityiseen QA:han.

### Hyväksyntäraja
Koodin ja Chromiumin PASS ei yksin vastaa kohtaa 4. Tätä hyväksyntäkohtaa ei merkitä valmiiksi ennen oikeaa laitekohtaista testiä. Älä tee lupauksia 100 % toimitettavuudesta, koska mailto riippuu käyttäjän laiteasetuksista.
