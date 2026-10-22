# Lvi-Upp Oy – oikean yrityksen paikallinen demotesti
Päiväys: 22.10.2026. **Vain sisäinen, hyväksymätön luonnos.** Ei markkinointiin tai asiakkaalle lähetykseen ilman erillistä tarkistusta.

## Lähdetiedot
- Yrityksen nimi: Lvi-Upp Oy; Y-tunnus 2911820-5; 1 työntekijä tilikaudella 2025 (sekundäärilähde).
- Toimialue: pääkaupunkiseutu ja tarpeen mukaan Uusimaa.
- Julkinen puhelin: 050 595 5118, yrityssähköposti info@lviupp.fi.
- Palvelut: putkityöt pienistä huolloista suurempiin projekteihin, uudis-/saneeraus- ja huoltotyöt. Sisällöt rajattu yrityksen itsensä kuvaamiin palveluihin.
- Ei kuvia, asiakasarvioita, sertifikaatteja, referenssejä, päivystys- tai vasteaikalupauksia ilman omistajan vahvistusta.
- Lähteet: https://www.lviupp.fi/ ; https://www.lviupp.fi/palvelut/ ; https://www.asiakastieto.fi/yritykset/fi/lvi-upp-oy/29118205/rekisteritiedot .

## Toteutunut automaattinen QA
- GitHub Actions: https://github.com/Jambovisuaalit/putkikasvu/actions/runs/39704853344 – **PASS**
- QA-artifact: https://github.com/Jambovisuaalit/putkikasvu/actions/runs/39704853344/artifacts/12395055218
- Generointi, Next.js-export, HTML-tarkastukset ja oikean Chromium-selaimen neljä viewport-testiä yhteensä **12.558 sekuntia** CI-ympäristössä.
- Viewportit 375 / 390 / 768 / 1440 px: **4/4 PASS**. Kuvakaappaukset tallennettu.
- LUONNOS/noindex-näyttö näkyy; ei oikeaa sähköpostin/puhelun aloittavaa linkkiä, lomaketta eikä kassaa. Ei julkista demodeploymentia.
- 0 hyväksyttyä kuvaa -> tarkoituksellinen graafinen havainne.

## Mittauksen rajat
- **Ei asiakkaan tilaama eikä hyväksymä demo.**
- Yritystietojen lähdehaku, sisällön ihmistarkastus, kuvaluvat ja asiakaspalautteet eivät sisälly 12.558 s tekniseen ajoaikaan.
- Ensimmäisen täysin valmistellun, tarkastetun ja hyväksytyn demon 30 min kokonaistavoite on edelleen **todentamatta**.
- Aineisto on vain julkisista yrityslähteistä, GitHubin `.demo-output`-hakemistoa ei julkaista eikä sitä lähetetä asiakkaalle.

## Seuraava GO-portti
Sovi ensimmäisen oikean myyntipilotin kohde. Vahvista yrityksen nykyiset faktat ja mahdolliset kuva-/logoluvat, mittaa koko 30 minuutin työn alusta loppuun, suorita visuaalinen QA ja hyväksytä sisältö ennen demon yksilöllistä jakamista.
