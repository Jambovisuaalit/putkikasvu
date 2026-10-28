# First Payment Agent v1

Omistajan päätös 28.10.2026: valmistelu ja oma hyväksyntä. Vain PK01 ja PK02; varsinaiset yritys-, vastaanottaja- ja viitetiedot ovat Vercelin yksityisessä `FIRST_PAYMENT_SCOPE_JSON`-asetuksessa ja lähde-CRM:ssä. Niitä ei kopioida julkiseen repositorioon.

## Ajettava prosessi

1. Lue PutkiKasvun myyntipilotin nykyiset CRM-rivit, estolista ja lähetysloki Google Drive / Sheets -liitännällä. Säilytä aiempi kontaktointi; aiempi kontakti ei yksin tarkoita markkinointikieltoa. Lue myös omistajan seurantapäätös. Testi-CRM ei kelpaa lähteeksi.
2. Tarkista vastaukset Gmailin nykyisestä vastaanottavasta postilaatikosta. Hae rajatusti kahden vastaanottajan viestit myös arkistosta, roskapostista ja roskakorista. Nouda löydetyistä viesteistä vain luokitteluun tarvittava teksti, vastaanottoaika, lähettäjä, viestitunniste ja References/In-Reply-To. Pelkkä sama aihe ei kohdista vastausta yritykseen.
3. Muodosta normalisoitu CRM- ja postilaatikkosnapshot yksityisessä muistissa. Älä tallenna asiakasviestejä GitHubiin, julkisiin raportteihin tai selaimen paikallistallennukseen. Merkitse epäonnistunut lähde `status:error`; tyhjä onnistunut haku on eri asia kuin epäonnistunut haku.
4. Lähetä snapshot suojattuun POST `/api/internal/first-payment` -reittiin. Käytä Vercelin salaisuutta `FIRST_PAYMENT_AGENT_TOKEN`. Tarkistusajat saavat olla enintään 24 h vanhoja. Älä paljasta avainta selaimeen tai raporttiin.
5. Päätösmoottori luokittelee kohdistetut vastaukset: kielto, ei kiinnostusta, poissaolo, kiinnostus, kysymys, tarjouspyyntö, hyväksynnän tarkistus, epäselvä. Epäselvät ja hyväksynnältä näyttävät viestit menevät ihmiselle. Lainattua vanhaa tekstiä ei käsitellä uutena vastauksena. Luokittelu on sääntöpohjainen, eikä se takaa kaikkien ilmaisujen tunnistamista.
6. Raportoi kummankin yrityksen nykyinen tilanne ja seuraava valmistelutoimi. Valmistele kirjallinen tarjous vain asiayhteyden perusteella. Tarjouksessa 590 €, 295 € + 295 €, enintään 3 sivua, yksi koottu korjauskierros. Täydennä tunnus, versio, ehdot, aikataulu, materiaalit ja luovutus ennen omistajan hyväksyntää.
7. Pyydä omistajaa hyväksymään tarkka vastaanottaja ja viesti. Tämän version endpoint ei lähetä viestejä, kirjoita CRM:ään, vahvista tilausta, käynnistä maksua tai julkaise asiakassivua. Omistajan hyväksyntä tallennetaan myöhempää lähetysvaihetta varten erikseen; pelkkä luonnos tai kiinnostus ei ole lähetyslupa.

## Kirjallinen tilauspolku

Kohdistettu vastaus → ehdotus/tarjousluonnos → omistajan tarkistus → erikseen hyväksytty lähetys → asiakkaan nimenomainen kirjallinen hyväksyntä tiettyyn tarjousversioon → tilausvaltuuden ja tilaustietojen tarkistus → myyjän kirjallinen tilausvahvistus → erillinen 295 € ennakkomaksun käsittely.

Maksun toteutuminen on osoitettava todellisesta tapahtumasta. Moottori ei tulkitse asiakkaan viestiä, maksulinkin avausta tai tarjouksen hyväksyntää maksetuksi ennakoksi. Mahdollinen 29 €/kk ylläpito ei tule automaattisesti mukaan.

## Ensimmäisen version käyttörajat

API käsittelee vain omistajan/luotetun ajajan toimittaman tuoreen snapshotin. Gmail- ja Sheets-liitäntöjen käyttöoikeuksia ei voi siirtää Vercel-palvelimelle. Tässä versiossa CRM/Gmail-haku tehdään Codexin nykyisillä liitännöillä tarkistusajon yhteydessä; itsenäistä Vercel-ajastusta tai inbox-webhookia ei ole aktivoitu. Ajastus ja palvelimen omat lukuoikeudet ovat erillinen käyttöönottovaihe.

API ei säilytä tapahtumahistoriaa. Jo lähetetty seuranta ja pysyvä kielto luetaan joka ajolla uudelleen CRM:stä. `checkedAt` on tarkistushetki, ei asiakkaan viimeisen vastauksen aika. Tyhjä rajattu haku tarkoittaa vain ettei kyseisellä haulla löytynyt viestejä.

## Snapshot-sopimus

`{crm:{status,checkedAt,records:[{id,company,recipient,sentMessageIds,firstSentAt,followupPermission,followupSent,delivery,optOut}]},mailbox:{status,checkedAt,messages:[{id,from,references,receivedAt,text}]}}`

`followupPermission` on `manual_one_message` vain varmennetun omistajapäätöksen perusteella. `optOut:true` pysäyttää kontaktin. Lähetyskielto pysyy voimassa, vaikka tämän ajon myöhempi viesti vaikuttaisi kiinnostuneelta. Puuttuva tai vanha lähde estää ajon.

## Suhde aiempaan maksuprosessiin

Nykyinen `lib/first-payment.mjs` säilyy hinnan ja maksuvaiheiden auktoriteettina. Päätösmoottori tuo hinnat siitä eikä luo erillistä maksutuotetta. Hyväksynnän tarkistus ohjaa aiemman moduulin edellyttämiin tarjous-, ehto-, valtuus- ja tilaustietoihin. Verotuksen hoitaminen säilyy omistajan vastuulla; sitä ei lisätä tämän version automaattiseksi myyntiportiksi. Katso `docs/ops/FIRST_PAYMENT_AGENT_V1.md`.
