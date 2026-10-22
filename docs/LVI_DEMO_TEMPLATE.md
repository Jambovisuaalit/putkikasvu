# Monistettava LVI-yrityskohtainen demo

Versio 0.1 • 22.10.2026 • PAIKALLINEN LUONNOS, ei tuotantojulkaisu.

## Auditointi

| Nykyinen toteutus | Havainto | Ratkaisu |
|---|---|---|
| Myyntisivun LVI-havainne | Kovakoodattu yrityksetön kortti; ei dataohjattua yrityssivua | Säilytetty markkinointisivulla; uusi erillinen pohja |
| stage4 `/demo/testi` | Maksupolun mock, palvelut ja yritysnimi kovakoodattu; sessionStorage ei ole lähde yritystiedoille | Ei kopioida maksu-/tilauslogiikkaa |
| stage4 demoheader | Viittaus `/icon.png`:ään, jota haaran tiedostolistassa ei ole | Uusi pohja ei tarvitse puuttuvaa logotiedostoa |
| secure-orders-demo | Perii maksupolun, ei uudelleenkäytettävää yritystietoskeemaa | Ei backendia, tietokantaa tai maksamista demopohjaan |
| brand/a11y/static-haarat | Myyntisivuston brändi ja saavutettavuus, eivät yrityskohtaisia demoja | Pohjana PR #4:n turvallinen staattinen lähdekoodi |

## Yksi malli, yksi JSON-lähtöaineisto

`demo-template/` on erillinen Next-sovelluspohja, jota juuren myyntisivuston
Vercel-build ei julkaise. Ei uutta riippuvuutta tai maksullista palvelua.

- Hero: yrityksen nimi, toimialue ja ensisijainen CTA yhteystietoihin.
- Palvelut: 1–6 tarkistettua palvelukuvausta.
- Luottamus: todellinen toimialue, palveluvalikoima ja selkeä työn sopimisen prosessi.
- Yhteydenotto: puhelin/sähköposti näkyvät esikatseluna; CTA vie yhteysosioon.
- Ei keksittyjä arvioita, asiakasreferenssejä, pätevyyksiä, päivystystä tai vasteaikoja.
- 0–3 erikseen hyväksyttyä PNG/JPEG/WebP-kuvaa. Ilman kuvia graafinen havainne,
  joka on selvästi merkitty havainnekuvaksi, ei asiakastyöksi.
- Mobiilille pinoutuvat palstat ja navigaatio, 44 px linkkikohteet, skip link,
  focus-tilat, natiivit ankkurit, reduced-motion-tuki ja kuville alt-tekstit.

Yhteystietolinkit ovat tarkoituksella passiivisia: julkaisematon luonnos ei käynnistä
puhelua, lähetä sähköpostia tai tallenna lomaketta. Aktivointi vaatii yrityksen
hyväksynnän ja erillisen julkaisu-/toimitustyön. Demoa ei väitetä yrityksen viralliseksi sivuksi.

## Valmistus ilman komponenttien koodausta

1. Kopioi `demo-template/data/example.json` yksityiseen lähtötiedostoon.
2. Vaihda `companyName`, `area`, `phone`, `email` ja `services`.
3. Oikealle yritykselle aseta `synthetic: false`, `verified: true`, `source` ja `checkedAt`.
   Kirjaa lähteet yksityiseen aineistorekisteriin; tämä on vastuuhenkilön tarkistus,
   ei koodin tekemä väitteen aitouden varmennus.
4. Lisää kuvat vain luvalla. Kuvakentät: `localPath`, `alt`, `approved: true`,
   `approvedBy`, `approvalRef`, `source`. `localPath` osoittaa olemassa olevaan
   paikalliseen tiedostoon. Generaattori validoi tiedostotyypin/signatuurin (enintään 10 MB),
   kopioi vain hyväksytyt kuvat ja poistaa alkuperäisen paikallisen polun tuotetusta asetuksesta.
5. Aja:

```sh
npm run demo:create -- --input /absoluuttinen/polku/yritystiedot.json --slug yritys-demo
npm run demo:preview -- yritys-demo
```

Paikallinen esikatselu: http://127.0.0.1:3100 . Sulje palvelin käytön jälkeen.
Yksi esikatselupalvelin kerrallaan. Sivukoodi pysyy samana kaikille yrityksille.
Uusi generaattoriajo ei ylikirjoita aiempaa demoa: valitse uudelle versiolle uusi slug.
Valmiin demon asetusta voi muuttaa tiedostossa `.demo-output/<slug>/data/example.json`
ilman komponenttien uudelleenkoodausta. Aja rakennus uudelleen muutoksen jälkeen.

