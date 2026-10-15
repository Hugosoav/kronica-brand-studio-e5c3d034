import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { trackEvent } from "@/lib/meta-pixel";
import { translations } from "@/lib/i18n";

// Chave pública do Web3Forms — substitua pela sua chave gerada em https://web3forms.com
const WEB3FORMS_ACCESS_KEY = "dfd19efc-95a8-4788-8b0f-3cee19c6f585";

interface FormState {
  nome: string;
  email: string;
  whatsapp: string;
  canal: string;
  pais: string;
  empresa: string;
  instagram: string;
  tempoDeMercado: string;
  numeroFuncionarios: string;
  produtosServicos: string;
  faturamentoMensal: string;
  prazo: string;
}

const initialState: FormState = {
  nome: "",
  email: "",
  whatsapp: "",
  canal: "",
  pais: "",
  empresa: "",
  instagram: "",
  tempoDeMercado: "",
  numeroFuncionarios: "",
  produtosServicos: "",
  faturamentoMensal: "",
  prazo: "",
};

type Option = { readonly value: string; readonly label: string };

// Perguntas de seleção: todas obrigatórias
const SELECT_FIELDS = [
  "canal",
  "pais",
  "tempoDeMercado",
  "numeroFuncionarios",
  "faturamentoMensal",
  "prazo",
] as const;
type SelectField = (typeof SELECT_FIELDS)[number];

