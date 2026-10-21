# Synteettinen hyväksymistesti — 22.10.2026

**Tila: PASS synteettisen mallin osalta. Ei oikean Revolut-integraation hyväksyntä.**

Pohja: staattinen julkaisuehdokas `096704d` (PR #4). Vanha maksuhaara `15d52e0`
auditoitu lukemalla; sen päätepisteitä tai SQL:ää ei otettu käyttöön.

| Testi | Tulos |
|---|---|
| Tarjous → ennakko → aineistot → toteutus → hyväksyntä → loppumaksu → julkaisusimulaatio | PASS |
| 59000 senttiä = 29500 + 29500; kulut erillään bruttosummasta | PASS |
| Asiakkaan kuvakaappaus, paluu-URL, teksti tai väärennetty tapahtuma | Hylätty |
| Pending / authorised / failed / palautettu / riitautettu | Hylätty |
| Väärä summa, valuutta, saaja, yritys, tilaus tai maksuerä | Hylätty |
| Tuleva tilitys, maksu ennen hyväksyntää, virheellinen nettosumma | Hylätty |
| Loppumaksu ennen täsmällisen build-version hyväksyntää | Hylätty |
| Sama tapahtuma kahteen erään tai toiselle tilaukselle | Hylätty |
| Saman kohdistuksen uusintapyyntö | Idempotentti, ei uutta lokimerkintää |
| Tuntematon käsittelijä / vanhentunut tilausversio | Hylätty |
| Puuttuvat aineisto-oikeudet / QA / domain-oikeudet | Eteneminen estetty |
| Korjauspyyntö | Uusi toteutusversio ja hyväksyntä vaaditaan |
| Palautus-/riitamerkintä | Tilaus pysäytetty, julkaisu estetty, historia säilyy |
| Asiakkaan tilakuvan tai fixture-syötteen muuttaminen | Ei muuta sisäistä tilaa |
| Tuotantovarmennus tai live-testitodisteet | Estetty |
| Mallin importointi frontendista / verkko- tai levyrajapinnat | Ei käytössä; regressiotesti |

`npm test`: **43/43 PASS** (31 uutta prosessi-/turvarajatestiä ja 12 aiempaa
testijulkaisun testiä). `npm run build`: staattinen sivusto ja export-validointi;
malli ei luo uusia sivuja, maksuja, API-reittejä tai lomaketallennusta.

Kaikki nimet, tilit, tapahtumat, viitteet ja hyväksynnät ovat synteettisiä.
Testirekisteri on testien luottamusjuuri, ei oikea Revolut-todiste. Malli ei väitä
varmentavansa oikeita pankkitapahtumia. Oletustilan live-verifier estää vahvistamisen.

## Ensimmäisen asiakkaan operatiivinen hyväksyntäeste

Olemassa olevan Revolut Pro -maksutavan todelliset tapahtumatiedot, saajatili,
tilitys ja yksiselitteinen tilauskohdistus on vielä varmennettava myyjän omassa
autentikoidussa tilissä ennen maksun käsin hyväksymistä. Jos näyttö puuttuu,
maksu jää selvitykseen. Tällä PR:llä ei anneta lupaa aktivoida vanhaa backendia.
