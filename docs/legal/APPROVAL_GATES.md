# Putkikasvu — juridinen auditointi ja hyväksyntäesteet
**Päiväys:** 22.10.2026  
**Tila:** DRAFT / NOT APPROVED FOR CUSTOMER ORDERS OR PAYMENTS  
**Kohde:** `app/ehdot/page.jsx` ja `app/tietosuoja/page.jsx`; staattinen release-haara `release/brand-a11y-static`.

## Todennetut lähtötiedot
- Myyjä ilmoitettu: **Tmi Jami Harju**, **Y-tunnus 3581581-6** (ei itsenäisesti varmennettu YTJ:stä).
- Kaupallinen tuote: **Putkikasvu Standard 590 €**, 295 € ennakkoon ja 295 € nimenomaisen hyväksynnän jälkeen ennen julkaisua.
- Käyttäjän ilmoitus: ei ALV-rekisterissä. **Ei todennettu rekisterimerkintä**. Ei lisätä ALV:tä laskuun tämän ilmoituksen ollessa oikea, mutta rekisteritilanne on tarkistettava ennen laskutusta.
- Ylläpito **29 €/kk** vain erillisellä nimenomaisella sopimuksella.
- Staattinen release-haara: ei API-reittejä, asiakastietokantaa tai checkout-toimintoja; PR #1–3 eivät kuulu tähän rajaukseen.

