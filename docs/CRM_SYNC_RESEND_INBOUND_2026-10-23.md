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