Staattinen paikallinen rakennus:

```sh
node node_modules/next/dist/bin/next build .demo-output/yritys-demo
```

## Suojaus

- Kaikilla sivuilla pysyvä LUONNOS-banneri ja robots noindex/nofollow.
- **Noindex ei ole pääsynhallinta.** Malli on tässä vaiheessa vain paikalliseen käyttöön.
- Esikatselupalvelin sidotaan 127.0.0.1:een. Ei julkista jakolinkkiä.
- `.demo-output/`, `demo-template/private/`, buildit ja paikalliset asiakaskuvat ohitetaan Gitissä.
- Tuotetun asetustiedoston oikeus 0600 ja demokansion 0700 POSIX-ympäristössä.
- Mallin Next-konfiguraatio hylkää Vercel-/remote-buildit myös preview-ympäristössä.
  Julkaisemattomia yritystietoja ei voi vahingossa viedä tällä pohjalla Verceliin.
- Nykyisen Putkikasvu-projektin Vercel-liitin ilmoitti ssoProtection enabled=true,
  deploymentType=all tämän työn aikana. Asetusta ei muutettu. Erillinen etäjakelu
  vaatii myöhemmin autentikoinnin varmennuksen ja nimenomaisen käyttöönottotyön.
- Älä lataa oikeita lähtöaineistoja julkiseen GitHub-repoon tai kierrä buildin suojausta.

## 30 minuutin tavoite ja todellinen mittaus

`npm run demo:benchmark` tekee uuden synteettisen yrityksen, validoi datan, rakentaa
staattisen sivun ja tarkistaa renderöidystä HTML:stä nimen, palvelut, toimialueen,
yhteystiedot, ankkurit, luonnosmerkinnän, noindexin ja puuttuvan lähetys-/maksutoiminnon.
Tulokset ja ajoajat: `docs/LVI_DEMO_BENCHMARK.json`.

Ensimmäinen mitattu ajo: **7,485 sekuntia**:
- Generointi ja validointi 0,058 s.
- Next-build ja export 7,426 s.
- Renderöidyn HTML:n hyväksymistarkistus 0,001 s.

Tämä on todellinen kellotettu tekninen monistus valmiista synteettisestä aineistosta,
ei arvio tai ensimmäisen pohjan rakentamiseen käytetty aika. Siinä ei ollut oikeita
asiakaskuvia. Erillinen generaattoritesti käyttää olemassa olevaa P-symbolia teknisenä
kuvafixturena eikä esitä sitä asiakastyönä.

**Koko oikean yritysdemon 30 minuutin tavoitetta ei ole vielä todennettu.** Yritystutkimus,
kuvien lupien hankinta, tekstien hyväksyntä, ihmisen tekemä visuaalinen tarkistus ja
etäjakelu eivät sisälly tähän aikaan. Ensimmäisellä oikealla yrityksellä kellota
valmiiden varmennettujen tietojen syötöstä lopulliseen visuaaliseen QA:han; tavoite ≤30 min.
Näin valmistusajan mittaria ei sekoiteta materiaalien odotteluun.

Suunniteltu työbudjetti valmiista aineistosta (ei mitattu tulos): tiedot 8 min,
kuvat 5 min, esikatselu/tekstit 5 min, mobiili-/CTA-QA 8 min, toimituskirjaus 4 min.
Jos lähtötiedot ovat epäselvät, merkitse puute äläkä keksi täytettä.

## Testaus ja rajat

`npm test` kattaa skeeman, kuvien hyväksynnät, turvalliset polut, etäbuild-eston ja
generaattorin toiminnan/ylikirjoituseston. Mallin CSS sisältää mobiilisäännöt;
375/390/768/1440 px:n visuaalinen ja 200 % zoomauksen tarkistus on edelleen tehtävä
paikallisessa oikeassa selaimessa. Tässä työssä ei väitetä tehtyä pikselitason selaintestiä.

Pohja on yksi mallinnettu yrityssivurakenne. Asiakkaalle ei luoda uutta frontendiä,
portaalitunnusta, tietokantaa tai maksulinkkiä jokaisen demon yhteydessä.

### Lopullinen uusintatulos

Viimeisin ajo 22.10.2026 klo 03.01.17–03.01.25 (Europe/Helsinki): **7,900 s**,
josta generointi 0,057 s, build/export 7,842 s ja HTML-tarkistus 0,001 s.
`npm test`: **20/20 PASS**. Myyntisivuston erillinen `npm run build` ja export-tarkistus
läpäisivät myös. Nämä eivät korvaa paikallista visuaalista selaintarkistusta.
