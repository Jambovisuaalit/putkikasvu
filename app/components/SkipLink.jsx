"use client";
export default function SkipLink() {
  function focusMain() {
    // Native hash navigation remains functional before hydration.
    // Set keyboard focus reliably after React hydration as well.
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }
  return <a className="skip-link" href="#main-content" onClick={focusMain}>Siirry sisältöön</a>;
}
