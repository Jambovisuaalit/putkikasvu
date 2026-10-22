import Link from 'next/link';
import BrandLogo from '../components/BrandLogo';

export const metadata = { title: 'Tietosuojaseloste | Putkikasvu' };

const sections = [
  {
    title: '1. Rekisterinpitäjä ja yhteystiedot',
    paragraphs: [
      'Rekisterinpitäjä: Tmi Jami Harju, Y-tunnus 3581581-6. Palvelubrändi: Putkikasvu. Tietosuojaa koskevat pyynnöt ja yhteydenotot: visualjambo@gmail.com.',
      'Rekisterinpitäjän maantieteellinen yritysosoite on vahvistamatta eikä palvelua avata maksullisille asiakastilauksille ennen osoitteen julkaisemista. Tämä seloste koskee Putkikasvun omia yhteydenotto-, tarjous- ja asiakkuustietoja; asiakkaan oman verkkosivuston tietosuojaseloste on erillinen.'
    ]
  },
  {
    title: '2. Henkilötietoryhmät ja niiden lähteet',
    paragraphs: [
      'Käsiteltäviä tietoja voivat olla yhteyshenkilön nimi, asema, edustettu yritys, työpuhelin, sähköpostiosoite, viestien sisältö, tarjous- ja tilauskeskustelut, hyväksynnät, toimitusaineistot sekä kirjanpitoon välttämättä kuuluvat tiedot. Palvelu ei tällä hetkellä kerää verkkosivustolla lomakkeen kautta maksukorttitietoja.',
      'Tiedot saadaan ensisijaisesti rekisteröidyltä tai tämän edustamalta yritykseltä sähköpostitse ja sovittujen asiakasprojektien aikana. Julkisista rekistereistä ja yritysten omilta verkkosivuilta hankittavaa henkilöihin yhdistyvää liiditietoa ei oteta automatisoituun markkinointikäyttöön ennen erillistä oikeusperuste-, vastustamis- ja GDPR 14 artiklan informointitarkistusta.'
    ]
  },
  {
    title: '3. Tarkoitukset ja oikeusperusteet',
    paragraphs: [
      'Yhteydenottoihin vastaaminen ja yritysasiakkaan kanssa tehtävän yhteistyön valmistelu: GDPR 6 artiklan 1 kohdan f alakohta (oikeutettu etu asiakassuhteen hoitoon ja asiallisiin yritysyhteydenottoihin). Kun rekisteröity itse on sopimuksen osapuolena, tietojen käsittely sopimuksen tekemiseksi ja täyttämiseksi voi perustua 6 artiklan 1 kohdan b alakohtaan.',
      'Asiakkaan yhteyshenkilöihin liittyvien tilausten, toimitusten ja hyväksyntöjen hallinta: GDPR 6 artiklan 1 kohdan f alakohta (oikeutettu etu yritysasiakkaan sopimuksen toteuttamiseksi). Laskujen ja kirjanpitoaineiston säilyttäminen: GDPR 6 artiklan 1 kohdan c alakohta (lakisääteinen velvoite). Mahdollinen oikeudellisten vaateiden selvittäminen: 6 artiklan 1 kohdan f alakohta.',
      'Sähköisen suoramarkkinoinnin edellytykset arvioidaan vastaanottajan ja kanavan mukaan ennen lähetyksiä. Rekisteröity voi aina vastustaa henkilötietojensa käyttöä suoramarkkinointiin. Julkinen yritysyhteystieto ei sellaisenaan poista GDPR:n vaatimuksia.'
    ]
  },
  {
    title: '4. Oikeutetun edun sisältö',
    paragraphs: [
      'Oikeutettu etu on vastata saapuneisiin yrityskyselyihin, tarjota sovittu palvelu, pitää yhteyttä asiakkaan nimeämiin yhteyshenkilöihin ja puolustaa tarvittaessa sopimukseen perustuvia oikeuksia. Käsittely rajataan tarpeellisiin työhön liittyviin yhteystietoihin ja projektisisältöihin. Rekisteröidyn kohtuulliset odotukset, tietojen luonne ja vastustamisoikeus huomioidaan erillisessä oikeutetun edun arvioinnissa ennen laajamittaista prospektointia.'
    ]
  },
  {
    title: '5. Tietojen vastaanottajat ja käsittelijät',
    paragraphs: [
      'Putkikasvun sivuston tekninen hosting on Vercel-alustalla. Sähköpostiviestinnässä käytetään ilmoitettua Gmail-sähköpostiosoitetta. Nämä palvelut voivat käsitellä teknisiä tietoja ja viestien henkilötietoja; niiden tarkat roolit, käyttöehdot ja alikäsittelijät määräytyvät todellisen palvelusopimuksen ja käytön mukaan. Asiakastilausten laajennus estetään, kunnes käsittelykartta on varmennettu.',
      'Resend-, Supabase- ja Revolut-palveluita ei tässä selosteessa ilmoiteta aktiivisiksi sivuston lomake-, tietokanta- tai maksunkäsittelijöiksi: näitä toimintoja ei ole otettu käyttöön nykyisessä staattisessa julkaisuehdokkaassa. Kunkin tosiasiallisesti käytetyn palvelun rooli, sopimusehdot ja mahdolliset alikäsittelijät dokumentoidaan käsittelyrekisteriin ennen tietovirtojen laajentamista.'
    ]
  },
  {
    title: '6. Säilytysajat ja poistaminen',
    paragraphs: [
      'Vastaamatta jääneet tai kauppaan johtamattomat tavalliset yhteydenotot: tavoitesäilytysaika enintään 12 kuukautta viimeisestä merkityksellisestä yhteydenotosta, ellei aiempi poistopyyntö, avoin riita tai muu perusteltu tarve edellytä muuta. Myyntiä koskevaa kieltoa varten voidaan säilyttää vain välttämätön estomerkintä niin kauan kuin se on tarpeen kiellon noudattamiseksi; tarve tarkistetaan vuosittain.',
      'Asiakkaan sopimus- ja projektiviestintä: sopimuksen ajan ja lähtökohtaisesti kolme vuotta sen päättymisestä, jos säilyttäminen on tarpeellista oikeudellisten vaateiden selvittämiseksi. Julkaisua varten toimitetut ylimääräiset kopiot kuvista ja työaineistoista: lähtökohtaisesti poistetaan 90 päivän kuluttua hyväksytystä luovutuksesta, ellei säilytyksestä tai ylläpidosta ole erikseen sovittu tai aineistoa tarvita vireillä olevaan selvitykseen.',
      'Kirjanpidon tositteet ja liiketapahtumiin liittyvä kirjeenvaihto säilytetään vähintään kuusi vuotta sen vuoden lopusta, jonka aikana tilikausi päättyi. Tilinpäätökset, kirjanpidot ja muut kirjanpitolain 2 luvun 10 §:ssä mainitut aineistot säilytetään vähintään kymmenen vuotta tilikauden päättymisestä. Näitä aikoja ei sovelleta automaattisesti kaikkeen asiakasviestintään.',
      'Edellä olevat ajat ovat käyttöönottosuunnitelman mukaisia käsittelylinjauksia. Todelliset sähköposti-, varmuuskopio- ja hostingpalvelujen poistokäytännöt on varmennettava ja toteutettava ennen käsittelyn laajentamista; varmuuskopioita ei luvata poistuviksi välittömästi.'
    ]
  },
  {
    title: '7. Kansainväliset tietojen siirrot',
    paragraphs: [
      'Google kertoo voivansa käsitellä tietoja myös käyttäjän maan ulkopuolella, ja Vercel käyttää alikäsittelijöitä. Näin ollen myös Euroopan talousalueen ulkopuoliset siirrot voivat olla mahdollisia. Tapauskohtainen siirtokartta ja sovellettava suoja (esimerkiksi riittävyyspäätös tai EU:n vakiosopimuslausekkeet tarvittavine lisätoimineen) on vielä vahvistettava käytettyjen palvelutilien ja sopimusten perusteella. Siirtoperusteita koskevat lisätiedot voi pyytää rekisterinpitäjän yhteysosoitteesta; tämän selosteen keskeneräisyys on käyttöönoton este.'
    ]
  },
  {
    title: '8. Tietoturva',
    paragraphs: [
      'Tietoja käsitellään tarkoitukseen rajatuin käyttöoikeuksin. Käyttöoikeuksia ja säilytysaikoja arvioidaan säännöllisesti. Sovellettavat salaus-, tunnistautumis-, varmuuskopiointi- ja lokikäytännöt arvioidaan todellisten palveluiden perusteella; tälle sivulle ei kirjata vahvistamattomia teknisiä turvallisuusväitteitä.'
    ]
  },
  {
    title: '9. Rekisteröidyn oikeudet',
    paragraphs: [
      'Rekisteröidyllä on sovellettavan lain edellytyksin oikeus saada tietoa käsittelystä, tutustua tietoihinsa, vaatia epätarkkojen tietojen oikaisua ja tietojen poistamista, rajoittaa käsittelyä, vastustaa oikeutettuun etuun perustuvaa käsittelyä sekä saada tietyissä tapauksissa tiedot siirrettyä. Suoramarkkinointia voi vastustaa milloin tahansa ilman erillistä perustelua.',
      'Pyynnöt lähetetään osoitteeseen visualjambo@gmail.com. Henkilöllisyys voidaan varmistaa suhteellisin keinoin. Pyyntöihin vastataan lähtökohtaisesti kuukauden kuluessa GDPR:n mukaisesti. Rekisteröity voi tehdä valituksen tietosuojavaltuutetun toimistolle: tietosuoja.fi.'
    ]
  },
  {
    title: '10. Asiakkaidemme sivustojen henkilötiedot',
    paragraphs: [
      'Putkikasvu on itsenäinen rekisterinpitäjä omissa tarjous-, yhteydenotto- ja asiakkuustoiminnoissaan. Kun asiakas käyttää toimitettua verkkosivustoa ja päättää kävijöiden henkilötietojen keräämisestä, asiakas vastaa näistä käsittelyn tarkoituksista ja oikeusperusteista rekisterinpitäjänä.',
      'Jos Putkikasvu pääsee ylläpidossa asiakkaan kävijätietoihin, lomakeviesteihin tai henkilötietoihin asiakkaan lukuun, osapuolten on määriteltävä roolit ja tehtävä tarvittaessa kirjallinen GDPR 28 artiklan mukainen käsittelysopimus ennen työn aloittamista. Asiakkaan oman sivuston tietosuojaselostetta ei korvata tällä Putkikasvun selosteella.'
    ]
  },
  {
    title: '11. Evästeet ja automaattinen päätöksenteko',
    paragraphs: [
      'Putkikasvun tarkasteltu sivustolähdekoodi ei sisällä erillistä markkinointianalytiikkaa tai evästebanneria. Tuotantoalustan mahdolliset tekniset evästeet ja lokit on vielä tarkistettava. Jos käyttöön otetaan muita kuin välttämättömiä evästeitä tai vastaavia tunnisteita, niitä ei aseteta ennen lain edellyttämää informointia ja suostumusta.',
      'Tällä staattisella sivustolla ei tehdä rekisteröityyn kohdistuvia GDPR 22 artiklassa tarkoitettuja yksinomaan automaattiseen käsittelyyn perustuvia päätöksiä.'
    ]
  },
  {
    title: '12. Selosteen muuttaminen',
    paragraphs: [
      'Seloste päivitetään, kun käytetyt käsittelytavat tai palveluntarjoajat muuttuvat. Merkittävistä muutoksista informoidaan rekisteröityjä soveltuvan lain edellyttämällä tavalla.'
    ]
  }
];

export default function Privacy() {
  return <><header className="nav"><div className="wrap"><BrandLogo /><Link href="/">Etusivu →</Link></div></header>
    <main id="main-content" tabIndex={-1} className="wrap legal">
      <p className="eyebrow eyebrow-on-light">Henkilötiedot</p>
      <h1>Tietosuojaseloste</h1>
      <p>Hyväksyttävä luonnos v1.2 · 22.10.2026</p>
      <p className="warning"><strong>Käsittelykartta ei ole vielä hyväksytty:</strong> yritysosoite, Gmail-tilin sopimustyyppi, Vercelin todelliset käsittelytiedot ja siirrot sekä säilytys-, poistamis- ja tuotantoevästekäytännöt on todennettava. Suunnitellut säilytysajat eivät ole osoitus tehdyistä poistoista. Maksu- ja lomaketoiminnot eivät ole käytössä.</p>
      {sections.map(({title,paragraphs})=><section key={title}><h2>{title}</h2>{paragraphs.map(p=><p key={p}>{p}</p>)}</section>)}
    </main></>;
}
