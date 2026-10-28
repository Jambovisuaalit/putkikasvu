import Script from 'next/script';
import html from '../content/home.json';
export default function Home() {
 return <><div dangerouslySetInnerHTML={{ __html: html }} /><Script src="/app.js" strategy="afterInteractive" /></>;
}
