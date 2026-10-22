import './style.css';
export const metadata={robots:{index:false,follow:false},title:'Yrityskohtainen LVI-luonnos'};
export default function Layout({children}){return <html lang="fi"><body><a href="#sisalto" className="skip">Siirry sisältöön</a>{children}</body></html>}
