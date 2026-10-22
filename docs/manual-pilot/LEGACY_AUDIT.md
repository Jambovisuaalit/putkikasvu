# Kokeellisen secure-orders-haaran auditointi

Lähde: `feat/secure-orders-revolut-onboarding` @ `15d52e0`.
Tämä PR perustuu staattiseen julkaisuehdokkaaseen, ei tuo kokeellista backendia sivustolle
eikä aktivoi tai muuta vanhaa haaraa. Alla olevat puutteet estävät sen tuotantokäytön.

| Havainto | Vaikutus | Tämän pilotin ratkaisu |
|---|---|---|
| validatePayment hyväksyy transactionId:n ja evidenceNote-tekstin pyynnöstä | Pituus-/summatarkistus ei todista Revolut-tapahtuman olemassaoloa | Live-verifier estetty; oikeassa manuaaliprosessissa myyjän itsensä avaama tapahtuma ja todistekortti |
| Admin payments tarkistaa henkilöstön, tilausviitteen ja yritysnimen, mutta luottaa käsittelijän antamiin maksutietoihin | Autentikointi ei varmista rahasuoritusta | Vain synteettinen rekisterihaku testimallissa; ei vapaata maksettu-lippua |
| SQL:n balance-portti vaatii ennakon ja onboardingin, ei yksilöityä build-hyväksyntää | Loppumaksu voidaan kirjata väärässä järjestyksessä | Approval ennen awaiting_balance-vaihetta; tarkka build-viite |
| Demo etenee loppumaksusta hyväksyntään ja ottaa tilan sessionStoragesta | Demo ei sovellu tilauskirjanpidoksi tai todistusaineistoksi | Ei demoa tai sessionStoragea uudessa mallissa |
| Onboarding-validointi hyväksyy rightsConfirmed=false | Aineisto voi edetä ilman oikeusvahvistusta | Materiaaliportti vaatii true |
| Onboarding tarkistaa loppumaksun ja tekee upsertin eri kutsuissa | Kilpaileva maksu/onboarding voi ohittaa lukituksen | Ei rinnakkaista tietokantaa; yhdellä vastuuhenkilöllä käsiteltävä pilotti. Tuleva backend tarvitsee atomisen siirtymän ja rinnakkaisuustestit |
| SQL transaktiotunnisteen uniqueness ja maksu-RPC:n lukitus on hyvä lähtökohta | Ei yksin takaa muiden vaiheiden tai todistelähteen oikeellisuutta | Testimallissa globaali kohdistus, idempotenssi, versiotarkistus ja muuttumattomat tilakuvat |
| Vanhat 17 testiä ovat pääosin apufunktio-/validointitestejä | Eivät todista oikeita RLS-sääntöjä, maksulähdettä tai koko toimitusketjua | Uusi kokonaisketju + kielteiset testit; ei väitettä oikeasta integraatiotestistä |

Vanha haara on edelleen kokeellinen eikä tämän PR:n läpäisy hyväksy sen käyttöönottoa.
Sen aktivointi pelkällä PK_BACKEND_ENABLED-asetuksella ei ole sallittu hyväksymisratkaisu.

## Ennen mahdollista automaatiota

1. Varmista erikseen tälle Pro-tilille saatavilla oleva autentikoitu tapahtumalähde.
2. Älä tulkitse Merchant API -dokumentaatiota takeeksi Pro-tilin API-oikeuksista.
3. Todisteeseen sidottu hyväksyntä ja yksilölliset tapahtuma-/erärajoitteet pysyvässä tallennuksessa.
4. Atominen onboarding/build-approval/payment-tilakone, oikeustestit ja A/B-eristys.
5. Palautus/riita/webhook-uusintojen ja viiveiden käsittely, todisteiden elinkaari.
6. Oma hyväksytty staging-ympäristö ja erillinen tietoturvakatselmointi.

Tässä tehtävässä ei suoritettu SQL:ää, tehty verkkomaksua, avattu maksulinkkiä,
luotu käyttäjiä eikä otettu käyttöön maksullisia palveluita.
