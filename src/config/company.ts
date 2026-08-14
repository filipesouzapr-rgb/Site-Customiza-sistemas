/**
 * Dados centrais da empresa.
 * Altere os valores abaixo para atualizar as informações exibidas no site
 * (rodapé, botão de WhatsApp, links de contato, SEO, etc.).
 */
export const company = {
  name: "Customiza Sistemas",
  shortName: "Customiza",
  slogan: "Soluções sob medida para o seu negócio.",
  domain: "customizasistemas.com.br",
  url: "https://customizasistemas.com.br",

  // Preencha com o número no formato internacional, ex: "5511999999999"
  whatsapp: "5531994526816",
  email: "customizasistemas@gmail.com",
  instagram: "@customizasistemas",
  linkedin: "",

  // Endereço ainda não informado — deixar em branco até ser fornecido.
  address: "",
};

export const whatsappLink = company.whatsapp
  ? `https://wa.me/${company.whatsapp}`
  : "";

// Aceita tanto "@usuario" quanto "usuario" ou uma URL completa em `instagram`.
export const instagramLink = company.instagram
  ? company.instagram.startsWith("http")
    ? company.instagram
    : `https://instagram.com/${company.instagram.replace(/^@/, "")}`
  : "";
