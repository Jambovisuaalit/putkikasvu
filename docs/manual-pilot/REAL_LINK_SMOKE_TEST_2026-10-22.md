# Putkikasvu – 0,01 € maksulinkin todellinen smoke-testi

**Päivä:** 22.10.2026  
**Luokka:** OPERATOR SELF-TEST, ei asiakasmaksu, ei myyntitulo, ei tilauksen ennakko.  
**Testin tila:** `CHECKOUT_CAPTURED_PAYER_SIDE` / `PRO_SETTLEMENT_UNVERIFIED` / `COMMERCIAL_GO_BLOCKED`

## Käyttäjän esittämä alkuperäisnäyttö – ei tallennettu GitHubiin

Käyttäjä toimitti kolme kuvaa:
1. Revolut Bank UAB:n **henkilökohtaisen tilin vahvistuksen**, joka näyttää haltijan ja tilan. Tämä **ei osoita** kyseessä olevan Revolut Pro -tilin IBAN tai kauppiastilitystili.
2. Revolut-sovelluksen **maksajan korttitapahtumalistauksen**, jossa 0,01 EUR tapahtuma on `Kaapattu` 22.10.2026.
3. `checkout.revolut.com`-onnistumiskuitin: `Payment successful`, **0,01 EUR**, **Apple Pay**, päiväys 22.10.2026 ja yksilöllinen kuitin maksutunnus.

**Yksityisyyssuoja:** Julkiseen GitHubiin ei tallenneta pankkitilin numeroa, kortin osanumeroa, syntymäaikaa, osoitetta, puhelinnumeroa, koko maksutunnusta, henkilökohtaista sähköpostia eikä alkuperäisiä kuvia. Koko tapahtumatunnus ja saajatilin näyttö tarkistetaan tarvittaessa vain yksityisesti pankkisovelluksessa.

## Varmennetut rajatut väitteet

| Testiväite | Tila |
| --- | --- |
| Checkout avautuu ja Apple Pay -korttimaksu voidaan suorittaa | **PASS, käyttäjän näyttö** |
| Checkout näyttää maksun onnistuneena | **PASS, käyttäjän näyttö** |
| Maksajan korttitapahtuma näkyy kaapattuna | **PASS, käyttäjän näyttö** |
| Maksu näkyy samana tapahtumana `Pro → Katso kaikki myynnit` | **EI TODETTU** |
| Maksun saajana on juuri Putkikasvulle hyväksytty erillinen Pro-tili | **EI TODETTU** |
| Kauppiaan brutto, maksutapahtuman palkkio ja netto ovat täsmäytettävissä | **EI TODETTU** |
| Maksu on tilitetty Pro-tilille, ei vain kaapattu | **EI TODETTU** |
| Todellisen yritysasiakkaan 295 € ennakko voidaan kohdistaa ainutkertaisesti tilaukseen | **EI TODETTU** |
| Kaupallisen käytön ehdot, ALV, ennakkoperintä ja GDPR on hyväksytty | **EI TODETTU** |

## Tarvittava jatkotarkistus (vain omasta Pro-sovelluksesta)

1. Avaa Revolut → Tilit → **Pro** → Katso kaikki myynnit → testin tapahtuma. Varmista, että **0,01 EUR, 22.10.2026** löytyy ja että kauppiaan tapahtumatunnus vastaa kuittia. Älä käytä maksajan `Kaapattu`-tilaa kauppiaan tilitystodisteena.
2. Tarkista Pro-tilin *erillinen* saaja-/IBAN-tieto ja että maksulinkki kuuluu samalle Pro-kauppiastilille. Henkilökohtaisen tilin vahvistusasiakirja ei korvaa tätä.
3. Kirjaa yksityiseen auditointiin Pro-puolen tila, brutto (0,01 €), käsittelykulu, netto, palautus/chargeback-tila ja **todellinen tilitys**. Jos tilitys vielä odottaa, merkintä `CAPTURED_NOT_SETTLED`.
4. Revolutin mukaan ensimmäisellä Pro-tilityksellä on 7 päivän odotus; odota tilityksen vahvistumista ennen `SETTLED`-merkintää.
5. Koska maksu tehtiin **omalla kortilla itselle** vain tekniseksi kokeeksi, se ei ole kaupallinen asiakastapahtuma. Revolutin maksunkäsittelyehdot koskevat asiakkailta saatavia maksuja; **älä toista omia testimaksuja**, ennen kuin Revolutilta on varmistettu tällaisten testien hyväksyttävyys.
6. Kirjaa tämä myös kirjanpidon testitapahtumaksi ja pankkikuluineen; älä käsittele 0,01 € testiliikettä oikeana Standard-myyntinä.
7. Kun asiakasmyynti on muuten luvallinen, jokainen todellinen 295 € ennakko tarkistetaan erikseen: tilausnumero, asiakkaan hyväksyntä, maksupyyntö/linkki, kauppiaan maksutunnus, tila, bruttosumma, kulut, netto, saajatili ja tilitys. Sama tunniste ei kelpaa kahteen tilaukseen.

## Myynnin GO/NO-GO

**Tekninen checkout + Apple Pay: rajattu PASS.**  
**Aito Revolut Pro -kauppiaan maksun ja tilityksen varmennus: PENDING.**  
**Asiakasmaksujen aktivointi: NO-GO**, kunnes omistaja hyväksyy PR #9:n ehdot, rekisteri- ja ALV-menettelyt sekä ensimmäisen asiakkaan maksun kohdistamisprosessin.

### Revolutin ensisijaiset ohjeet
- https://help.revolut.com/fi-FI/help/more/revolut-pro/accepting-customer-payments/payment-links-and-how-to-use-them-for-pro/
- https://help.revolut.com/fi-FI/help/more/revolut-pro/accepting-customer-payments/pro-settlement-time/
- https://help.revolut.com/en-DE/help/more/revolut-pro/how-can-i-check-who-paid-a-revolut-pro-payments/
- https://www.revolut.com/legal/business-acquiring/
