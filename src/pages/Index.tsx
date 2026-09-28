import Layout from "@/components/Layout";
import InfiniteHero from "@/components/ui/infinite-hero";
import ProjectShowcase from "@/components/ProjectShowcase";
import PageTransition from "@/components/PageTransition";
import { useLocale } from "@/hooks/use-locale";

const Index = () => {
  const { t } = useLocale();
  return (
    <PageTransition>
      <Layout>
        <title>Kronica — Marcas no Tempo</title>
        <meta name="description" content="Construímos marcas. Porque marcas são moldadas pelo tempo. A Kronica une estratégia e design para criar identidades que evoluem com os negócios." />
        <InfiniteHero title={t.hero.title} subtitle={t.hero.subtitle} />
        <ProjectShowcase />
      </Layout>
    </PageTransition>
  );
};

export default Index;
