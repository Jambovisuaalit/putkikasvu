# Putkikasvu – ensimmäisen asiakaspilotin operatiivinen toimintamalli
Päivitetty 22.10.2026. Tila: **VALMISTELU SALLITTU – TILAUSTEN JA MAKSUJEN VASTAANOTTO EI VIELÄ**.

## Tarkoitus
Myytävä Standard on 590 €: enintään 3 sivua (etusivu, palvelut, yhteystiedot), yksi koottu korjauskierros, perus-SEO ja yksi sovittu julkaisu. Maksuerät **295 € + 295 €** vain kirjallisesti hyväksytyssä tilausprosessissa. Valinnainen 29 €/kk ylläpito ei kuulu automaattisesti kauppaan. Työnkulku ei tarvitse Supabasea, uutta palvelua, maksettua mainontaa tai Resend-domainin aktivointia.

## Jatka jo nyt, ilman vahvaa tunnistautumista
1. **Prospektit:** käytä olemassa olevaa 30 yrityksen CRM-tutkimusta (käyttäjän Library). Sen tietoja ei kopioida julkiseen GitHubiin eikä pidetä kaikkia 30 yritystä varmennettuina ongelmatapauksina. Neljä ensisijaista lähdeperustaista demokohdetta ovat N.Karlsson LVI, Lvi-Upp, JH-Putki ja ION-putki. Yrityksen tiedot ja myyntihavainto varmistetaan uudelleen juuri ennen mahdollista yhteydenottoa.
2. **Demo:** käytä vain hyväksytyistä/luotettavista yritysfaktoista rakennettua luonnosta, merkitse se “LUONNOS – ei yrityksen virallinen sivu”, älä käytä logoa, asiakaskuvaa tai referenssiä ilman oikeutta, älä aktivoi yhteydenottolinkkejä, älä julkaise julkista jakolinkkiä ilman suojausta/hyväksyntää.
3. **Ajankäytön mittaus:** kirjaa tutkimus, JSON/data, kirjoitus, tekniikka, mobiili-QA ja hyväksyntä erillisiksi vaiheiksi. Aiempi tekninen Lvi-Upp-testiajo **12,558 s** ei todista koko ihmistyön ≤30 min tavoitetta.
4. **Yhteydenotto:** sivusto käyttää vain `mailto:visualjambo@gmail.com`. Jo suoritettu Gmailista samaan Gmailiin -testi vahvisti sähköpostin saapumisen; oikealta ulkopuoliselta mobiililaitteelta tehty CTA→asiakasposti→saapuminen-testi edelleen tekemättä. Ei automatisoituja kampanjoita tai yrityskontakteja tämän työn pohjalta.
5. **Tarjous:** luonnostele yksilöity kirjallinen tarjous `docs/legal/OFFER_AND_ACCEPTANCE_TEMPLATE.md` pohjalta; ÄLÄ lähetä juridisesti sitovaa tilaustarjousta ennen kohtien P0 hyväksyntää.

## P0 – estä kaupallinen tilaus ja ennakkolinkki kunnes
- [ ] Ennakkoperintärekisteri voimassa tai työkorvauksen ennakonpidätys ostajalle asianmukaisesti järjestetty. **Y6-paperihakemus on käyttäjän suunnitelman mukaan tarkoitus lähettää 23.10.2026; sitä ei ole merkitty jätetyksi eikä hyväksytyksi.**
- [ ] Myyjän todellinen kauppanimi / allekirjoittajan nimi / maantieteellinen yritysosoite vahvistettu eikä yksityiseksi tarkoitettua osoitetta lisätä julkiseen GitHubiin.
- [ ] ALV:n vähäisen toiminnan ehdot 2025 ja 2026, laskun oikea veromerkintä vahvistettu.
- [ ] Sopimusehtojen peruutus, keskeytyksen 90 €/h, 14 päivän palautuksen määräpäätös, lähdekoodin käyttö-/luovutusoikeudet ja ylläpidon 29 €/kk erilliset ehdot hyväksytty omistajan kirjallisena päätöksenä (`docs/legal/WRITTEN_APPROVAL_PACKAGE.md`).
- [ ] Todellinen Gmail/Vercel-tietosuoja- ja säilytyskäytäntö dokumentoitu ja perusteltu; tarvittavat DPA-velvoitteet ratkaistu.
- [ ] Maksutapa varmennettu yksittäisen tilauksen tasolla oikeassa Revolut Pro -näkymässä, maksunsaajan tiedot tarkistettu, eikä samaa tositetta voi käyttää kahdelle tilaukselle.
- [ ] Erillinen **GO: ensimmäisen asiakkaan tilaus- ja maksuprosessi** hyväksytty kirjallisesti.

