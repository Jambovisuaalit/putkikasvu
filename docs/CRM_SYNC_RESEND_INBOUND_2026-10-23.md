# Putkikasvu PR #11 — Resend inbound -> eristetty CRM (23.10.2026)

## Varmennettu sähköpostitesti

- jami@putkikasvu.fi vastaanotti yhden kontrolloidun testiviestin
  Gmail-kopiona sekä Resendin forwarding-vastaanottoon
  04687389@pixoosal.resend.app.
- Resend-vastaanotto vahvistettiin 23.10.2026 klo 08:32 UTC
  (11:32 Suomen aikaa). Varsinaisen CRM-workerin autentikoitua
  suoritusta ei ole tehty.
- cPanelin paikallisen kopion säilymistä ei voitu todentaa.
- Saapunut testiviesti ei todista kampanjavastausta; vaadittavia
  In-Reply-To- tai References-otsakkeita ei ole varmennettu.

## Lisätty koodiin

- integrations/resend-inbound.mjs: Resendin vastaanottolista
  GET /emails/receiving ja valittujen viestien
  GET /emails/receiving/{id}, vain GET-pyynnöt.
- Sivutus enintään viisi sivua (100 viestiä/sivu).
  Puutteellinen sivutus, ristiriitaiset provider-tiedot ja
  virheellinen vastausskeema pysäyttävät ajon.
- Vain täsmälleen Putkikasvun vastaanotto-osoitteeseen ohjatut
  viestit, joiden lähettäjä täsmää testitaulun prospektiin,
  etenevät viiteotsakkeiden tarkistukseen.
- Vastaukseksi kelpuutetaan oikea lähettäjä + outbound-viestin
  Message-ID otsakkeessa In-Reply-To tai References sekä
  vastaanottoaika vähintään lähetysajan jälkeen.
- Resendin get-vastaus voi sisältää viestirungon. Worker
  jättää sen käsittelemättä: ei tallennusta, CRM-vientiä tai lokitusta.
- Pelkkä saapuminen Resendiin ei aseta Vastannut-tilaa.
- Worker palauttaa vain suunnitellut rivipäivitykset; ei
  Sheets-kirjoituksia, kampanjalähetyksiä tai webhook-palvelinta.
- CRM_SYNC_REPLY_SOURCE oletus gmail; valinnat gmail, resend, both.
  Gmail-tunnukset tarvitaan vain, jos Gmail-lukija on valittu.

## Eristetyn testiajon asetukset

    CRM_SYNC_ENV=test
    CRM_SYNC_WRITE=false
    CRM_SYNC_TEST_SHEET_ID=1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc
    CRM_SYNC_TEST_TAB=TEST CRM
    CRM_SYNC_REPLY_SOURCE=resend
    CRM_SYNC_RECEIVING_ADDRESS=04687389@pixoosal.resend.app

Oikeassa autentikoidussa runnerissa CRM_SYNC_FIXTURE_MODE ei saa
olla päällä. Salaisuudet tallennetaan vain yksityisen runnerin
salaisuushallintaan, ei GitHubiin, verkkosivulle tai CRM-taulukkoon.

Synteettinen testi ilman verkkoa:

    node --test tests/crm-sync*.test.mjs

tests/crm-sync-resend-inbound.test.mjs kattaa onnistuneen täsmäkohdistuksen,
väärän lähettäjän, väärän vastaanotto-osoitteen, puuttuvat
viiteotsakkeet, liian varhaisen viestin, saman ajon toistamisen,
providerin metatietoristiriidan ja sivutusvirheet.

## Autentikoidun yhteystestin portit — edelleen AUKI

1. Valtuuta lukuun soveltuva Resend-token vain yksityisessä runnerissa.
   Sending-only token ei riitä saapuvien viestien lukuun.
2. Vahvista oikean saapuneen testiviestin API-otsakkeet ja skeema
   suojatussa ympäristössä; varmista, ettei viestirunkoa lokiteta.
3. Nykyiset TEST CRM -taulun synteettiset Resend-ID:t eivät viittaa
   oikeisiin viesteihin. Aidossa worker-testissä käytettävä
   oikea SISÄINEN testilähetys ja sen outbound Resend ID on
   osoitettava ennen ajoa.
4. Valtuuta Sheetsin palvelutili vain erilliseen testitaulukkoon.
5. Aja read-only worker, tarkista suunnitellut rivimuutokset,
   toista ajo ja varmista idempotentti suunnitelma. Älä kirjoita
   tuotantoon.
6. Ennen mitään automaattista kirjoittamista vaaditaan lisäksi
   tapahtumien pysyvä deduplikointi, ajon lukitus,
   retry/rate limit -käytäntö ja erillinen julkaisuvaltuutus.
7. email.received-webhookia ei tarvita tähän polling-testivaiheeseen.
   Webhook edellyttää myöhemmin erillistä vastaanottopäätepistettä,
   allekirjoitusten tarkistusta sekä toistoturvaa.

PR pysyy Draftina. Ei tuotantoworkeria, ajastusta,
DNS-muutoksia, tuotanto-CRM-kirjauksia tai kampanjalähetyksiä.


## Lisävahvistus 23.10.2026 — tunnuksellinen testiajuri

Tarkistukset:
- Resend-kytkentä voi lukea lähetetyt ja saapuneet viestit jo
  ChatGPT-yhteyden kautta. Tämä ei siirrä Resend-tokenia Node-runnerille.
- Resendissä on olemassa API-avaimia, mutta listaus ei vahvista
  avainten lukuoikeutta eikä palauta kerran luotuja salaisuuksia.
- Vercelin putkikasvu-projektissa ei ollut ympäristömuuttujia.
  Sitä ei käytetä yksityisenä CRM-runnerina.
