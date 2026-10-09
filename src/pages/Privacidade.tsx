import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import RevealOnScroll from "@/components/RevealOnScroll";
import { useLocale } from "@/hooks/use-locale";
import { resetConsent } from "@/lib/meta-pixel";

type Secao = { titulo: string; paragrafos?: string[]; itens?: string[] };

const conteudo: Record<"pt" | "en", { titulo: string; atualizacao: string; botaoCookies: string; secoes: Secao[] }> = {
  pt: {
    titulo: "Política de Privacidade",
    atualizacao: "Última atualização: outubro de 2026",
    botaoCookies: "Alterar preferências de cookies",
    secoes: [
      {
        titulo: "Quem somos",
        paragrafos: [
          "Este site pertence ao Kronica Studio, conduzido por Hugo Soave. Para qualquer assunto sobre seus dados pessoais, fale com a gente pelo e-mail kronicastudio@gmail.com.",
        ],
      },
      {
        titulo: "Quais dados coletamos",
        paragrafos: ["Coletamos dados em duas situações:"],
        itens: [
          "Formulário de contato: nome, e-mail, WhatsApp ou Telegram, canal de contato preferido, país de atuação, nome e Instagram da empresa, tempo de existência, número de funcionários, produtos ou serviços oferecidos, faturamento mensal e prazo desejado.",
          "Navegação, somente se você aceitar os cookies: páginas visitadas, cliques no link de WhatsApp, envio do formulário e informações técnicas do navegador e do dispositivo, coletadas pelo Pixel da Meta.",
        ],
      },
      {
        titulo: "Para que usamos",
        itens: [
          "Responder ao seu contato, entender o seu projeto e preparar uma proposta.",
          "Medir as visitas ao site e o desempenho dos nossos anúncios no Instagram e no Facebook.",
        ],
      },
      {
        titulo: "Base legal",
        itens: [
          "Dados do formulário: procedimentos preliminares a um contrato, a pedido do próprio titular (art. 7º, V, da LGPD).",
          "Cookies do Pixel da Meta: consentimento (art. 7º, I, da LGPD), que você pode retirar a qualquer momento.",
        ],
      },
      {
        titulo: "Com quem compartilhamos",
        paragrafos: [
          "Não vendemos seus dados. Eles passam apenas pelos serviços necessários para o site funcionar, alguns com servidores fora do Brasil:",
        ],
        itens: [
          "Web3Forms: envio das respostas do formulário para o nosso e-mail.",
          "Meta Platforms: Pixel da Meta, somente se você aceitar os cookies.",
          "Vercel: hospedagem do site.",
          "Google Fonts: carregamento das fontes do site.",
        ],
      },
      {
        titulo: "Cookies",
        paragrafos: [
          "Os cookies do Pixel da Meta só são ativados se você clicar em \"Aceitar\" no aviso de cookies. Se recusar, o site funciona normalmente, sem esse rastreamento. Você pode mudar sua escolha a qualquer momento pelo botão abaixo.",
        ],
      },
      {
        titulo: "Por quanto tempo guardamos",
        paragrafos: [
          "Mantemos os dados do formulário pelo tempo necessário para responder ao seu contato e conduzir uma eventual negociação, e pelo período exigido por obrigações legais.",
        ],
      },
      {
        titulo: "Seus direitos",
        paragrafos: [
          "Você pode pedir a qualquer momento: confirmação de que tratamos seus dados, acesso, correção, exclusão, informação sobre com quem compartilhamos e a retirada do consentimento. Basta escrever para kronicastudio@gmail.com.",
        ],
      },
      {
        titulo: "Alterações nesta política",
        paragrafos: ["Podemos atualizar esta política. A data da última atualização fica sempre no topo desta página."],
      },
    ],
  },
  en: {
    titulo: "Privacy Policy",
    atualizacao: "Last updated: October 2026",
    botaoCookies: "Change cookie preferences",
    secoes: [
      {
        titulo: "Who we are",
        paragrafos: [
          "This website belongs to Kronica Studio, run by Hugo Soave. For any matter regarding your personal data, contact us at kronicastudio@gmail.com.",
        ],
      },
      {
        titulo: "What data we collect",
        paragrafos: ["We collect data in two situations:"],
        itens: [
          "Contact form: name, email, WhatsApp or Telegram, preferred contact channel, country of operation, company name and Instagram, company age, number of employees, products or services offered, monthly revenue and desired timeline.",
          "Browsing, only if you accept cookies: pages visited, clicks on the WhatsApp link, form submission and technical information about your browser and device, collected by the Meta Pixel.",
        ],
      },
      {
        titulo: "What we use it for",
        itens: [
          "To reply to your message, understand your project and prepare a proposal.",
          "To measure website visits and the performance of our ads on Instagram and Facebook.",
        ],
      },
      {
        titulo: "Legal basis",
        itens: [
          "Form data: steps prior to a contract, at the request of the data subject (Brazilian LGPD, art. 7, V).",
          "Meta Pixel cookies: consent (Brazilian LGPD, art. 7, I), which you can withdraw at any time.",
        ],
      },
      {
        titulo: "Who we share it with",
        paragrafos: [
          "We do not sell your data. It only goes through the services needed for the website to work, some with servers outside Brazil:",
        ],
        itens: [
          "Web3Forms: delivers form responses to our email.",
          "Meta Platforms: Meta Pixel, only if you accept cookies.",
          "Vercel: website hosting.",
          "Google Fonts: loads the website fonts.",
        ],
      },
      {
        titulo: "Cookies",
        paragrafos: [
          "Meta Pixel cookies are only activated if you click \"Accept\" on the cookie notice. If you decline, the website works normally, without this tracking. You can change your choice at any time with the button below.",
        ],
      },
      {
        titulo: "How long we keep it",
        paragrafos: [
          "We keep form data for as long as needed to reply to you and conduct any negotiation, and for the period required by legal obligations.",
        ],
      },
      {
        titulo: "Your rights",
        paragrafos: [
          "You may request at any time: confirmation that we process your data, access, correction, deletion, information about who we share it with, and withdrawal of consent. Just write to kronicastudio@gmail.com.",
        ],
      },
      {
        titulo: "Changes to this policy",
        paragrafos: ["We may update this policy. The date of the last update is always shown at the top of this page."],
      },
    ],
  },
};

const Privacidade = () => {
  const { locale } = useLocale();
  const c = conteudo[locale];

  return (
    <PageTransition>
      <Layout>
        <title>{`${c.titulo} | Kronica`}</title>
        <meta name="robots" content="noindex" />
        <section className="pt-12 md:pt-16 pb-24 md:pb-32">
          <div className="container mx-auto max-w-3xl">
            <RevealOnScroll>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight mb-4">{c.titulo}</h1>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-16">{c.atualizacao}</p>
            </RevealOnScroll>

            <div className="space-y-12">
              {c.secoes.map((s) => (
                <div key={s.titulo}>
                  <h2 className="text-xl md:text-2xl font-light mb-4">{s.titulo}</h2>
                  {s.paragrafos?.map((p) => (
                    <p key={p} className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">{p}</p>
                  ))}
                  {s.itens && (
                    <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                      {s.itens.map((i) => <li key={i}>{i}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={resetConsent}
              className="mt-16 inline-flex items-center px-8 py-3 rounded-full border border-foreground/30 text-sm text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background"
            >
              {c.botaoCookies}
            </button>
          </div>
        </section>
      </Layout>
    </PageTransition>
  );
};

export default Privacidade;
