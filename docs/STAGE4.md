# Vaihe 4 – Demo- ja maksupolun mock-testi

## Tila
Vain testi, ei production checkoutia. Testidemo: /demo/testi

## Polku
1. Yrityskohtainen fiktiivinen demo
2. Standard-tarjous 590 € ja ehdot; checkbox pakollinen
3. Ennakkomaksu 295 €: testipainike simuloi vahvistuksen, ei avaa Revolutia
4. Onboarding: yritys, puhelin, aukioloajat ja valinnainen paikallinen kuvan valinta
5. Loppumaksu 295 €: testipainike simuloi vahvistuksen
6. Asiakkaan julkaisuhyväksynnän simulaatio, ei julkaise mitään

## Rajaukset ennen tuotantoa
- Revolut Pro -maksut vahvistetaan manuaalisesti, kunnes virallinen automaatiopolku on todennettu.
- Ei maksulinkin avaamista eikä oikeaa maksua testissä.
- Ei tietokantaa, sähköpostilähetyksiä, tiedostojen latausta eikä asiakastietojen tallennusta.
- sessionStorage tallentaa vain simulaation tilaliput, ei lomaketietoja.
- Esikatselu on merkitty fiktiiviseksi ja noindex; verkkosivulle pääsyä se ei itsessään estä.
- B2B-sopimusehdot, hosting, ALV-status, myyjän identiteetti sekä domain-oikeudet hyväksyttävä erikseen.
- Maksujen merkitseminen maksetuiksi saa tuotannossa seurata vain maksunsaajan virallista vahvistusta.
- Julkaisu tuotantoon edellyttää myös QA:ta ja loppumaksun todentamista.

## Testit
node --experimental-strip-types --test tests/pilot-order.test.mjs

## Hyväksymiskriteeri
Testit läpäisevät, käyttäjä voi käydä läpi koko simuloidun polun, eikä oikeaa veloitusta tai asiakassivun julkaisua synny.
