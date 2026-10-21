# Putkikasvu — käsittelyrekisteri ja tuotantoon siirron ehdot (21.10.2026)

## Todettu tila
- Vercel-projekti: prj_KvVMKBhuWA7SgXwtUntiySBQdNEL
- Vercel Auth / SSO suojaa kaikkia deploymentteja.
- Vercel-projektin ympäristömuuttujalista oli tyhjä tarkistuksessa.
- Liidiputki on erillinen inaktiivinen Supabase-projekti; ei kytketty tänne.
- GitHub-kehityshaarassa on `/api/admin/orders`, `/api/admin/payments`, `/api/onboarding`. Ne ovat tarkoituksellisesti pois käytöstä, ellei kaikkia PK_BACKEND_* asetuksia ole.
- Revolut Pro toimii erillisellä maksulinkillä, jota tämä koodipohja ei aktivoi.
- `mailto:visualjambo@gmail.com` avaa käyttäjän oman sähköpostiohjelman. Se ei ole tässä sovelluksessa tallentava verkkolomake.

## Käsittelykartta
| Käsittely | Rekisterinpitäjä | Tietoryhmät | Palvelu | Tila |
| --- | --- | --- | --- | --- |
| Hosting ja tekniset suojauslokit | Tmi Jami Harju (selvitettävä palveluntarjoajan roolijako) | IP/pyyntötiedot mahdollisesti | Vercel | Käytössä |
| Sähköpostiyhteydenotot | Tmi Jami Harju | Lähettäjä/viesti | Sähköpostipalvelut | Mahdollinen, mailto |
| Sopimus ja tarjous | Tmi Jami Harju | Yritys, yhteyshenkilö, tarjous | Ei integroitua CRM:ää | Ei aktivoitu |
| Maksun täsmäytys | Tmi Jami Harju / maksupalveluntarjoajan oma rooli | Tapahtuman tunniste, maksutila | Revolut Pro; suunniteltu Supabase | Ei integroitu |
| Onboarding | Tmi Jami Harju | Puhelin, toimialue, palvelut, kuvat | Suunniteltu Supabase | Ei aktivoitu |
| Prospektointi | Tmi Jami Harju | Yritystiedot, työyhteystiedot mahdollisesti | Tarkistettava | Ei vahvistettua automaatiota |

## Ennen aktivointia
1. Selvitä toimijan yhteys- ja rekisteritiedot sekä GDPR 13/14 -informointi.
2. Määritä kustakin käsittelystä oikeusperuste, täsmällinen säilytysaika / kriteerit, tietojen lähteet, vastaanottajat ja poistomenetelmä.
3. Tarkista Vercelin sekä mahdollisten Supabase-/Resend-/Revolut-palvelujen DPA:t, alihankkijat ja ETA-siirtoperusteet.
4. Luo testitietokanta vain erillisellä hyväksynnällä, suorita RLS/testikäyttäjien eristystestit ja maksujen täsmäytystestit.
5. Varmista sähköpostin lähetys/toimitus ja tukiprosessin osoite.
6. Aja selain-QA suojattuun deploymenttiin kirjautuneena: 375, 390, 768, 1440px; Tab/Shift+Tab; zoom 200%; linkit ja reitit; noindex; API:n 503 ilman käyttöönottoa.
7. Hyväksy ehdot ja myyjän tiedot ennen maksusivun liittämistä.
8. Älä muuta Zonerin DNS:ää ennen erillistä päätöstä.

## Turvarajat
Ei oikeita asiakastietoja kehityshaaraan eikä uutta maksutapahtumaa pelkkien testien vuoksi. `noindex` ei ole käyttöoikeussuoja; Vercel SSO pidetään käytössä.
