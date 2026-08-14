// Pós-build: gera um index.html por rota com <title>/meta/OG corretos já
// presentes no HTML estático (sem depender de JavaScript). Isso garante que
// crawlers que não executam JS — como o bot de pré-visualização de link do
// WhatsApp, Facebook e LinkedIn — vejam o título e a descrição corretos de
// cada página ao compartilhar um link, e não apenas os dados da home.
//
// O bundle React continua sendo carregado normalmente e assume a navegação
// client-side assim que o JS executa (o componente <Seo> mantém os mesmos
// dados em `src/data/pagesSeo.ts`, então não há divergência).
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pagesSeo } from "../src/data/pagesSeo.ts";
import { company } from "../src/config/company.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");

function withMeta(html, { path: routePath, title, description }) {
  const url = `${company.url}${routePath}`;

  let out = html;
  out = out.replace(/<title>.*?<\/title>/s, `<title>${title}</title>`);
  out = out.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/>/s,
    `<meta name="description" content="${description}" />`,
  );
  out = out.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${url}" />`);
  out = out.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`);
  out = out.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/>/s,
    `<meta property="og:description" content="${description}" />`,
  );
  out = out.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${url}" />`);
  out = out.replace(
    /<meta name="twitter:title" content=".*?" \/>/,
    `<meta name="twitter:title" content="${title}" />`,
  );
  out = out.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/>/s,
    `<meta name="twitter:description" content="${description}" />`,
  );
  return out;
}

const template = await readFile(path.join(distDir, "index.html"), "utf-8");

for (const page of Object.values(pagesSeo)) {
  const html = withMeta(template, page);

  if (page.path === "/") {
    await writeFile(path.join(distDir, "index.html"), html, "utf-8");
    continue;
  }

  const routeDir = path.join(distDir, page.path.replace(/^\//, ""));
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, "index.html"), html, "utf-8");
}

console.log(`SEO estático gerado para ${Object.keys(pagesSeo).length} rotas.`);
