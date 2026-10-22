# Putkikasvu PR #11 – eristetyn yhteystestin portit (23.10.2026)
Tila: **EI AITOA WORKER-E2E-YHTEYSTESTIÄ; CRM-KIRJOITUS POIS**.

## Tuore tilatarkistus
- PR #11 on avoin Draft, ei yhdistetty; worker-koodin viimeksi havaittu head `5bff782f4c5f82e569532a8deb43469025b7206c`.
- Canonical testitiedosto `1qGVHhvoUXqAQ5np9PmOc5cgAyUL1i70OBg7wBf-PdZc`, välilehti `TEST CRM`. Live-liitännäisen luku `A1:J4` onnistui: otsikot ja kolme synteettistä riviä.
- Vercelin nykyisen `putkikasvu`-projektin ympäristömuuttujaluettelossa ei ole CRM-workerin tarvittavia tunnusnimiä. Haku Vercelin organisaation projektinimellä `crm` palautti eri projektin, mutta ei erillistä Putkikasvu-CRM-ajoprojektia. Tämä haku ei todista, ettei runneria olisi muualla.
- Nykyiset yhdistetyt ChatGPT-palvelut eivät anna työskentelyssä käytettäviä itsenäisiä OAuth-, Resend- tai palvelutilin salaisuuksia.
- Aiemmat synteettiset worker-testit eivät korvaa tunnuksellista `runSync`-ajoa. Tuotannon CRM:ään ei ole kirjoitettu eikä ajastinta käynnistetty.

## Minimoitu eristetyn runnerin toteutus
1. Valitse erillinen, yksityinen Node 22+ ajoympäristö. Älä käytä julkista Putkikasvu-sivustoa runnerina. Varmista kustannukset ja käyttöoikeudet ennen mahdollista uuden resurssin luontia.
2. Tallenna tunnukset **suoraan suojattuun runnerin secret storeen**, älä GitHubin julkiseen koodiin, ChatGPT-viestiin, testitaulukkoon tai PR-logiin.
3. Luo Googlen vähimmän oikeuden Sheets-palvelutili ja jaa vain synteettinen TEST CRM -taulukko `Viewer`-roolilla; pyydä Sheets API read-only -scope.
4. Ota Gmailiin rajattu `gmail.readonly` OAuth offline-grant yhdistetylle vastauslaatikolle ja tallenna refresh token suoraan salaisuushallintaan. Palvelun oikean vastaanottoreitin erillinen testi ennen tulkintaa.
5. Resendin sähköpostien luku vaatii nimenomaisen lukuoikeuden; `sending_access` ei riitä. Älä luo epähuomiossa full-access-avainta keskusteluun. Selvitä mahdollinen hyväksytty erillinen pääsy/provider proxy.
6. Testaa providerit **erikseen read-only**: Sheets `A1:J4`; Gmail listaus, sivutus, Message-ID; Resend yksi olemassa oleva toimitettu viesti metatietoineen. Keinotekoisilla Resend-ID:illä ei saa päätellä auth-statusta.
7. Testaa worker `CRM_SYNC_ENV=test`, `CRM_SYNC_WRITE=false` ja eristetyllä taululla. Varmista oikeiden raw-JSON-kenttien vastaavuus ja idempotentti käsittely.
8. Pysyvä deduplikointi, retry-/ratelimit- sekä palautumismenettely ja erillinen nimenomainen käyttöönottohyväksyntä ennen kirjoitus- tai ajastuskoodin avaamista.

**Käyttöönottoportti:** Ei uusia tuotanto-CRM-kirjoituksia, lähetyksiä, provider-tunnusten automaattista luontia eikä PR-yhdistämistä.
