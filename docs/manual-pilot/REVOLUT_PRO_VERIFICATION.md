# Revolut Pro – manuaalisen maksunvarmennuksen tarkistusohje (pilotti)
Päiväys: 22.10.2026. **Ei ole todiste suoritetusta maksusta**. Toimeenpano vasta juridisten myyntiehtojen hyväksymisen jälkeen.

## Mikä on vahvistettu
- Revolut Pro on erillinen ammattikäyttöön tarkoitettu tili tavallisen Revolut-sovelluksen sisällä, ei sama kuin Revolut Business/Merchant API.
- Suomen Revolut Pro tukee maksulinkkejä. Linkki voi olla uudelleenkäytettävä; pelkkä linkin yleinen aktiivinen/valmis tila ei yksilöi asiakkaan suoritusta.
- Maksun käsittelykulu veloitetaan onnistuneesta maksusta ja erottuu vastaanotetusta netosta.
- Revolut Pro:n **ensimmäinen payout voi odottaa 7 päivää**, ja myöhemmät tilitykset voivat olla 24 h, kun ehdot täyttyvät. Älä lupaa asiakkaalle toteutuksen alkua maksun kirjautumista ennen, jos sopimus edellyttää varojen saapumista.

Lähteet:
- https://help.revolut.com/fi-FI/help/more/revolut-pro/features-available-with-revpro/
- https://help.revolut.com/fi-FI/help/more/revolut-pro/accepting-customer-payments/payment-links-and-how-to-use-them-for-pro/
- https://help.revolut.com/fi-FI/help/more/revolut-pro/accepting-customer-payments/pro-settlement-time/
- https://help.revolut.com/en-DE/help/more/revolut-pro/how-can-i-check-who-paid-a-revolut-pro-payments/

## Ensimmäisen erän todellinen tarkistus (295 €)
1. Asiakkaan kirjallinen hyväksyntä, sopimusversio ja `PK-<tilaus>-E1` -eräviite tallennetaan yksityiseen tilauskorttiin.
2. Avaa **omat** Revolut-sovelluksen tilit → Pro → Katso kaikki myynnit / See all sales → kyseinen pyyntö, lasku tai maksulinkki. Sovelluksen sanamuodot voivat vaihdella.
3. Avaa juuri kyseiseen maksuun liittyvä maksutapahtuma, ei vain linkin summatilaa. Merkitse yksilöllinen tapahtuma-/maksutunnus, aika, bruttomäärä 295,00 €, EUR, maksajan tiedot siinä määrin kuin ne näkyvät, myyjän vastaanottava Pro-tili, tapahtuman tila, mahdollinen maksu-/palkkioerittely, mahdollinen palautus tai chargeback.
4. Varmista yhteys juuri oikeaan yritykseen ja kyseiseen tilaukseen. Jos maksulinkki ei sisällä yksilöllistä viitettä tai todellisten maksutapahtumien erittely puuttuu, **älä hyväksy maksua** ennen kirjallisen todistusketjun täydentämistä.
5. Vahvista tapahtuman toteutunut tilitys/saapuminen valitun konservatiivisen pilotin ehdoilla. Maksun hyväksyntästatus, katevaraus, lähetetty maksulinkki ja asiakkaan kuvakaappaus eivät yksin täytä todistetta.
6. Kirjaa `E1_VERIFIED` vasta, kun oikea tapahtumatodiste on yksilöity eikä sitä ole jo liitetty toiseen tilaukseen. Erillinen PDF tai kuvakaappaus säilytetään vain asianmukaisesti suojatussa asiakaskansiossa, ei GitHubissa.
7. Loppuerä `E2` vasta asiakkaan nimenomaisen, tiettyyn build-versioon sidotun kirjallisen hyväksynnän jälkeen. Varmista E2 erillisestä 295 € maksutapahtumasta samoilla ehdoilla ennen julkaisua.
8. Tarkista ennen julkaisua mahdolliset palautukset, riitautukset, sovittu domain/hosting ja asiakkaan lopullinen hyväksyntä. Epäselvyys = pysäytys.

## Pakollinen ensimmäisen oikean tapahtuman näyttö ennen GO-päätöstä
Omistaja todistaa yksityisessä Revolut Pro -näkymässä ainakin tapahtuman yksilöllisen tunnisteen, tilan, summan, valuutan, vastaanottajan ja tilauskohdistuksen. Sen jälkeen dokumentoi, mistä kentät löytyvät käytössä olevassa Pro-käyttöliittymässä. Älä anna ChatGPT:lle maksukortti-/pankkitilin täysiä numeroita tai asiakastietojen tarpeettomia kopioita.

## Tila
- [x] Menettely, lähteet ja fail-closed-portit dokumentoitu.
- [x] Olemassa oleva 43 testin synteettinen tilaustyönkulku.
- [ ] Oikean Revolut Pro -tapahtuman tarkistus todennettu tilinäkymästä.
- [ ] Myyjän rekisterimerkinnät, ehdot ja asiakasvahvistukset hyväksytty.
- [ ] Automaattista maksunvarmennusta ei ole otettu käyttöön.
