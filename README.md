# Customiza Sistemas — Site Institucional

Site institucional da Customiza Sistemas, empresa de tecnologia especializada
no desenvolvimento de sistemas personalizados, automações, dashboards,
integrações e digitalização de processos para pequenas e médias empresas.

## Tecnologias

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Lucide React](https://lucide.dev/) (ícones)

## Como instalar

```bash
npm install
```

## Como executar em desenvolvimento

```bash
npm run dev
```

O site ficará disponível em `http://localhost:5173`.

## Como gerar o build de produção

```bash
npm run build
```

Os arquivos otimizados são gerados na pasta `dist/`. Para pré-visualizar o
build de produção localmente:

```bash
npm run preview
```

## Estrutura do projeto

```text
scripts/
└── generate-static-seo.mjs  # Pós-build: gera o <head> correto por rota

src/
├── assets/          # Logo e imagens
├── components/       # Componentes reutilizáveis (Header, Footer, Button, etc.)
├── config/
│   └── company.ts    # Dados centrais da empresa (contato, redes sociais)
├── data/              # Conteúdo estruturado das páginas (serviços, diferenciais,
│                      # pagesSeo.ts, etc.)
├── lib/
│   └── contactApi.ts  # Envio do formulário de contato (ver seção abaixo)
├── pages/             # Páginas: Home, Servicos, Solucoes, Sobre, Contato
├── App.tsx            # Roteamento
├── main.tsx
└── index.css          # Tailwind + paleta de cores da marca
```

## Como alterar os dados da empresa

Todos os dados de contato ficam centralizados em
[`src/config/company.ts`](src/config/company.ts):

```ts
export const company = {
  name: "Customiza Sistemas",
  slogan: "Soluções sob medida para o seu negócio.",
  domain: "customizasistemas.com.br",
  whatsapp: "",   // formato internacional, ex: "5511999999999"
  email: "",
  instagram: "",  // "@usuario", "usuario" ou URL completa
  linkedin: "",   // URL completa
  address: "",
};
```

Enquanto um campo estiver vazio, a seção correspondente fica oculta
automaticamente (botão flutuante de WhatsApp, ícones de redes sociais no
rodapé, endereço, etc.).

## Onde alterar a logo

A logo fica em [`src/assets/logo.png`](src/assets/logo.png) e é usada no
`Header` e no `Footer`. Para trocar, basta substituir o arquivo (mantendo o
mesmo nome) ou atualizar o import em `src/components/Header.tsx` e
`src/components/Footer.tsx`.

O favicon e os ícones de app ficam em `public/` (`favicon-16x16.png`,
`favicon-32x32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`),
gerados a partir do símbolo da logo.

## Como configurar o WhatsApp

Edite `whatsapp` em `src/config/company.ts` com o número no formato
internacional, sem espaços ou símbolos (ex: `"5511999999999"`). O botão
flutuante de WhatsApp aparece automaticamente assim que o número for
preenchido.

## Como configurar o e-mail

Edite `email` em `src/config/company.ts`. O e-mail passa a aparecer no
rodapé e na página de contato.

## Formulário de contato

O formulário em `/contato` ainda não está conectado a um backend. O envio é
simulado em [`src/lib/contactApi.ts`](src/lib/contactApi.ts), que já está
preparado para ser substituído por uma chamada real a uma API, e-mail,
CRM ou WhatsApp — basta editar a função `submitContactRequest`.

## SEO

Cada página define seu próprio título e meta description a partir de uma
única fonte de dados, [`src/data/pagesSeo.ts`](src/data/pagesSeo.ts), consumida
pelo componente `Seo` (`src/components/Seo.tsx`) em tempo de execução.

Como o site é uma SPA (sem servidor/SSR), o `npm run build` roda
automaticamente um passo extra
([`scripts/generate-static-seo.mjs`](scripts/generate-static-seo.mjs)) que
gera um `index.html` próprio por rota dentro de `dist/` (`dist/servicos/index.html`,
`dist/contato/index.html`, etc.), já com o `<title>`, meta description e tags
Open Graph corretos. Isso garante que bots que não executam JavaScript — como
o de pré-visualização de link do WhatsApp, Facebook e LinkedIn — mostrem o
título e a descrição certos de cada página ao compartilhar um link, e não
apenas os da home.

**Importante ao hospedar:** para essas páginas por rota funcionarem, o
servidor precisa resolver `/servicos` para `dist/servicos/index.html`
automaticamente (comportamento padrão da grande maioria dos hosts estáticos —
Vercel, Netlify, Cloudflare Pages, Apache, Nginx). Se o domínio final for
diferente de `customizasistemas.com.br`, atualize `url` em
`src/config/company.ts`, além de `public/robots.txt` e `public/sitemap.xml`.

A imagem usada nas prévias de compartilhamento (Open Graph) fica em
`public/og-image.png` (1200×630px). Para trocá-la, gere uma nova imagem no
mesmo tamanho e substitua o arquivo.

Cabeçalhos HTTP básicos de segurança (`X-Frame-Options`, `X-Content-Type-Options`,
etc.) estão em `public/_headers`, no formato aceito por Netlify e Cloudflare
Pages. Se a hospedagem final for outra (ex: Apache/cPanel), configure os
mesmos cabeçalhos via `.htaccess` ou painel do provedor.
