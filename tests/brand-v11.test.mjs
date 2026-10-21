import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const get = (file) => readFileSync(new URL("../" + file, import.meta.url));
const layout = get("app/layout.jsx").toString("utf8");
const style = get("app/style.css").toString("utf8");
const page = get("app/page.jsx").toString("utf8");
const logo = get("app/components/BrandLogo.jsx").toString("utf8");

function assertPng(path, width, height) {
  const data = get(path);
  assert.equal(data.toString("hex", 0, 8), "89504e470d0a1a0a");
  assert.equal(data.readUInt32BE(16), width);
  assert.equal(data.readUInt32BE(20), height);
}

test("Canva v1.1 wordmark and original P-symbol included as local valid PNG files", () => {
  assertPng("public/brand/putkikasvu-wordmark-white-v1.1.png", 500, 142);
  assertPng("public/brand/putkikasvu-symbol-v1.1.png", 192, 187);
});
test("Visible header uses official wordmark instead of placeholder text", () => {
  assert.match(logo, /putkikasvu-wordmark-white-v1\.1\.png/);
  assert.match(page, /<BrandLogo\s*\/>/);
  assert.doesNotMatch(page, /className="mark">P/);
});
test("Brand colors exactly match the Canva v1.1 five-token palette", () => {
  for (const hex of ["#061827","#123C5A","#08B8AD","#EAF2F4","#FFFFFF"]) {
    assert.ok(style.toUpperCase().includes(hex.toUpperCase()), hex);
  }
});
test("Manrope headings, Inter body, and official P-symbol icon configured", () => {
  assert.match(layout, /Manrope/);
  assert.match(layout, /Inter/);
  assert.match(layout, /putkikasvu-symbol-v1\.1\.png/);
  assert.match(style, /--font-manrope/);
  assert.match(style, /--font-inter/);
});
test("Brand update does not enable payment links or storage", () => {
  assert.doesNotMatch(page, /checkout\.revolut\.com/);
  assert.doesNotMatch(page, /supabase\.co/);
});
