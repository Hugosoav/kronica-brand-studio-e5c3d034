import Layout from "@/components/Layout";
import InfiniteHero from "@/components/ui/infinite-hero";
import ProjectShowcase from "@/components/ProjectShowcase";
import PageTransition from "@/components/PageTransition";

const Index = () => {
  return (
    <PageTransition>
      <Layout>
        {/* SEO */}
        <title>Kronica — Marcas no Tempo</title>
        <meta name="description" content="Construímos marcas. Porque marcas são moldadas pelo tempo. A Kronica une estratégia e design para criar identidades que evoluem com os negócios." />

        {/* Hero Section */}
        <InfiniteHero
          title="MARCAS NO TEMPO"
          subtitle="Kronica Studio"
        />

        {/* Projects Showcase */}
        <ProjectShowcase />
      </Layout>
    </PageTransition>
  );
};

export default Index;
