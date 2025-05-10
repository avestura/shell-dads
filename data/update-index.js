import { launch } from 'puppeteer';
import fs from "fs"

(async () => {
    const browser = await launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.goto('https://xlinux.nist.gov/dads/ui.html', { waitUntil: 'domcontentloaded' });

    const termLinks = await page.$$eval('a', anchors =>
        anchors
            .filter(a => a.href.includes('/dads/HTML/'))
            .map(a => ({
                href: a.href,
                text: a.textContent.trim()
            }))
    );

    console.log(`✅ found ${termLinks.length} links`)

    const uniqueLinks = Array.from(
        new Map(termLinks.map(({ href, text }) => [href.match(/[^/]+$/)[0], { href, text }])).values()
    );

    console.log(`ℹ️ among them, ${uniqueLinks.length} are unique`)

    const results = {};

    for (const { href, text } of uniqueLinks) {
        console.log(`⬇️ fetching '${href}'...`)
        try {
            await page.goto(href, { waitUntil: 'domcontentloaded' });

            const definition = await page.evaluate(() => {
                const paragraphs = Array.from(document.querySelectorAll('p'));
                let definition = null;
                let alsoKnownAs = null;

                const contentParas = paragraphs.filter(p => {
                    const txt = p.textContent.trim();
                    return txt.startsWith("Definition:")
                });

                if (contentParas.length > 0) {
                    definition = contentParas[0].textContent.trim().replace("Definition:", "").trim();
                }

                const akaParams = paragraphs.filter(p => {
                    const txt = p.textContent.trim();
                    return txt.startsWith("Also known as")
                });

                if (akaParams.length > 0) {
                    alsoKnownAs = akaParams[0].textContent.trim().replace("Also known as", "").trim();
                }

                return { definition, alsoKnownAs };
            });

            // if(definition.alsoKnownAs) {
            //     console.log(`🔍 found definition (aka ${definition.alsoKnownAs}): ${definition.definition}`)
            // } else {
            //     console.log(`🔍 found definition: ${definition.definition}`)
            // }

            console.log(`🔍 text: ${text}, def: ${definition.definition ? '✅' : '❌'}, aka: ${definition.alsoKnownAs ? '✅' : '❌'}`)

            results[text] = { ...definition, text: text };
        } catch (e) {
            console.error(`Failed to fetch ${text}: ${e.message}`);
        }
        fs.writeFileSync("dads.json", JSON.stringify(results, null, 2))
    }

    fs.writeFileSync("dads.json", JSON.stringify(results, null, 2))

    console.log(JSON.stringify(results, null, 2));

    await browser.close();
})();
