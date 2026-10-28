# PutkiKasvu

Next.js-myyntisivusto LVI- ja putkialan pienyrityksille. Standard 590 €, maksuerät 295 € + 295 €. Repositorio: Jambovisuaalit/putkikasvu. Vercel-projekti: putkikasvu.

## Kehitys

```sh
npm ci
npm run dev
npm run build
npm run start
```

`npm run build` suorittaa testit ja tuotantokäännöksen. Sivusto sisältää palvelinreitin eikä sitä viedä enää staattisena `out/`-hakemistona.

## Sisältö ja yhteydenotot

- `content/home.json`: versionhallittu HTML-sisältö. Ei käyttäjältä tai ulkoisesta palvelusta ladattavaa HTML:ää.
- `app/style.css`: responsiivinen ulkoasu ja lakisivujen tyylit.
- `public/app.js`: esimerkkisivun välilehdet ja lomakkeen lähetys.
- `app/api/tarjous/route.js`, `lib/inquiry.mjs`: validoitu tarjouspyyntölähetys.
- `public/brand/`: repositorion alkuperäiset optimoidut Canva-logot.
- Otsikoissa Manrope ja leipätekstissä Inter, Next.js:n paikallisesti tarjoilemina.

Lomakkeen vastaanottaja on kiinteästi `jami@putkikasvu.fi`. Resend lähettää nimen, yhteystiedon ja viestin osoitteesta `lomake@putkikasvu.fi`. Asiakkaan sähköposti asetetaan Reply-To-kenttään. Puhelinnumero toimii myös yhteystietona. Ei tietokantaa, maksamista tai markkinointilistalle lisäämistä.

Verceliin määritetään `RESEND_API_KEY` salaiseksi ympäristömuuttujaksi. Avain on vain palvelimella, ei lähdekoodissa tai selaimessa. API-avain on rajattu putkikasvu.fi-domainin lähetyksiin.

Palvelin rajoittaa syötteiden koon, tarkistaa alkuperän ja yhteystiedon sekä käyttää piilotettua roskapostikenttää. Prosessikohtainen IP-rajoitin on perustason suoja; se ei ole koko palvelun globaali rajoitin. Resendin idempotenssitunniste ehkäisee saman lähetyksen tuplaamista. Epäonnistuneen lähetyksen sisältö säilyy lomakkeessa eikä palvelin palauta virheestä onnistumista.

## Julkaisu 28.10.2026

Käyttäjä valtuutti viimeistellyn sivuston julkaisemisen GitHubin ja Vercelin kautta. Tämä korvaa aiemman staattisen esikatseluversion rajauksen lomakkeiden ja julkaisun osalta. Maksamista ja asiakastietokantaa ei aktivoida.

Julkinen tuotanto ja suojatut esikatselut pidetään erillään Vercelin Standard Protection -asetuksella. Oman domainin DNS-yhteys tarkistetaan erikseen. Toimitusehdot säilyttävät asiakaskohtaisen kirjallisen tarjouksen ja ennen maksullista tilausta tarvittavien tietojen vahvistuksen.

## Tarkistukset

17 testiä: hinta, sisältö, brändi, saavutettava navigaatio ja lomakkeen palvelinpuolen validointi, virheet sekä vastaanottajan rajaus. Lisäksi tuotantokäännös ja selaimen tarkistus.
