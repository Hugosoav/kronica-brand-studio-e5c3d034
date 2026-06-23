import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Chave pública do Web3Forms — substitua pela sua chave gerada em https://web3forms.com
const WEB3FORMS_ACCESS_KEY = "dfd19efc-95a8-4788-8b0f-3cee19c6f585";

interface FormState {
  nome: string;
  email: string;
  whatsapp: string;
  empresa: string;
  instagram: string;
  tempoDeMercado: string;
  numeroFuncionarios: string;
  produtosServicos: string;
  problema: string;
  faturamentoMensal: string;
  faixaInvestimento: string;
  prazo: string;
}

const initialState: FormState = {
  nome: "",
  email: "",
  whatsapp: "",
  empresa: "",
  instagram: "",
  tempoDeMercado: "",
  numeroFuncionarios: "",
  produtosServicos: "",
  problema: "",
  faturamentoMensal: "",
  faixaInvestimento: "",
  prazo: "",
};

const QualificationForm = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Novo lead — ${form.empresa || form.nome}`,
          from_name: "Site Kronica",
          nome: form.nome,
          email: form.email,
          whatsapp: form.whatsapp,
          empresa: form.empresa,
          instagram: form.instagram,
          "tempo de mercado": form.tempoDeMercado,
          "número de funcionários": form.numeroFuncionarios,
          "produtos ou serviços": form.produtosServicos,
          "empresa e desafios": form.problema,
          "faturamento mensal": form.faturamentoMensal,
          "faixa de investimento": form.faixaInvestimento,
          "prazo desejado": form.prazo,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Recebemos seu projeto!",
          description: "Vamos analisar e retornar em breve com os próximos passos.",
        });
        setForm(initialState);
      } else {
        throw new Error(result.message || "Erro ao enviar formulário");
      }
    } catch (error) {
      toast({
        title: "Algo deu errado",
        description: "Não conseguimos enviar seu formulário. Tente novamente ou fale com a gente pelo WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Dados de contato */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nome" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Nome
          </Label>
          <Input
            id="nome"
            required
            value={form.nome}
            onChange={(e) => handleChange("nome", e.target.value)}
            placeholder="Seu nome"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="whatsapp" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            WhatsApp
          </Label>
          <Input
            id="whatsapp"
            required
            value={form.whatsapp}
            onChange={(e) => handleChange("whatsapp", e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="empresa" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Nome da empresa
          </Label>
          <Input
            id="empresa"
            required
            value={form.empresa}
            onChange={(e) => handleChange("empresa", e.target.value)}
            placeholder="Nome do seu negócio"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Instagram da sua empresa (se houver)
        </Label>
        <Input
          id="instagram"
          value={form.instagram}
          onChange={(e) => handleChange("instagram", e.target.value)}
          placeholder="@suaempresa"
        />
      </div>

      {/* Qualificação — sobre o negócio, não sobre orçamento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="tempoDeMercado" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Há quanto tempo sua empresa existe?
          </Label>
          <Select
            value={form.tempoDeMercado}
            onValueChange={(value) => handleChange("tempoDeMercado", value)}
          >
            <SelectTrigger id="tempoDeMercado">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ainda-nao-abri">Ainda não abri / vou abrir</SelectItem>
              <SelectItem value="menos-1-ano">Menos de 1 ano</SelectItem>
              <SelectItem value="1-3-anos">1 a 3 anos</SelectItem>
              <SelectItem value="3-10-anos">3 a 10 anos</SelectItem>
              <SelectItem value="mais-10-anos">Mais de 10 anos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="numeroFuncionarios" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Quantos funcionários sua empresa possui atualmente?
          </Label>
          <Select
            value={form.numeroFuncionarios}
            onValueChange={(value) => handleChange("numeroFuncionarios", value)}
          >
            <SelectTrigger id="numeroFuncionarios">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="so-eu">Só eu</SelectItem>
              <SelectItem value="2-5">2 a 5</SelectItem>
              <SelectItem value="6-15">6 a 15</SelectItem>
              <SelectItem value="16-50">16 a 50</SelectItem>
              <SelectItem value="mais-50">Mais de 50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="produtosServicos" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Quais produtos ou serviços sua empresa oferece?
        </Label>
        <Textarea
          id="produtosServicos"
          required
          value={form.produtosServicos}
          onChange={(e) => handleChange("produtosServicos", e.target.value)}
          placeholder="Ex: consultoria financeira para pequenas empresas, venda de equipamentos..."
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="problema" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Fale um pouco sobre a sua empresa e os principais desafios que enfrentam hoje
        </Label>
        <Textarea
          id="problema"
          required
          value={form.problema}
          onChange={(e) => handleChange("problema", e.target.value)}
          placeholder="Ex: somos uma clínica em expansão, mas nossa marca não transmite a credibilidade que temos hoje..."
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="faturamentoMensal" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Qual faturamento mensal da sua empresa?
          </Label>
          <Select
            value={form.faturamentoMensal}
            onValueChange={(value) => handleChange("faturamentoMensal", value)}
          >
            <SelectTrigger id="faturamentoMensal">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ainda-nao-fatura">Ainda não fatura</SelectItem>
              <SelectItem value="ate-20k">Até R$ 20.000</SelectItem>
              <SelectItem value="20k-50k">R$ 20.000 a R$ 50.000</SelectItem>
              <SelectItem value="50k-150k">R$ 50.000 a R$ 150.000</SelectItem>
              <SelectItem value="mais-150k">Acima de R$ 150.000</SelectItem>
              <SelectItem value="prefiro-nao-informar">Prefiro não informar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="faixaInvestimento" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Faixa de investimento prevista
          </Label>
          <Select
            value={form.faixaInvestimento}
            onValueChange={(value) => handleChange("faixaInvestimento", value)}
          >
            <SelectTrigger id="faixaInvestimento">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ate-2k">Até R$ 2.000</SelectItem>
              <SelectItem value="2k-5k">R$ 2.000 a R$ 5.000</SelectItem>
              <SelectItem value="5k-10k">R$ 5.000 a R$ 10.000</SelectItem>
              <SelectItem value="mais-10k">Acima de R$ 10.000</SelectItem>
              <SelectItem value="nao-defini">Ainda não defini</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prazo" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Prazo desejado
        </Label>
        <Select
          value={form.prazo}
          onValueChange={(value) => handleChange("prazo", value)}
        >
          <SelectTrigger id="prazo">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="urgente">O quanto antes</SelectItem>
            <SelectItem value="1-mes">Dentro de 1 mês</SelectItem>
            <SelectItem value="1-3-meses">1 a 3 meses</SelectItem>
            <SelectItem value="sem-pressa">Sem prazo definido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar projeto"
        )}
      </Button>
    </form>
  );
};

export default QualificationForm;
