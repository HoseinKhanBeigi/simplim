import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';

export async function POST(req: Request) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent('<h1>Hello, PDF!</h1>'); // Example HTML, replace with your content
  const buffer = await page.pdf();
  await browser.close();

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="document.pdf"',
    },
  });
}