# Putkikasvu: yhteydenottopolku, Resend-DNS ja liidien käsittely
Päivitetty 22.10.2026. Tämä ohje koskee staattista julkaisuhaaraa, ei maksamista tai tietokantatoimintoja.

## 1. Valittu ilmainen yhteydenottopolku
- Kaikki kuusi etusivun ensisijaista CTA:ta käyttävät samaa `CONTACT_MAILTO`-linkkiä tiedostosta `app/contact.mjs`.
- Vastaanottaja: `visualjambo@gmail.com`. Aihe: `Putkikasvu | Esimerkkisivupyyntö`.
- Esitäytetty viesti kysyy yrityksen, paikkakunnan/palvelualueen, mahdollisen nykyisen verkkosivun, yhteyshenkilön, vapaaehtoisen puhelinnumeron ja lisätiedot.
- Käyttäjän laite avaa sähköpostisovelluksen viestiluonnoksen. Sivu **ei** lähetä viestiä eikä tallenna henkilötietoja. Lähettäjän pitää painaa Lähetä omassa sähköpostissaan.
- Näkyvä varapolku `#yhteys`: vastaanottajan osoite, tekstimuotoinen ohje ja kopiointipainike. Kopioinnin epäonnistuminen ilmoitetaan näkyvästi. Osoitteen voi aina valita ja kopioida käsin.
- Ei Resend-avaimia, API-reittejä, tietokantaa, maksupainikkeita tai ulkopuolista lomakepalvelua. Resendiä **ei tarvita vastaanottamiseen** Gmail-osoitteeseen.
- Rajoite: `mailto:` ei avaa luonnosta kaikissa selaimissa ilman määritettyä sähköpostisovellusta. Sivu ei myöskään voi tietää, lähettikö käyttäjä viestin. Tätä ei saa kutsua varmennetuksi palvelinpuolen liidikeruuksi.

## 2. Resend-domainin tila (suora tarkistus Resendistä 22.10.2026)
- `putkikasvu.fi`: `not_started`, alue `eu-west-1`, lähetysominaisuus *enabled*, vastaanotto *disabled*.
- Näiden DNS-tietueiden yksilöllinen Resend-vahvistustila on `not_started`, **ei verified**.
- Julkista autoritatiivista DNS-kyselyä / Zoner-hallinnan nykyisiä tietueita ei voitu tässä tarkastuksessa lukea. **Älä väitä tietuetta varmasti puuttuvaksi**: se voi olla lisäämättä, väärä tai vielä vahvistamatta.
- Resend-palvelun sähköpostidomainin verifiointi ei ole edellytys `visualjambo@gmail.com`-osoitteeseen lähtevälle `mailto:`-viestille.

### Resendin tällä hetkellä näyttämät tietueet (vain valmistelu, ei muutoksia)
| Tyyppi | Zonerin nimi / host | Resendin vaatima arvo | Muuta |
| --- | --- | --- | --- |
| TXT (DKIM) | `resend._domainkey` | katso alla oleva täysi DKIM-arvo | tila `not_started` |
| MX (palautusosoite) | `send` | `feedback-smtp.eu-west-1.amazonses.com` | prioriteetti `10`, tila `not_started` |
| TXT (SPF) | `send` | `v=spf1 include:amazonses.com ~all` | tila `not_started` |
| CNAME | `rsend` | `send.forge.rmta.net` | tila `not_started` |

DKIM:n täydellinen julkinen TXT-arvo sellaisena kuin Resend palautti sen:
```text
p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDWLvYdAPMXIt7/FuM9J3VSTEug4WZ/y7Ho8wvlWyaQYfhrjZFLnEzAExvj89wl8L7u/gF716nLeTdHJNHBJTuRAaV+4HlowyVdURdLKvOjWxD6gj1++EeYNmnxU1zEEvzcVyQnC/p/2dke237r/sffr1vuinV3UByHl8UQwuUecwIDAQAB
```
Zonerissa host-kenttään kirjoitetaan yleensä vain vasen osa (`send`, `rsend`, `resend._domainkey`), koska järjestelmä lisää automaattisesti `.putkikasvu.fi`. Varmista tämä hallintanäkymässä ennen tallennusta. Arvot ja Resend-tilat on tarkistettava uudestaan juuri ennen muutosta.

**Turvarajat:** Älä muuta `@`-juuren tai `www`-osoitteen A/AAAA/CNAME-tietueita, nykyisiä juuridomainin MX-tietueita, SPF-tietuetta tai nimipalvelimia. Älä lisää `send`-isännälle CNAMEa, jos siellä on MX/TXT. Älä aktivoi Resend-lähettämistä tai -vastaanottoa ennen erillistä hyväksyntää ja onnistunutta verifiointia. Ehdotettu tuleva DMARC pitää tarkistaa suhteessa kaikkiin käytössä oleviin lähettäjiin; älä muuta sitä sokkona.

Zoner Home -ohjepolku (vahvista käytössä oleva hallintapaneeli):
`home.zoner.fi → Omat tuotteet → Verkkotunnukset → ⋯ → Hallitse verkkotunnusta → DNS → Uusi tietue`.
Virallinen Zoner-ohje: https://tuki.zoner.fi/hc/fi/articles/46204808092049-Miten-lis%C3%A4%C3%A4n-SPF-tietueen-Zoner-Homessa