- Erillisessä TEST CRM -taulukossa testirivien C2 ja C3 ovat yhä
  kuvitteellisia. Putkikasvulle ei löytynyt varmennettua sisäistä,
  Resendin kautta lähetettyä outbound-testiviestiä.
- Aiemman lähetystestin Resend-received ID on vastaanotto-ID;
  sitä EI saa sijoittaa C-sarakkeen outbound Resend ID -kenttään.
- Tässä vaiheessa ei luotu eikä jaettu avainta, lähetetty sähköpostia
  tai kirjoitettu taulukkoon.

### Suojattuun ajoon tarvittavat muuttujat

    CRM_SYNC_ENV=test
    CRM_SYNC_WRITE=false
    CRM_SYNC_REPLY_SOURCE=resend
    CRM_SYNC_TEST_SHEET_ID=1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc
    CRM_SYNC_TEST_TAB=TEST CRM
    CRM_SYNC_RECEIVING_ADDRESS=04687389@pixoosal.resend.app
    CRM_SYNC_INBOUND_SMOKE_ID=<existing internal inbound received UUID>
    RESEND_API_KEY=<private runner secret>

Viimeiset kaksi arvoa säilytetään vain suojatussa ajurissa;
älä lisää avainta dokumentteihin, chatteihin, lokiin tai julkiseen
GitHub Actions -työnkulkuun. Resendin read API voi edellyttää
full-access-avainta, jolla on myös muita oikeuksia: käsittele sitä
korkean riskin, väliaikaisena salaisuutena, ei rajattuna
read-only-tokenina.

Ensimmäinen provider-varmistus:

    node integrations/crm-sync-resend-inbound-auth-smoke.mjs

Skripti lukee vain erikseen määritetyn saapuneen viestin Resendin
GET-rajapinnasta, tarkistaa palautettujen otsakkeiden rakenteen
sekä kohteen ja palauttaa bool-tyyppisen tuloksen. Ei tulosta
sisältöä eikä viestiotsakkeita. Testin onnistuminen ei vielä
todista outbound-vastausparin kohdistamista.

### Aito worker-E2E pysyy erillisenä

Kun oikea, sisäinen Putkikasvusta Resendillä lähetetty
testiviesti ja sen oma outbound Resend-ID on saatavilla, voidaan
päivittää yksi synteettisen TEST CRM -taulukon rivi.
Vaaditaan testin lähettäjäksi ja vastaanottajaksi vain omia
osoitteita. Vasta tätä seuraa aidolla read-only-runSync-ajolla
kohdistuksen tarkistus ja saman ajon toisto.

CI-hyväksyntä todistaa vain fixture-tapaukset. Se ei
todista todellisen Google Sheets -palvelutilin ja Resendin tokenin
autentikointia tai oikeaa Gmailista saapuvaa vastausotsaketta.

**Nykyinen portti:** älä avaa kirjoitusreittiä, ajastinta,
tuotantokohdetta tai PR-mergeä.


## Read-only worker + vastaanoton yksikomentoinen tarkistus (23.10.2026)

Uusi tiedosto: integrations/crm-sync-resend-readonly-check.mjs.
Kun erillinen suojattu ajuri ja oikeat tunnukset on valtuutettu,
se tekee:
1. Resend GET /emails/receiving/{CRM_SYNC_INBOUND_SMOKE_ID}.
2. Google Sheets -luku vain erillisestä TEST CRM -taulukosta.
3. Resend GET -lukupyynnöt ja reply-kohdistuksen ilman sähköpostilähetyksiä.
4. Toisen saman read-only dry-runin kiinnitetyllä aikaleimalla.
5. Suunnitelmien täsmällisen vertailun ilman yhtäkään tietokantakirjoitusta.

Komento yksityisessä ajurissa:

    node integrations/crm-sync-resend-readonly-check.mjs

Odotettu tulos vain turvallisia aggregaatteja sisältävänä JSONina,
esimerkiksi { "mode": "read-only", "inboundAuthenticated": true,
"workerCandidates": 1, "proposedWrites": 0, "realWrites": 0,
"emailsSent": 0, "repeatPlanIdentical": true }.
Esimerkki ei ole oikeasti saavutettu autentikoitu testitulos.
Toistuva sama suunnitelma ei todista pysyvää event-ledger-deduplikointia.

API-avainten oikeuksien huomio: Resend tarjoaa tämänhetkisen
dokumentaation mukaan Full access ja Sending access -tasot,
ei erillistä vain vastaanotettujen viestien lukuoikeutta.
Saapuneiden viestien autentikoitu GET edellyttää siis
Full access -tyyppistä avainta; kyseisellä avaimella olisi
myös muita tilioikeuksia. Käytä mieluiten väliaikaista
erillistä tiliä/testiympäristöä tai eristettyä salaisuushallintaa,
älä upota tällaista avainta julkisen repohaaransa CI:hin.
Jo olemassa olevien avainten arvot eivät ole luettavissa
Resend-tilin API-avainlistauksesta.

Mikäli TEST CRM sisältää yhä synthetic-alkuisia outbound-ID:itä,
aito worker-E2E EI voi mennä läpi; älä tee siinä tilanteessa
väitettä tuotantokelpoisuudesta. Pelkän inbound-proben voi
ajaa erikseen jo tunnetulla sisäisellä vastaanotto-ID:llä,
mutta se ei korvaa workerin kokonaisyhteystestiä.

Resendin vastaanoton raw-otsakkeiden puuttuminen tai
virheellinen vastaanottoaikaleima pysäyttää workerin.
Se ei merkitse prospektille virheellistä Ei löydetty -tilaa.
