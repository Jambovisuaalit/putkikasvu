# Putkikasvu — kolmen yksityisen demon tarkistus 22.10.2026

Tila: **ARKISTON SISÄLTÖ TODETTU / TUORE ETÄSELAINTARKISTUS JA FYYSINEN SAFARI-TESTI AVOIN**.

Lähde: käyttäjän ChatGPT Libraryyn tallennettu `Putkikasvu_pilottidemot_2026-10-22.zip` (sisäinen, ei julkinen). ZIP avattiin ja tiedostoluettelo sekä kolme demo-HTML:ää tarkistettiin 22.10.2026.

## Löydökset
- lvi-upp.html, lvi-mikki.html, ursu-lvi.html ovat olemassa; jokaiselle löytyy myös Next-export `demot/{slug}/index.html`, yritysasetusten JSON ja 390/1440 px esikatselukuvat.
- Kaikissa kolmessa renderöidyssä Next-export-HTML:ssä on luonnos/demo-merkintä; ei Lorem ipsum -tekstiosumaa.
- Arkisto sisältää `QA-2026-10-22/demo-qa.json`: 3 × 4 tarkkuutta 375/390/768/1440 px kirjattu PASS; aiempaa Chromium-emulointia, ei tämän työn uutta selainajoa eikä fyysistä Safari-testausta.
- `QA-2026-10-22/katselun-lopputarkistus.json`: aiempi Vercel-share-katselu kolmeen demoon kirjattu HTTP 200, anonyymi pyyntö kirjattu Login – Vercel, noindex ja private no-store; **tämän työn tuoreita HTTP-200-tarkistuksia ei suoritettu**.
- ZIP sisältää katselutunnisteet sisältävän `private-share-links.json` -tiedoston. Älä julkaise tai kopioi tunnisteita julkisiin repoihin, CRM:n vapaasti jaettuihin linkkeihin tai myyntikirjeisiin ennen oikeuden ja vanhenemisen tarkistusta.
- Vercel-projektin SSO-suojaus kaikkiin deploymenteihin näkyi projektin nykyisessä metadatassa; se tukee käyttöoikeusrajausta, mutta linkin haltijalle myönnetty katseluoikeus pitää tarkistaa asiakaskohtaisesti.
 
## Toimet ennen asiakkaalle jakamista
1. Tarkista olemassa olevan deploymentin `READY`-tila, oikea yritys ja share-linkin voimassaolo juuri jakamishetkellä.
2. Varmista, että anonyymi käyttäjä ei pääse demoon ilman hyväksyttyä access linkkiä. Älä julkaise kaikkien yritysten yhteis-ZIP:iä.
3. Tee vähintään mobiili-Chromiumin tai mahdollisuuksien mukaan iPhone/Safarin tuore testi, CTA:t, ankkuroidut kohdat ja tekstin luettavuus.
4. Huolehdi siitä, että demojen sisältö on merkitty epäviralliseksi luonnokseksi ja niissä on vain vahvistettu yritystieto.

**Ei uutta deploymentia, julkaisemista tai myyntiviestin lähettämistä tämän tarkistuksen perusteella.**