DNS-muutosten **jälkeen erikseen hyväksyttynä**:
1. Vertaa Zonerissa vain yllä olevia nimiä, arvoja ja MX-prioriteettia; säilytä kaikki sivuston ja nykyisen sähköpostin toimivat tietueet.
2. Tarkista julkisesti `TXT resend._domainkey.putkikasvu.fi`, `MX send.putkikasvu.fi`, `TXT send.putkikasvu.fi`, `CNAME rsend.putkikasvu.fi`.
3. Paina Resendissä *Verify DNS Records*; varmista jokaisen tietueen status `verified`.
4. Testaa domainilta lähettäminen erillisellä yhden viestin transaktiotestillä vasta hyväksynnän jälkeen. Älä lähetä kampanjaa.
   
## 3. Myyntiliidien käsittely Gmailissa (ilman maksullisia työkaluja)
Gmail-vastaanotto säilyy osoitteessa `visualjambo@gmail.com`. Yksittäinen viesti saapuu vain, jos kävijä lähetti sen itse.

| Tila | Toiminto | Suositeltu palvelutaso |
| --- | --- | --- |
| **Uusi** | Etsi aihe `Putkikasvu | Esimerkkisivupyyntö` ja tarkista myös roskaposti. Kirjaa yritys, yhteyshenkilö, lähde ja saapumisaika. | tarkistus jokaisena arkipäivänä |
| **Vastattu** | Vastaa samaan ketjuun: vahvista yritys / palvelualue / materiaali ja kerro demoprosessi; älä pyydä maksua. | viimeistään 1 arkipäivä, tavoite vähintään 90 % |
| **Demo työn alla** | Tee yrityskohtainen luonnos vain sovitulla laajuudella, merkitse se luonnokseksi. | priorisoi toimialasopivuuden mukaan |
| **Tarjous** | Lähetä erikseen hyväksyttävä kirjallinen Standard-tarjous, 590 € ja 295 € + 295 €. | ei maksua ennen juridista hyväksyntää |
| **Voitettu / Ei jatkoon** | Kirjaa lopputulos ja jatkokontaktin tila. | tarkista viikoittain |

Käytössä 22.10.2026 yhdistetyllä Gmail-tilillä (luotu, ei automaattisia suodattimia): Gmail-tunnisteet `Putkikasvu/Uusi`, `Putkikasvu/Vastattu`, `Putkikasvu/Demo`, `Putkikasvu/Tarjous`, `Putkikasvu/Suljettu`; tarvittaessa manuaalinen Google Sheet. Älä luo automaattista lähettämistä tai kampanjoita. Gmail-suodatin voi ehdotuksena merkitä saapuvia viestejä aiheen perusteella, mutta suodatin ei korvaa säännöllistä postilaatikon tarkistusta.

**KPI:t:** Uudet yhteydenotot / viikko, 1 arkipäivässä vastatut / kaikki, demon pyytäneistä soveltuvat / kaikki, demosta tarjoukseen %, tarjouksesta kauppaan %, toteutuneet tunnit per tarjous/kauppa. Tällä staattisella `mailto:`-versiolla painalluksia tai kaavakkeen valmistumista **ei** mitata; älä laske klikkejä liideiksi. Säilytä henkilötietoja vain vahvistetun tietosuojapolitiikan ja tarpeen mukaan.

## 4. Hyväksymis- ja testauslista
- [x] CTA:t käyttävät keskitettyä osoitetta, aihetta ja täytettäviä kenttiä.
- [x] Sivulla näkyy kopioitava varayhteystieto ja toimintaohje tilanteeseen, jossa mobiili ei avaa mail-sovellusta.
- [x] Automaattinen testi tarkistaa URI:n dekoodauksen ja näkyvän varayhteystavan.
- [x] GitHub Actions: 16/16 testiä, `npm ci`, `npm run build`, `npm audit` (0 tunnettua haavoittuvuutta) ja Vercel-tarkistus läpi 22.10.2026.
- [x] Yksi sisäinen Gmail-vastaanottotesti: viesti lähetettiin Gmail-tililtä `visualjambo@gmail.com` omaan osoitteeseen 22.10.2026 aiheen `[TESTI – yhteydenottopolku]` kanssa. Gmail API palautti viestille `INBOX`- ja `SENT`-tunnisteet. Viesti on merkitty `Putkikasvu/Suljettu` eikä ole oikea liidi.
- [ ] Mobiili- ja desktop-selainkokeet oikeilla sähköpostisovelluksilla: `mailto:` avaa vastaanottajan ja viestiluonnoksen, viesti lähetetään ja saapuu Gmailiin. Sisäinen Gmailista Gmailiin tehty testi ei todenna selaimen tai puhelimen sähköpostisovelluksen avaamista.
- [ ] Tarkista Zonerin tämänhetkiset DNS-tietueet hallinnasta / julkisesta autoritatiivisesta DNS:stä.
- [ ] Resend hyväksytty käyttöön vain tarvittaessa, DNS-verifiointi valmis ennen lähettämistä.
- [ ] Asiakastietojen säilytys ja tietosuojaseloste hyväksytty ennen tuotantoliidien keräämistä.
- [ ] Omistajan hyväksyntä PR:n yhdistämiselle ja Vercel-tuotantojulkaisulle.
