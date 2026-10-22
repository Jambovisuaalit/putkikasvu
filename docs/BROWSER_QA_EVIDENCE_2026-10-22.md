# Putkikasvu – staattisen julkaisuehdokkaan selain-QA

Päiväys: 22.10.2026  
Kohde: PR #4, `release/brand-a11y-static`  
Testaus: oikea Chromium GitHub Actions -ympäristössä, julkaisuehdokkaan Next.js `out/`-viennistä palveltuna paikallisen HTTP-palvelimen kautta.

## Tulokset

| Kohta | Tulos | Todiste |
| --- | --- | --- |
| Etusivu 375, 390, 768, 1440 px | PASS | Chromium + neljä kokoruutukuvaa |
| /ehdot ja /tietosuoja samoilla leveyksillä | PASS | 8 kuvakaappausta |
| Logon/P-symbolin PNG-lataus ja alt-tunnisteet | PASS | Browser `naturalWidth` + kuvakaappaukset |
| Manrope ja Inter | PASS | CSS computed font-family |
| Navigaation ankkurit ja CTA-mailto | PASS | Browser-käyttäytyminen ja osoitteen tarkistus |
| FAQ Enter-näppäimellä | PASS | Natiivi details/summary avautuu |
| Skip-link Tab + Enter ja main-kohde | PASS | Browser-fokus- ja hash-tarkistus |
| Vaakasuuntainen ylivuoto | PASS | Browser `scrollWidth <= clientWidth + 2` |
| 200 % reflow-proxy | PASS | 768→384 px ja 1440→720 px browser-layout |
| 404-vientitiedosto, noindex ja ei lomaketta/checkoutia | PASS | Browser- ja staattinen tarkistus |
| GitHub Actions Chromium | **20/20 PASS** | [Run 39701272171](https://github.com/Jambovisuaalit/putkikasvu/actions/runs/39701272171) |
| Kuvakaappausaineisto | 14 PNG-kuvaa | [Artifact 12392343421](https://github.com/Jambovisuaalit/putkikasvu/actions/runs/39701272171/artifacts/12392343421) |
| Julkaisu-/regressiobuild | PASS | Static release checks for same commit |

## Visuaalinen katselmointi

Koko sivun kuvakaappauksista tarkistettu etusivun 375/390/768/1440 px asettelut, termisivu 390 px ja 384 px reflow. Ei havaittu päällekkäisiä elementtejä tai katkenneita pääsisältöjä. Logo näkyy kaikissa tarkastetuissa versioissa.

## Rajaukset ja jäljellä olevat tarkistukset

- Näitä testejä ei suoritettu kirjautuneessa Vercel-istunnossa. Vercel SSO on erikseen edelleen käytössä; mitään bypassia ei tehty.
- CSS-layoutin pienentynyt viewport (esimerkiksi 768→384 px) on 200 % **reflow-vastine**, ei selaimen käyttöliittymän aito zoom-toiminto.
- Näppäimistökäytön automaattiset väitteet koskevat testattuja skip-linkkiä ja FAQ:ta; tämä ei ole täydellinen manuaalinen WCAG 2.2 AA -auditointi.
- Vercelin kytketty `main`-julkaisu ja Zonerin `putkikasvu.fi` on käsiteltävä erikseen. Älä liitä tuotantodomainia automaattisesti.
- Juridiikan viimeistely, todellinen liidien vastaanottotesti ja Revolut-tapahtuman varmennus ovat erillisiä myyntivalmiuden hyväksyntäesteitä.

## Johtopäätös

Staattisen PR #4 -julkaisuehdokkaan selaimella todennettavat tekniset hyväksyntäehdot **PASS** rajatussa testilaajuudessa. Ei todettu avoimia P0/P1-löydöksiä tässä testilaajuudessa. Tämä ei sellaisenaan ole koko palvelun kaupallinen käyttöönottolupa.
