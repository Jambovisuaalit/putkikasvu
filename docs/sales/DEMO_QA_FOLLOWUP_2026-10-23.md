# Putkikasvu – kolmen demon katselu- ja mobiili-QA (23.10.2026)
Tila: **OSITTAIN VALMIS / ASIAKKAAN KATSELUTESTI AVOIN**. Tämä tarkistus ei anna julkaisu- tai lähetyslupaa.

## Vercel-tarkistus
- Lvi-Upp: deployment READY; Vercelin valtuutettu hakutyökalu palautti juuriosoitteesta HTTP 200, otsikko `Lvi-Upp Oy | LVI-sivuluonnos`.
- LVI MIKKI: deployment READY; juuriosoitteesta HTTP 200, otsikko `LVI MIKKI Ky | LVI-sivuluonnos`.
- Ursu LVI: deployment READY; juuriosoitteesta HTTP 200, otsikko `Ursu LVI Oy | LVI-sivuluonnos`.
- Kaikissa juurisivuissa `robots: noindex, nofollow` sekä palvelut-, alue- ja yhteysankkurit.
- Edellä olevat 200-vastaukset ovat **valtuutettuja Vercel-lukuja**, eivät testiä ilman tunnuksia asiakkaan selaimessa.
- Linkit sisältävät käyttöoikeusohitteen, eikä niitä kirjata julkiseen repositorioon. Vanhojen linkkien voimassaoloa ei pidä olettaa. Jakolinkkien tuottaminen tai uudelleenkäyttö ei todista asiakasavausta.
- Virheellinen `/demot/lvi-upp/`-polku palautti 404 yhdestä erillisestä deploymentista; juuripolku palautti 200. **Käytä yrityskohtaisen deploymentin juuriosoitetta**; älä vaihda juuripolkua demoarkiston vientipolkuun.

## Tuore paikallinen Chromium-QA
Kirjaston `Putkikasvu_pilottidemot_2026-10-22.zip` -arkistoidut staattiset `demot/<slug>/index.html`-sivut renderöitiin Chromiumilla Playwrightissa. HTML avattiin `page.set_content`-menetelmällä paikalliseen testiympäristöön ja arkiston CSS liitettiin data-URL:na; **ei live-deploymentin selaintesti**. Neljä viewporttia per demo: 375, 390, 768 ja 1440 px.

Tulokset: **12/12** tarkistusta ilman dokumentin vaakaylivuotoa, puuttuvaa sisäistä ankkurikohdetta tai raportoituja JS `pageerror`-virheitä. Kussakin demossa löytyi kolme navigaatiolinkkiä. `mailto:`- ja `tel:`-linkkejä 0: nämä ovat tarkoituksellisesti julkaisemattomia sivuluonnoksia, eikä demojen yhteydenottoa pidä esittää tuotannossa toimivana.

Kuvakaappaukset ja JSON-QA tallentuivat vain tilapäiseen työtilaan; julkiseen repositorioon ei tallennettu salaisia asiakaslinkkejä eikä kuvatiedostoja.

## Ennen asiakkaalle jakamista
- [ ] Asiakaskohtainen valtuutettu jakolinkki toimii ulkopuolisessa selaimessa ilman omistajan Vercel-istuntoa.
- [ ] Jakolinkin voimassaolo ja kohdeyritys varmistetaan juuri ennen esikatselua, erityisesti Ursu.
- [ ] Tarkistetaan linkin avaaminen oikealla mobiililaitteella/Safarilla (tai dokumentoidaan, jos fyysistä testiä ei voida tehdä).
- [ ] Sovitaan, näytetäänkö yhteystiedot vain tekstinä kunnes asiakas hyväksyy ne; demoissa ei ole toimivaa yhteydenottolähetystä.

Ei asiakasviestejä tai tuotantojulkaisua tässä tarkistuksessa.