## Myöhempi ensimmäisen asiakkaan toimitus – ei vielä aktivoitu
| Vaihe | Omistaja/toimenpide | Todiste |
| --- | --- | --- |
| 01 Esite ja keskustelu | Jami tarjoaa demoa vasta varmennetuilla väitteillä | Asiakas ei ole tilannut |
| 02 Yksilöity tarjous | Jami, 590 € ja rajattu palvelu + ehdot tallennettavassa muodossa | Tarjousnumero / ehtoversio |
| 03 Kirjallinen hyväksyntä | Asiakkaan valtuutettu edustaja hyväksyy nimenomaisesti | Päiväys, yritys, hyväksytty versio |
| 04 Ennakkomaksu | 295 € vain hyväksytyllä menetelmällä | Oikea, yksilöity, varmennettu Pro-maksutapahtuma |
| 05 Materiaalit ja oikeudet | Kerää tarvittavat luvalliset aineistot yksityisesti | Materiaali-/kuvaoikeusrekisteri |
| 06 Toteutus ja QA | Standardin 3 sivua; mobiili/desktop/SEO | Rakennusversio, korjaukset |
| 07 Hyväksyntä | Asiakas hyväksyy tarkan julkaisuvalmiin version kirjallisesti | Hyväksyntätodiste |
| 08 Loppuerä | Uusi 295 € vain hyväksynnän jälkeen | Erillinen varmennettu tapahtuma |
| 09 Julkaisu ja luovutus | Oma domain/hosting, HTTPS, sovittu luovutus | Pääsynhallinta ja asiakasvahvistus |
| 10 Kulujen kirjaus | Mittaa täydellinen toimitus sisältäen myynnin/viestinnän | Toteutuneet työtunnit ja kulut |

## CRM-kentät (yksityiseen työkalenteriin / CRM:ään, ei julkiseen repon dataan)
`prospect_id, company, business_id, city, staff_year, page_url, public_contact_source, issue_verified_on, issue_evidence_url, consent_to_use_images, draft_status, demo_seconds_total, outreach_allowed_review, stage, last_contact_at, opt_out_at, notes`.
Kaikilla aloitetuilla riveillä `stage=Ei kontaktoitu`; yksittäisten henkilöiden tietoja ei kerätä tarpeettomasti. Ajantasainen ulkoinen vastaanottotesti ja lainmukainen suoramarkkinointi tarkistetaan ennen lähettämistä.

## STOP
Älä yhdistä PR #5:n, #8:n tai #9:n kokeilurajapintoja maksujärjestelmään, älä poista Vercel SSO:ta, älä muuta Zonerin DNS:ää, älä lähetä viestejä, älä aktivoi nykyistä 295 € maksulinkkiä ilman erillistä hyväksyntää.


## Myyntiprosessin päätös 22.10.2026 — täysin asynkroninen
Omistajan nimenomainen linjaus: **ei demopalaveria, myyntipuhelua eikä ajanvarausta**. Asiakas voi ostaa verkkosivuston kirjallisesti ilman keskustelua puhelimessa.

1. Kylmäviesti: yksi todennettu yrityskohtainen havainto, palvelun rajaus ja kiinteä 590 € hinta. CTA: **Vastaa ”Haluan nähdä ehdotuksen”** tai **”Haluan tilata”**. Ei puhelupyyntöä.
2. Demo: tarvittaessa suojattu, itsenäisesti katsottava LUONNOS; ei julkista linkkiä tai luvattomia asiakasaineistoja. Vaihtoehtoisesti yksinkertainen tekstipohjainen esittely.
3. Tarjous: yksilöity kirjallinen tarjous ja tallennettavat v1.2 ehdot. Asiakkaan valtuutettu edustaja hyväksyy kirjallisesti; myyjä vahvistaa tilauksen kirjallisesti. Ei hiljaista hyväksyntää.
4. Materiaalit: yritystiedot, palvelut, toimialue, puhelin/sähköposti, domain/hosting sekä kuvien oikeudet kerätään sähköpostitse tai hyväksytyllä turvallisella kanavalla. Ei pakollista puhelua.
5. Maksu ja julkaisu: **erilliset portit pysyvät**. Rekisteritilanne, ennakonpidätys ja ALV tarkistetaan ennen maksua; asiakkaan kirjallinen julkaisuvalmiuden hyväksyntä ennen loppumaksua. Tuotantojulkaisu vain erillisellä GO:lla.
6. Viestien lähetys: aiempi lupa koskee enintään 10 tarkastettua henkilökohtaista B2B-viestiä, mutta omistajan myöhempi ohje **tehdä tarkastukset ennen lähettämistä** estää lähetyksen ennen kampanjan lopputarkistusta.

**Poistetaan kaikista uusista kampanjamateriaaleista:** ”sovitaan puhelu”, ”10 minuutin demopalaveri”, ajanvarauslinkki ja ”voinko soittaa”.