// O e-mail sempre chega em português, com o mesmo texto da opção que a pessoa viu
const pt = translations.pt.contato.fields;
const labelPt = (options: readonly Option[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value;
const orNotInformed = (value: string) => value.trim() || "Não informado";

const QualificationForm = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<SelectField, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, locale } = useLocale();
  const f = t.contato.fields;
  const ct = t.contato;
  const { toast } = useToast();

  const handleChange = (field: keyof FormState, value: string) => {
    if (field in errors) setErrors((prev) => ({ ...prev, [field]: false }));
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Ao trocar o país, a moeda do faturamento muda; limpa a resposta anterior
      if (field === "pais" && prev.pais !== value) next.faturamentoMensal = "";
      return next;
    });
  };

  // Inglês: sempre em dólar. Português: real, ou dólar se a empresa atua fora do Brasil
  // Ao trocar o idioma, a moeda pode mudar; limpa o faturamento já escolhido
  useEffect(() => {
    setForm((prev) => ({ ...prev, faturamentoMensal: "" }));
  }, [locale]);

  const usaDolar = locale === "en" || form.pais === "eua" || form.pais === "outro";
  const faturamentoOptions = usaDolar ? f.faturamentoOptionsUsd : f.faturamentoOptions;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Confere as perguntas de seleção antes de enviar
    const missing = SELECT_FIELDS.filter((field) => !form[field]);
    if (missing.length > 0) {
      setErrors(Object.fromEntries(missing.map((field) => [field, true])));
      const first = document.getElementById(missing[0]);
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      first?.focus({ preventScroll: true });
      return;
    }

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
          "whatsapp ou telegram": form.whatsapp,
          "canal preferido": labelPt(pt.canalOptions, form.canal),
          "país de atuação": labelPt(pt.paisOptions, form.pais),
          empresa: form.empresa,
          instagram: orNotInformed(form.instagram),
          "tempo de mercado": labelPt(pt.tempoOptions, form.tempoDeMercado),
          "número de funcionários": labelPt(pt.funcionariosOptions, form.numeroFuncionarios),
          "produtos ou serviços": form.produtosServicos,
          "faturamento mensal": labelPt(
            usaDolar ? pt.faturamentoOptionsUsd : pt.faturamentoOptions,
            form.faturamentoMensal,
          ),
          "prazo desejado": labelPt(pt.prazoOptions, form.prazo),
          "idioma do site": locale === "en" ? "Inglês" : "Português",
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Pixel da Meta: formulário enviado com sucesso
        trackEvent("Lead");
        toast({
          title: ct.successTitle,
          description: ct.successDesc,
        });
        setForm(initialState);
        setErrors({});
      } else {
        throw new Error(result.message || "Erro ao enviar formulário");
      }
    } catch (error) {
      toast({
        title: ct.errorTitle,
        description: ct.errorDesc,
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
            {f.nome}
          </Label>
          <Input id="nome" required value={form.nome} onChange={(e) => handleChange("nome", e.target.value)} placeholder={f.nome} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {f.email}
          </Label>
          <Input id="email" type="email" required value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="seu@email.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="whatsapp" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {f.whatsapp}
          </Label>
          <Input id="whatsapp" required value={form.whatsapp} onChange={(e) => handleChange("whatsapp", e.target.value)} placeholder={f.whatsappPlaceholder} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="empresa" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {f.empresa}
          </Label>
          <Input id="empresa" required value={form.empresa} onChange={(e) => handleChange("empresa", e.target.value)} placeholder={f.empresa} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="canal" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {f.canal}
          </Label>
          <Select value={form.canal} onValueChange={(value) => handleChange("canal", value)}>
            <SelectTrigger id="canal" aria-invalid={!!errors.canal} className={errors.canal ? "border-destructive" : undefined}>
              <SelectValue placeholder={f.selectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {f.canalOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.canal && <p className="text-xs text-destructive">{f.selectRequired}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pais" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {f.pais}
          </Label>
          <Select value={form.pais} onValueChange={(value) => handleChange("pais", value)}>
            <SelectTrigger id="pais" aria-invalid={!!errors.pais} className={errors.pais ? "border-destructive" : undefined}>
              <SelectValue placeholder={f.selectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {f.paisOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.pais && <p className="text-xs text-destructive">{f.selectRequired}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {f.instagram}
        </Label>
        <Input id="instagram" value={form.instagram} onChange={(e) => handleChange("instagram", e.target.value)} placeholder="@suaempresa" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="tempoDeMercado" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {f.tempoDeMercado}
          </Label>
          <Select value={form.tempoDeMercado} onValueChange={(value) => handleChange("tempoDeMercado", value)}>
            <SelectTrigger id="tempoDeMercado" aria-invalid={!!errors.tempoDeMercado} className={errors.tempoDeMercado ? "border-destructive" : undefined}>
              <SelectValue placeholder={f.selectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {f.tempoOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tempoDeMercado && <p className="text-xs text-destructive">{f.selectRequired}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="numeroFuncionarios" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {f.numeroFuncionarios}
          </Label>
          <Select value={form.numeroFuncionarios} onValueChange={(value) => handleChange("numeroFuncionarios", value)}>
            <SelectTrigger id="numeroFuncionarios" aria-invalid={!!errors.numeroFuncionarios} className={errors.numeroFuncionarios ? "border-destructive" : undefined}>
              <SelectValue placeholder={f.selectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {f.funcionariosOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.numeroFuncionarios && <p className="text-xs text-destructive">{f.selectRequired}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="produtosServicos" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {f.produtosServicos}
        </Label>
        <Textarea
          id="produtosServicos"
          required
          value={form.produtosServicos}
          onChange={(e) => handleChange("produtosServicos", e.target.value)}
          placeholder={f.produtosPlaceholder}
          className="min-h-[80px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="faturamentoMensal" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {f.faturamentoMensal}
          </Label>
          <Select value={form.faturamentoMensal} onValueChange={(value) => handleChange("faturamentoMensal", value)}>
            <SelectTrigger id="faturamentoMensal" aria-invalid={!!errors.faturamentoMensal} className={errors.faturamentoMensal ? "border-destructive" : undefined}>
              <SelectValue placeholder={f.selectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {faturamentoOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.faturamentoMensal && <p className="text-xs text-destructive">{f.selectRequired}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="prazo" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {f.prazo}
          </Label>
          <Select value={form.prazo} onValueChange={(value) => handleChange("prazo", value)}>
            <SelectTrigger id="prazo" aria-invalid={!!errors.prazo} className={errors.prazo ? "border-destructive" : undefined}>
              <SelectValue placeholder={f.selectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {f.prazoOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.prazo && <p className="text-xs text-destructive">{f.selectRequired}</p>}
        </div>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            {ct.sending}
          </>
        ) : (
          ct.send
        )}
      </Button>
    </form>
  );
};

export default QualificationForm;