## Lähteet, 22.10.2026
1. [Oikeustoimilaki 228/1929, erityisesti 36 §](https://www.finlex.fi/fi/lainsaadanto/1929/228).
2. [Yrittäjänsuojalaki 1062/1993, 1 §](https://finlex.fi/fi/lainsaadanto/1993/1062).
3. [Tekijänoikeuslaki 404/1961, 27–29 §](https://finlex.fi/fi/lainsaadanto/1961/404).
4. [GDPR EU 2016/679, 5–6, 12–14, 21, 28, 32–34, 44–49 artiklat](https://eur-lex.europa.eu/legal-content/FI/TXT/HTML/?uri=CELEX:32016R0679).
5. [Tietosuojalaki 1050/2018](https://finlex.fi/fi/lainsaadanto/2018/1050).
6. [Kirjanpitolaki 1336/1997, 2 luvun 10 §](https://www.finlex.fi/fi/lainsaadanto/1997/1336).
7. [Sähköisen viestinnän palveluista annettu laki 917/2014, 200, 202, 203 ja 205 §](https://www.finlex.fi/fi/lainsaadanto/2014/917).
8. [YTJ:n yrityshaku](https://www.ytj.fi/index/yrityshaku.html).
9. [Verohallinto: ALV-rekisteröinti](https://www.vero.fi/yritykset-ja-yhteisot/verot-ja-maksut/arvonlisaverotus/rekisterointi/).
10. [Tietosuojavaltuutettu: informointi](https://tietosuoja.fi/rekisteroidyn-informointi).

**Rajoitus:** Virallista YTJ:n yrityskohtaista tietuetta ei saatu avattua, eikä PRH:n avoin datarajapinta sisällä yksityisiä elinkeinonharjoittajia. Y-tunnusta, oikeaa virallista nimeä, kaupparekisteriasemaa, ennakkoperintämerkintää, ALV-statusta tai virallista osoitetta EI esitetä tarkistettuina. [PRH:n rajapintakuvaus](https://avoindata.prh.fi/fi/info/swagger-ui).

## Oikeudelliset ratkaisut ja niiden luonne
| Ratkaisu | Luonne |
| --- | --- |
| Kirjanpidon 6/10 vuoden säilyttäminen | Lakisääteinen vähimmäisaika aineistolajista riippuen |
| GDPR 13/14 artiklan tiedot ja 28 artiklan DPA | Sitova vaatimus soveltuvissa käsittelytilanteissa |
| 14 vrk automaattinen kuluttajaperuutus ei B2B-kaupassa | Soveltamisalan tulkinta; kuluttajamyynti erikseen |
| Peruutus ennen aloitusta: täysi palautus | Ehdotettu sopimusehto |
| Keskeytyksen työkorvaus 90 €/h + hyväksytyt peruuttamattomat kulut, enintään 590 € | Ehdotettu sopimusehto, kohtuullisuus arvioitava tapauskohtaisesti |
| 14 päivän palautusaika sovitun palautuksen määrästä | Ehdotettu asiakaslupaus, ei yleinen lakisääteinen B2B-peruutusaika |
| 12 kk yhteydenotoille, 3 v projektiviesteille, 90 pv ylimääräiselle aineistolle | Ehdotettu säilytyskäytäntö, EI lakisääteinen universaaliaika |
| Lähdekoodin laaja ei-yksinomainen käyttö- ja jatkokehitysoikeus maksun jälkeen | Ehdotettu sopimuksella myönnettävä oikeus |
| Vain hyväksyntä ennen loppumaksua; hiljaisuus ei hyväksy | Ehdotettu toimitusmenettely |

## Hyväksyntäesteet
- **LEGAL-01 / P1:** Varmista YTJ:stä Y-tunnuksen yritysmuoto, rekisterit, kauppanimi, ALV-merkintä ja sen ajankohta. Vahvista laskutuksessa käytettävä arvonlisäveromerkintä ja seuraa 20 000 € vähäisen toiminnan rajaa.
- **LEGAL-02 / P1:** Täydennä myyjän virallinen yritysosoite ja tarvittaessa rekisterin mukaiset yhteystiedot. Tiedot myös tarjoukseen, tilausvahvistukseen ja laskulle.
- **LEGAL-03 / P1:** Hyväksy nimenomaisesti keskeytyksen 90 €/h -laskentatapa, 14 päivän palautussääntö ja asiakkaan saamat tekijänoikeudelliset lisenssit; varmista, ettei ulkopuolisten komponenttien lisenssien kanssa synny ristiriitaa.
- **LEGAL-04 / P1:** Päätä toimituksen vastaanottotapa: nykyinen staattinen versio tukee sähköpostilinkkiä, ei tallentavaa lomaketta. Vahvista asiakkaan omistama hosting/domain ja yhden julkaisun vastuu.
- **GDPR-01 / P1:** Tee käytössä olevista palveluista todellinen käsittelykartta: Vercel, Gmail ja mahdolliset oikeasti käytetyt muut toimijat; tarkista niiden DPA:t, alikäsittelijät, ETA-siirrot ja siirtoperusteet. Älä julista Resend/Supabase/Revolut aktiivisiksi ilman käyttöönottoa.
- **GDPR-02 / P1:** Toteuta sovitut poistot sähköpostiin, tiedostoihin, asiakasrekisteriin ja varmuuskopioihin ja dokumentoi tekniset poistosyklit. Pelkkä tietosuojaseloste ei riitä.
- **GDPR-03 / P1:** Tarkista todellinen tuotantoympäristön eväste-/loki-/analytiikkatilanne selaimella. Estä ei-välttämättömät tunnisteet ennen suostumusta.
- **GDPR-04 / P1:** Jos käsitellään asiakkaan kävijä-/lomaketietoja, täytä ja allekirjoita `docs/legal/DPA_TEMPLATE.md` asiakkaan kanssa ennen käsittelyä; määritä alikäsittelijät, siirrot ja tietoturva. Staattinen toimitus ilman asiakasdataan pääsyä ei automaattisesti vaadi tätä.
- **GDPR-05 / P1:** Jos yritysprospektointi automatisoidaan, laadi GDPR 14 artiklan informointikäytäntö, oikeutetun edun tasapainotesti, markkinointikiellon prosessi sekä erottele henkilö- ja yhteisövastaanottajien suoramarkkinointisäännöt.
- **OPS-01 / P1:** Varmista lopullinen kirjallinen tarjouksen hyväksymisprosessi sekä laskun/palautuksen tilit. Maksulinkkejä, kassaa ja Revolut-/Supabase-tietovirtoja ei saa aktivoida tämän PR:n perusteella.
- **QA-01 / P1:** Tee PR #4:n edellyttämä suojattu selain-QA, käyttöliittymän saavutettavuus- ja tuotannon toimivuustarkistus sekä omistajan hyväksyntä ennen mergeä tai tuotantoon julkaisua.

## Rajaus
Tämä muutos koskee ainoastaan juridisia sivuja, mahdollista käsittelysopimuspohjaa, niiden dokumentaatiota ja regressiotestejä. Ei muutoksia maksu-, API-, tietokanta-, DNS- tai Vercel-asetuksiin. Ei merkitä juridisesti hyväksytyksi, vaikka build- ja testiajot olisivat vihreitä. Tarvittaessa suomalainen yritysjuristi tarkistaa lopulliset ehdot ennen laajempaa kaupallista käyttöönottoa.
