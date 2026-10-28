# Putkikasvu — domain-lähetyksen automatisoitu B2B-pilotti (suunnitelma)
Päiväys: 22.10.2026. Tila: **DRAFT / NO SEND / NO DNS CHANGES**.

## Periaate
Ei myyntipuheluita, ajanvarausta tai demopalavereita. Yrityskohtainen, varmennettu havainto → sähköpostiehdotus → mahdollinen suojattu itsenäinen luonnos → kirjallinen 590 € tarjous → nimenomainen kirjallinen tilaus → maksujen ja toimituksen erilliset portit.

## Resend-todennus 22.10.2026
- putkikasvu.fi: domain olemassa, status `not_started`, eu-west-1, sending enabled, receiving disabled, tracking off.
- Zonerissa tarvittavat Resend-arvot (tarkista juuri ennen lisäämistä Resendistä):
  - TXT `resend._domainkey` = `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDWLvYdAPMXIt7/FuM9J3VSTEug4WZ/y7Ho8wvlWyaQYfhrjZFLnEzAExvj89wl8L7u/gF716nLeTdHJNHBJTuRAaV+4HlowyVdURdLKvOjWxD6gj1++EeYNmnxU1zEEvzcVyQnC/p/2dke237r/sffr1vuinV3UByHl8UQwuUecwIDAQAB`
  - MX `send` = `feedback-smtp.eu-west-1.amazonses.com`, priority 10
  - TXT `send` = `v=spf1 include:amazonses.com ~all`
  - CNAME `rsend` = `send.forge.rmta.net`
- Älä poista tai korvaa juuridomainin MX/SPF-tietueita; selvitä olemassa olevat tietueet, DMARC ja reply-to-postilaatikko. Lähettäjän tavoite `Jami | Putkikasvu <jami@putkikasvu.fi>`, Reply-To `visualjambo@gmail.com` vain jos näkyvä lähettäjän domain ja vastauspolku toimivat; mieluummin oikea domain-postilaatikko / alias, jos maksuton ja testattu. Ei vääriä From-osoitteita.

## Prospektin hyväksymiskriteerit
- Yrityksen aktiivisuus ja Y-tunnus, 1–10 työntekijää lähdevuosineen, toimiala Uusimaa.
- Todellinen sivustohavainto + URL + tarkistuspäivä; ei väitettä puuttuvasta sivusta vain hakutuloksen puuttumisen perusteella.
- Yrityksen yleinen osoite ensisijainen; henkilökohtaisen työosoitteen laillisuus arvioitava tapauskohtaisesti.
- Oikeutetun edun tasapainotesti, GDPR 14 artiklan tiedot tarpeen mukaan, lähetyskieltojen käsittely; Suomen sähköisen suoramarkkinoinnin kanavasäännöt.
- Ei lähetystä aiemmin kieltäytyneelle; ei tarpeetonta henkilödataa julkiseen GitHubiin.

## Kampanjalogiikka (erä 10)
1. Jokainen yritys manuaalisesti hyväksytty CRM:ssä; `send_approved_at`, `approved_by`, `source_url`, `message_version`.
2. Viesti 1: havainto (vain todennettu) + 590 € Standard + kirjallinen tilaus ilman puhelua + CTA `Vastaa ”Haluan nähdä ehdotuksen”` tai `Haluan tilata`. Henkilökohtainen copy, ei tekaistua demo-linkkiä.
3. Jatko D+4 arkipäivää vain jos ei vastausta, ei bouncea eikä kieltoa; viimeinen D+10 arkipäivää, korkeintaan 3 viestiä yhteensä, lopeta sen jälkeen.
4. Automaation tila: `ready -> sent1 -> replied|opted_out|bounced|followup1 -> followup2 -> closed`; reply/bounce/opt-out pysäyttävät kaikki jonossa olevat viestit.
5. Ensimmäinen 2 vastaanottajan koepilotti ennen loppujen 8 lähettämistä. Ei massa-broadcastia, jos yrityskohtainen sisältö vaatii yksilöllisen viestin.
6. Lähetykset vain arkipäivisin 09–15 Suomen aikaa, 2–3 viestiä päivässä; ehdotus, ei todistettu optimaalinen lähetysaika.
7. Mittaa delivered, hard bounce, reply, positive reply, opt-out, tarjous, hyväksytty kauppa, työaika ja kulut. Ei pikseliavausseurantaa.
8. Ei automaattista lähetystä, kunnes Resend verified, lähettäjä ja vastauspolku testattu, DNS turvallinen, vastaanottajat ja viestit hyväksytty sekä käyttäjän GO: SEND vahvistettu.

## Tekninen toteutusvaihtoehto
Resend lähetys-API + ajastettu työnkulku, jossa pysyvä yksityinen CRM/tilatietokanta, idempotenssiavain, retry/backoff, webhookit reply/bounce/unsubscribe (replyt käsitellään todellisesta inboxista), päiväkohtainen lähetyskiintiö ja kill switch. Älä kytke Supabasea, Vercel Croneja tai uusia maksullisia palveluja ilman toteutuspäätöstä. Resend Broadcasts sopii yleisiin segmenttiviesteihin, ei ole oletus yrityskohtaiselle 1:1 kampanjalle.

## STOP
Ei DNS-muutoksia, domainin lähetyksen aktivointia, kontaktien tuontia Resendiin, ajastusta tai ulkoisia viestejä tässä vaiheessa. Ei maksulinkkejä eikä sivuston tuotantojulkaisua.
