import Link from 'next/link';
import BrandLogo from '../components/BrandLogo';

export const metadata = { title: 'Palvelu- ja toimitusehdot | Putkikasvu' };

const sections = [
  {
    title: '1. Sopijapuolet ja soveltamisala',
    paragraphs: [
      'Palveluntarjoaja on Tmi Jami Harju (Y-tunnus 3581581-6), joka käyttää Putkikasvu-palvelubrändiä. Yritysosoite: Mannerheimintie 109, Helsinki (palveluntarjoajan ilmoittama). Sähköposti: jami@putkikasvu.fi. Näitä ehtoja sovelletaan vain elinkeinotoimintaa varten tilaavien yritysasiakkaiden Putkikasvu Standard -toimituksiin. Kuluttajatilauksia ei hyväksytä näillä ehdoilla.',
      'Asiakaskohtainen kirjallinen tarjous, siinä sovittu toimituserittely ja sen jälkeen nämä ehdot muodostavat sopimuksen. Ristiriitatilanteessa yksilöity tarjous on ensisijainen. Tarjouksessa ja tilausvahvistuksessa ilmoitetaan myyjän maantieteellinen yritysosoite, sopijapuolten tiedot, palvelun rajaukset, ehdot ja versio. Ehdot toimitetaan asiakkaalle ennen hyväksyntää sellaisessa muodossa, että ne voi tallentaa ja toisintaa.'
    ]
  },
  {
    title: '2. Tarjous, demo ja sopimuksen syntyminen',
    paragraphs: [
      'Mahdollinen yrityskohtainen demo on luonnos, ei asiakkaan virallinen sivusto eikä tilaus. Sopimus syntyy, kun yrityksen valtuutettu edustaja nimenomaisesti hyväksyy yksilöidyn kirjallisen tarjouksen ja sen mukana toimitetun ehtoversion ja palveluntarjoaja vahvistaa tilauksen kirjallisesti. Tarjous, ehdot, hyväksyntä ja vahvistus säilytetään todennettavasti. Hiljaisuus tai demon katselu ei ole hyväksyntä.',
      'Ennen ennakkomaksun pyytämistä asiakkaalle annetaan kokonaishinta, toimitussisältö, aikataulun alkuehdot, mahdolliset erilliskulut sekä korjaus- ja peruutusehdot. Sivusto ei tarjoa tällä hetkellä verkkokassaa tai toimivaa maksulinkkiä.'
    ]
  },
  {
    title: '3. Standard-toimituksen rajat',
    paragraphs: [
      'Standard 590 € sisältää enintään kolme varsinaista sivua (etusivu, palvelut, yhteystiedot), vakiopohjaan perustuvan responsiivisen ulkoasun, asiakkaan toimittamien tekstien kevyen editoinnin ja käyttöluvallisten kuvien sijoittelun, klikattavan puhelin- ja sähköpostiyhteyden, yhden selkeän tarjouspyyntöön ohjaavan toimintakehotteen, perustason tekniset SEO-määrittelyt, yhden kootun korjauskierroksen, perustestauksen sekä yhden sovitun julkaisukerran.',
      'Yhteydenotto toteutetaan oletusarvoisesti sähköpostilinkillä tai muulla tarjouksessa täsmennetyllä vastaanottotavalla. Tietoja tallentava lomake, ajanvaraus, integraatiot, verkkokauppa, monikielisyys, laaja sisällöntuotanto, kuvaus, mainonta ja hakukonesijoitusten tai liidimäärien takuu eivät sisälly hintaan.'
    ]
  },
  {
    title: '4. Hinta, ALV ja maksut',
    paragraphs: [
      'Kokonaishinta on 590 euroa: 295 euroa ennakkomaksuna vahvistetun tilauksen jälkeen ja 295 euroa hyväksytyn julkaisuvalmiin sivuston jälkeen mutta ennen tuotantojulkaisua. Ennakko hyvitetään aina kokonaishinnasta. Erillisiä pakollisia tilaus- tai ylläpitomaksuja ei lisätä.',
      'Myyjä on ilmoittanut, ettei ole arvonlisäverovelvollisten rekisterissä. Myyjän ilmoituksen mukaan vähäisen liiketoiminnan perusteella arvonlisäveroa ei lisätä 590 euron hintaan. Vähäisen toiminnan soveltuminen varmistetaan myyjän liikevaihtotiedoista ennen laskutusta. Jos olosuhteet muuttuvat, mahdollisesta hinnan ja veron käsittelystä sovitaan asiakkaan kanssa ennen uusia velvoitteita. Maksutapa ja eräpäivät ilmoitetaan laskussa tai tilausvahvistuksessa; tällä sivustolla maksaminen ei ole käytössä.',
      'Hyväksytyt lisätyöt laskutetaan erikseen niiden nimenomaisesti hyväksytyn tarjouksen mukaan. Maksun viivästymiseen sovelletaan soveltuvaa korkolakia; maksuerimielisyydet käsitellään ennen riidanalaisen osan perimistä.'
    ]
  },
  {
    title: '5. Aikataulu ja asiakkaan myötävaikutus',
    paragraphs: [
      'Esikatselun ja julkaisun määräpäivät sovitaan kirjallisesti yksilöidyssä tarjouksessa ennen tilauksen vahvistamista. Toteutus aloitetaan sovitusti, kun ennakko sekä tilausvahvistuksessa pyydetyt aineistot ja käyttöoikeudet on saatu. Tuotantojulkaisu edellyttää lisäksi asiakkaan nimenomaista kirjallista hyväksyntää, loppumaksua sekä toimivaa domainia ja hostingia.',
      'Asiakas vastaa toimittamiensa yritystietojen oikeellisuudesta, aineistojen oikeuksista, omista palvelutilauksistaan ja hyväksynnöistään. Asiakkaasta tai kolmannesta osapuolesta johtuvan viiveen vaikutuksesta ilmoitetaan, ja uusi realistinen toimituspäivä sovitaan. Jos palveluntarjoaja viivästyy olennaisesti, asiakas voi vaatia korjaavaa aikataulua ja olennaisen sopimusrikkomuksen perusteella päättää sopimuksen.'
    ]
  },
  {
    title: '6. Katselmointi, korjaukset ja hyväksyntä',
    paragraphs: [
      'Asiakas saa julkaisuvalmiista toteutuksesta esikatselulinkin ja viisi arkipäivää aikaa antaa yhden kootun palautelistan. Vakiokierrokseen sisältyy enintään viisi sovitun sisällön mukaista kohtuullista tarkennusta. Puutteellisesti toteutettujen sovittujen ominaisuuksien korjaus ei kuluta korjauskierrosta eikä ole lisätyö.',
      'Uusi sivu, olennaisesti uusi rakenne, uudet ominaisuudet ja ylimääräiset muutoskierrokset hinnoitellaan ennakkoon erikseen. Julkaisu edellyttää asiakkaan nimenomaista kirjallista hyväksyntää. Vastaamattomuus ei ole hyväksyntä eikä synnytä loppumaksun erääntymistä.'
    ]
  },
  {
    title: '7. Peruutus ennen aloitusta',
    paragraphs: [
      'Yritysasiakkaalla ei ole tämän sopimuksen perusteella automaattista kuluttajakaupan 14 päivän peruuttamisoikeutta. Asiakas voi kuitenkin peruuttaa vahvistetun tilauksen kirjallisesti. Jos työtä ei ole aloitettu eikä asiakkaan nimenomaisesti hyväksymiä, peruuttamattomia ulkopuolisia kuluja ole syntynyt, ennakkomaksu palautetaan kokonaan.'
    ]
  },
  {
    title: '8. Keskeytys työn aloittamisen jälkeen ja palautukset',
    paragraphs: [
      'Jos asiakas peruuttaa toimituksen työn jo alettua ilman palveluntarjoajan sopimusrikkomusta, palveluntarjoaja voi veloittaa vain todennettavasti tehdyn työn 90 €/h mukaan sekä asiakkaan etukäteen hyväksymät, tosiasiallisesti syntyneet ja peruuttamattomat ulkopuoliset kulut. Yhteissumma ei ylitä 590 euroa eikä mahdollista erikseen hyväksyttyä lisätyötä lasketa siihen ilman omaa sopimustaan. Jo maksettu ennakko luetaan hyvitykseksi; mahdollinen ylijäämä palautetaan.',
      'Palveluntarjoaja antaa asiakkaalle työ- ja kuluerittelyn. Palautus suoritetaan 14 kalenteripäivän kuluessa siitä, kun palautuksen määrä on sovittu tai vahvistettu, pääsääntöisesti alkuperäiselle maksutilille. Jos palveluntarjoaja rikkoo sopimusta olennaisesti eikä korjaa rikkomusta kohtuullisessa kirjallisesti annetussa määräajassa, asiakkaalla on oikeus päättää sopimus ja saada palautus suorittamatta jääneestä tai käyttökelvottomasta toimitusosasta; mahdolliset muut lainmukaiset oikeudet säilyvät.'
    ]
  },
  {
    title: '9. Domain, hosting ja ylläpito',
    paragraphs: [
      'Domain rekisteröidään asiakkaan nimiin ja asiakkaan hallinnoimalle tilille. Asiakas maksaa domainin uusimisen ja hostingin suoraan palveluntarjoajille sekä säilyttää näiden hallintaoikeudet. Putkikasvu avustaa sovitussa DNS-kytkennässä ja yhdessä käyttöönotossa. Julkaisua ei luvata ennen kuin tuotantokäyttöön soveltuva hosting on valittu ja käyttöoikeudet ovat kunnossa.',
      'Jatkuva ylläpito ei sisälly 590 euron toimitukseen. Mahdollinen ylläpito on vapaaehtoinen erillinen palvelu, josta ei ole vielä hyväksytty lopullista sopimustuotetta. Sen hinta, palvelutaso, rajaukset, irtisanomisaika ja vastuut annetaan erillisessä kirjallisessa tarjouksessa ennen tilausta. Ilman ylläpitosopimusta asiakkaan hostingin, domainin, uusintojen ja myöhempien muutosten hallinta kuuluu asiakkaalle.'
    ]
  },
  {
    title: '10. Tekijänoikeudet, lähdekoodi ja kolmannen osapuolen aineisto',
    paragraphs: [
      'Asiakas säilyttää oikeutensa toimittamiinsa nimiin, merkkeihin, teksteihin, kuviin ja muuhun materiaaliin sekä vakuuttaa, että niitä saa käyttää toimituksessa. Kun koko sovittu toimitushinta on maksettu, asiakas saa toimituskohtaisesti tuotettuun verkkosivustoon pysyvän, maailmanlaajuisen, rojaltivapaan, ei-yksinomaisen käyttö-, kopiointi-, muokkaus-, ylläpito- ja siirto-oikeuden sekä oikeuden käyttää uutta palveluntarjoajaa sivuston ylläpitoon ja jatkokehitykseen.',
      'Putkikasvu luovuttaa asiakkaalle sovitun sivuston lähdekoodin ja tarpeelliset rakentamis- ja julkaisuohjeet tai sovitun koodivaraston käyttöoikeuden kohtuullisessa siirrettävässä muodossa viimeistään viiden arkipäivän kuluessa loppumaksusta. Putkikasvu säilyttää oikeudet omiin yleiskäyttöisiin pohjiin, työmenetelmiin ja komponentteihin ja saa käyttää niitä muualla, kuitenkaan paljastamatta asiakkaan luottamuksellista aineistoa.',
      'Avoimen lähdekoodin ja muiden kolmansien osapuolten lisenssit sekä mahdolliset asiakaskohtaiset rajoitukset ilmoitetaan toimituksessa. Muiden oikeudenhaltijoiden tekijän moraalisia oikeuksia tai tekijänoikeuksia ei väitetä siirtyvän sopimuksella.'
    ]
  },
  {
    title: '11. Virheet, tietoturva ja vastuunjako',
    paragraphs: [
      'Palveluntarjoaja vastaa siitä, että toimitus vastaa kirjallisesti sovittua sisältöä ja tekee oman työnsä huolellisesti. Sovitun toimituksen virheet korjataan ilman lisämaksua kohtuullisessa ajassa. Pyydämme ilmoittamaan virheistä kirjallisesti viivytyksettä; ilmoittamispyyntö ei poista lain nojalla mahdollisesti kuuluvia oikeuksia.',
      'Asiakas vastaa omien materiaalien laillisuudesta ja julkaistavien väitteiden oikeellisuudesta. Putkikasvu ei takaa tiettyä Google-sijoitusta, tarjouspyyntömäärää tai taloudellista tulosta. Kumpikaan osapuoli ei vastaa toisen itsenäisesti hallinnoimien kolmansien palveluiden käyttökatkoista siltä osin kuin häiriö ei johdu osapuolen omasta laiminlyönnistä. Tahallisuuteen, törkeään huolimattomuuteen, tietosuojaa koskeviin lakisääteisiin velvoitteisiin ja muihin pakottaviin velvoitteisiin perustuvia vastuita ei rajoiteta näillä ehdoilla.'
    ]
  },
  {
    title: '12. Henkilötietojen käsittely',
    paragraphs: [
      'Putkikasvu käsittelee omien asiakasyhteyksiensä, tarjoustensa ja laskutuksensa henkilötietoja itsenäisenä rekisterinpitäjänä sivustolla julkaistun tietosuojaselosteen mukaisesti. Jos Putkikasvu käsittelee asiakkaan verkkosivukävijöiden tai asiakkaiden henkilötietoja asiakkaan lukuun, osapuolet tekevät kirjallisen GDPR 28 artiklan mukaisen henkilötietojen käsittelysopimuksen ennen käsittelyn aloittamista ja sopivat alihankkijat, tietoturvan ja poistot.',
      'Asiakas vastaa oman verkkosivustonsa rekisterinpitäjänä omasta tietosuojainformoinnistaan, evästesuostumuksista ja käsittelyn lainmukaisuudesta. Putkikasvu ei ota käyttöön henkilötietoja kerääviä lomakkeita, analytiikkaa tai maksutoimintoja ilman erillistä hyväksyntää ja tietosuojatarkistusta.'
    ]
  },
  {
    title: '13. Asiakkaan aineistot ja luottamuksellisuus',
    paragraphs: [
      'Osapuolet käsittelevät toimituksen yhteydessä saamiaan ei-julkisia yritys- ja henkilötietoja luottamuksellisesti. Putkikasvu ei julkaise asiakkaan keskeneräistä demoa asiakkaan virallisena sivustona eikä käytä asiakkaan nimeä referenssinä ilman erillistä lupaa. Toimitustiedostojen säilytyksestä ja poistamisesta kerrotaan tietosuojaselosteessa ja mahdollisessa henkilötietojen käsittelysopimuksessa.'
    ]
  },
  {
    title: '14. Sovellettava laki ja riitojen ratkaisu',
    paragraphs: [
      'Sopimukseen sovelletaan Suomen lakia. Riita pyritään ensin ratkaisemaan kirjallisilla neuvotteluilla. Ellei sovintoa synny, asia ratkaistaan toimivaltaisessa suomalaisessa tuomioistuimessa soveltuvan lain mukaisesti. Tämä ehto ei rajoita pakottavan lainsäädännön mukaisia oikeuksia.'
    ]
  }
];

export default function Terms() {
  return <><header className="nav"><div className="wrap"><BrandLogo /><Link href="/">Etusivu →</Link></div></header>
    <main id="main-content" tabIndex={-1} className="wrap legal">
      <p className="eyebrow eyebrow-on-light">Putkikasvu · vain B2B</p>
      <h1>Palvelu- ja toimitusehdot</h1>
      <p>Hyväksyttävä luonnos v1.2 · 22.10.2026</p>
      <p className="warning"><strong>Ei vielä asiakastilauksiin hyväksytty:</strong> myyjän maantieteellinen yritysosoite (laki sähköisen viestinnän palveluista 176 §), rekisteri- ja ALV-tiedot, ennakkoperintämenettely, kirjallinen tilausprosessi sekä tosiasialliset tietosuojajärjestelyt on vahvistettava ennen myyntikäyttöä. Verkkomaksaminen ei ole käytössä.</p>
      {sections.map(({title,paragraphs})=><section key={title}><h2>{title}</h2>{paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}
    </main></>;
}
