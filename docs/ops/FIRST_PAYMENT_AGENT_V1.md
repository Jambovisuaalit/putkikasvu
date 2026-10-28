# PutkiKasvu — First Payment Agent v1 (28.10.2026)

## Tavoite
Saada ensimmäinen **varmennettu 295 € ennakkomaksu** myymällä PutkiKasvu Standard
yritysasiakkaalle hintaan **590 € yhteensä** (295 € ennakko ja 295 € loppuerä).
Ei puheluita, pakollisia kalenterivarausia tai kaupallisen sisällön keksimistä.

## Omistajan nimenomainen päätös 28.10.2026
- Maksukanava: nykyinen **Revolut Pro -freelancer-tilin 295 € maksulinkki**.
- Ennakkoperintä/ennakonpidätys **ei ole myyntiautomaation sisäinen päätösportti**:
  yrittäjä hoitaa mahdolliset vero- ja ennakkoperintäkysymykset erikseen.
  Tämä ei väitä, ettei ostajalla tai myyjällä olisi lain mukaisia velvoitteita,
  eikä agentti anna asiakkaalle virheellistä vapautusväitettä.
- Myyjä ei ilmoituksensa mukaan kuulu ALV-rekisteriin. Seuraa vähäisen toiminnan
  rajan täyttymistä erillään myyntityönkulusta.
- Pidä tarjouspyyntö ja sopimuksen syntyminen eri vaiheina.

## Toteutettu koodipohja
- `lib/first-payment.mjs`: Standardin hinnat, 295 € maksulinkki,
  nimenomaisen hyväksynnän tarkistus, **lähettämätön maksupyyntöluonnos** ja
  Revolut-tapahtuman todistelogiikka.
- `tests/first-payment.test.mjs`: estää maksupyynnön ilman kirjallista hyväksyntää,
  väärän summan, toiselle tilaukselle käytetyn tapahtuman ja puutteellisen maksutositteen.

**Ei vielä toteutettu:** automaattinen Sheets-CRM-luku/kirjoitus,
Resend-vastauswebhook, automaattinen hyväksymis-/tarjousviestien lähetys,
turvallinen maksupalvelun omistajapuolinen tapahtumarajapinta tai
Revolut Pro -maksun koneellinen täsmäytys. Pelkkä tämän commitin tuotantobuild
ei aktivoi agenttia, kampanjaa tai maksujen keräämistä.

## Työnkulku
1. `NEW`: yrityksen verkkosivun tarve varmistetaan todellisesta lähteestä.
2. `CHECKED`: CRM, aiemmat lähetykset, vastaukset ja estolistat tarkistetaan.
   `OPTOUT`, `DUPLICATE`, `CONTACTED_RECENTLY` eivät etene kylmäviestiin.
3. `OUTREACH_SENT`: sallittu, asiakaskohtainen lyhyt viesti, oikea lähettäjä,
   tunniste ja helppo maksuton kielto. Seurantaa korkeintaan yksittäinen
   hyväksytty follow-up, ei sarjakampanjaa.
4. `INTERESTED`: kiinnostunut vastaanottaja saa tarvittaessa suojatun demon,
   jossa näkyy `LUONNOS – ei yrityksen virallinen sivu`.
5. `OFFER_SENT`: lähetetään yksilöity 590 € tarjous, toteutusraja, kustannukset,
   asiakkaan kanssa sovittu aikataulu ja tallennettavat ehdot.
6. `ACCEPTED`: valtuutettu edustaja hyväksyy nimenomaisesti tarjouksen
   ja ehdot; hyväksyntä tallennetaan yksityiseen tilauskorttiin.
7. `DEPOSIT_REQUESTED`: `buildDepositRequest(order)` tuottaa 295 € sähköpostiluonnoksen,
   joka voidaan lähettää vain hyväksytyn tilauksen yhteydessä.
8. `DEPOSIT_PAID`: **ainoastaan** maksunsaajan puolelta varmistettu,
   oikeaan tilaukseen yksilöity completed-tilainen Revolut Pro -tapahtuma.
9. `IN_DELIVERY`: sovitut aineistot, toteutus ja yksi korjauskierros.
10. `FINAL_APPROVED` → `FINAL_PAID` → `PUBLISHED`: 295 € loppuerä
    ja julkaisu hyväksyntöineen erikseen.

## Maksulinkin ominaisuudet ja rajoitukset
- URL: https://checkout.revolut.com/pay/595062b8-6377-4e8d-bb80-fd53ecced9c9
- Tarkistettu näkyvä summa: **295 EUR**, näyttönimi: Putkikasvu.fi.
- Julkinen maksusivu sisältää kentän `Yrityksesi nimi?`, mutta se ei ole
  luotettava yksilöllinen tapahtuma-/tilausviite.
- Maksutapahtuman vahvistus vaatii oikean Revolut Pro -omistajan tapahtumatiedon.
  Älä merkitse kauppaa maksetuksi sähköposti-ilmoituksesta tai kuvakaappauksesta.

## Auki olevat riippuvuudet (eivät ole ennakkoperinnän myyntiportteja)
- `putkikasvu.fi` näyttää yhä vanhan 990 € sivun (28.10. tarkistus);
  nykyisen GitHub `main`-haaran 590 € sivu ei yksin muuta julkista domainia.
  Älä lisää nykyistä julkista 990 € hintasivua 590 € tarjoussähköpostiin.
- Vercel Preview/SaaS-deployment URL:t voivat olla SSO-suojattuja.
  Älä lähetä asiakkaalle testaamatta julkisessa vastaanottajaistunnossa.
- Valmis 590 € myyntimateriaali, brändi ja oikeat ehdot tulee synkronoida
  käyttöön ennen kampanjan avaamista.
- Maksun automaattinen varmistus odottaa luotettavaa Revolut Pro -integraatiota
  tai maksunsaajan todentamaa tapahtumakirjausta.
- Resend-vastaanotto toimii välitysosoitteessa; `putkikasvu.fi`-domainin
  oma vastaanotto ei ole Resendissä käytössä. Älä vaihda MX-tietueita
  ennen olemassa olevien postilaatikoiden reitityksen varmistamista.

## Käyttörajat
- Ei julkaista prospektien henkilö- tai tilausdataa julkisessa GitHubissa.
- Ei lähetetä korttimaksulinkkiä kylmäkontaktoinnissa.
- Ei automaattista hyväksyntää asiakkaan hiljaisuudesta tai demon katsomisesta.
- Ei ilmoiteta maksetuksi, ellei todellinen tilitystapahtuma ole vahvistettu.
- Ei luvata, että linkin avaaminen, asiakkaan ilmoitus tai Vercel READY
  tarkoittaisi kassaan tullutta rahaa.
