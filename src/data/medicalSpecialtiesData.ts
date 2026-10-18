/**
 * Base de Dados das Principais Especialidades Médicas do Brasil
 * Inclui "Acadêmico de Medicina / Internato" (com pautas de residência e plantão) e "Clínico Geral".
 * Mapeia pautas de alto engajamento, dúvidas frequentes de pacientes e temas de alto volume de buscas.
 */

export interface TrendingTopic {
  title: string;
  category: "viral" | "residencia" | "consultorio" | "mito";
  badge: string;
  growthIndicator?: string;
}

export interface MedicalSpecialty {
  id: string;
  name: string;
  iconName: string;
  description: string;
  trendingTopics: TrendingTopic[];
}

export const MEDICAL_SPECIALTIES: MedicalSpecialty[] = [
  {
    id: "academico_medicina",
    name: "Acadêmico de Medicina / Internato",
    iconName: "GraduationCap",
    description: "Provas de residência médica, ENARE, plantões de emergência e raciocínio clínico",
    trendingTopics: [
      { title: "Provas de Residência Médica & ENARE 2026: Questões mais recorrentes", category: "residencia", badge: "📚 Residência Médica", growthIndicator: "+42% interesse" },
      { title: "Manejo da Sepse no Plantão: Novo protocolo Surviving Sepsis", category: "residencia", badge: "🚨 Emergência / Plantão", growthIndicator: "+18% buscas" },
      { title: "ECG Descomplicado na Emergência: Supra, BAV e Arritmias", category: "residencia", badge: "⚡ Habilidade Prática", growthIndicator: "Alta Retenção" },
      { title: "Antibioticoterapia Empírica: Como não errar no pronto-socorro", category: "residencia", badge: "💊 Farmacologia Clínica", growthIndicator: "+24% buscas" },
      { title: "Interpretação Rápida de Gasometria Arterial em 4 Passos", category: "residencia", badge: "🩸 Raciocínio Diagnóstico", growthIndicator: "Top Salvo" },
      { title: "Distúrbios Hidroeletrolíticos Graves: Manejo seguro de Hiponatremia e Potássio", category: "residencia", badge: "⚠️ Conduta Crítica" },
      { title: "Suporte Avançado de Vida (ACLS): Algoritmos de PCR atualizados", category: "residencia", badge: "🫀 Terapia Intensiva" },
      { title: "Prescrição Hospitalar Segura para o Recém-Formado", category: "residencia", badge: "📝 Carreira Médica" },
    ],
  },
  {
    id: "clinico_geral",
    name: "Clínico Geral / Medicina de Família",
    iconName: "Stethoscope",
    description: "Medicina ambulatorial, prevenção primária, check-up e manejo integrado",
    trendingTopics: [
      { title: "Check-up Anual: O que realmente tem evidência vs. Excesso de Exames", category: "viral", badge: "🔥 Em Alta", growthIndicator: "+28% buscas" },
      { title: "Esteatose Hepática Subclínica: Por que TGO/TGP normais enganam", category: "viral", badge: "🔍 Prevenção Ativa", growthIndicator: "+35% buscas" },
      { title: "Hipertensão Silenciosa: Quando a pressão 13x8 já exige atenção endotelial", category: "consultorio", badge: "🩺 Dúvida Comum" },
      { title: "Fadiga Crônica e Cansaço Matinal: Como investigar além do estresse", category: "viral", badge: "💡 Viral no Insta", growthIndicator: "+50% interesse" },
      { title: "Polifarmácia no Idoso: Desprescrição segura de remédios para dormir e estômago", category: "consultorio", badge: "⚖️ Segurança" },
      { title: "Diabetes Tipo 2 Inicial: Estratégias de reversão precoce", category: "viral", badge: "📈 Tendência" },
      { title: "Rastreamento Oncológico: Novas idades de mamografia e colonoscopia", category: "consultorio", badge: "🛡️ Diretrizes" },
    ],
  },
  {
    id: "cardiologia",
    name: "Cardiologia & Longevidade",
    iconName: "HeartPulse",
    description: "Saúde cardiovascular, prevenção de infarto e biomarcadores avançados",
    trendingTopics: [
      { title: "Colesterol LDL e ApoB: Por que o colesterol 'normal' pode ser perigoso", category: "viral", badge: "🔥 Em Alta", growthIndicator: "+31% buscas" },
      { title: "Escore de Cálcio Coronariano (CAC): Quando a tomografia previne o infarto", category: "consultorio", badge: "🔬 Diagnóstico de Ponta" },
      { title: "Fibrilação Atrial Silenciosa: Palpitações sutis e o risco de AVC", category: "consultorio", badge: "⚠️ Alerta Clínico" },
      { title: "Pressão Arterial Noturna e MAPA 24h: O risco do 'Não-Dipper'", category: "consultorio", badge: "🩺 Consultório" },
      { title: "VO2 Máximo e Sobrevida Cardiovascular: O treino certo para longevidade", category: "viral", badge: "🏃 Longevidade Ativa" },
      { title: "Suplementação de Coenzima Q10 e Ômega-3: O que a ciência apoia", category: "mito", badge: "🧠 Mito vs Verdade" },
    ],
  },
  {
    id: "dermatologia",
    name: "Dermatologia & Tricologia",
    iconName: "Sparkles",
    description: "Saúde da pele, queda capilar e procedimentos com respaldo científico",
    trendingTopics: [
      { title: "Skincare Minimalista: Retinol, Vitamina C e Ácido Hialurônico sem exageros", category: "viral", badge: "🔥 Top Buscas", growthIndicator: "+45% buscas" },
      { title: "Queda de Cabelo Pós-Estresse (Eflúvio) vs. Calvície Genética: Como diferenciar", category: "consultorio", badge: "💇 Tricologia" },
      { title: "Filtro Solar e Luz Visível: O segredo para clarear Melasma resistente", category: "viral", badge: "☀️ Dores de Pacientes" },
      { title: "Bioestimuladores de Colágeno e Exossomos: Promessas vs. Realidade clínica", category: "mito", badge: "⚖️ Análise Crítica" },
      { title: "Pintas e Sinais Suspeitos: O mnemônico ABCDE do Melanoma", category: "consultorio", badge: "🩺 Rastreio Precoce" },
    ],
  },
  {
    id: "ginecologia_obstetricia",
    name: "Ginecologia, Obstetrícia & Climatério",
    iconName: "User",
    description: "Saúde da mulher, climatério, fertilidade e modulação hormonal ética",
    trendingTopics: [
      { title: "Terapia de Reposição Hormonal (TRH): A janela de oportunidade segura", category: "viral", badge: "🔥 Em Alta", growthIndicator: "+62% interesse" },
      { title: "SOP (Síndrome dos Ovários Policísticos): Não é só sobre menstruação irregular", category: "viral", badge: "💡 Muito Compartilhado" },
      { title: "Endometriose Oculta: Por que tantas mulheres demoram 7 anos para o diagnóstico", category: "consultorio", badge: "⚠️ Alerta Feminino" },
      { title: "DIU de Cobre, Prata ou Mirena/Kyleena: Como escolher com critério", category: "consultorio", badge: "🩺 Dúvida de Consultório" },
      { title: "HPV e Vacina Nãoavalente: Proteção mesmo após o início da vida sexual", category: "consultorio", badge: "🛡️ Imunização" },
    ],
  },
  {
    id: "pediatria",
    name: "Pediatria & Neonatologia",
    iconName: "Baby",
    description: "Puericultura, sono infantil, imunização e neurodesenvolvimento",
    trendingTopics: [
      { title: "Bronquiolite e VSR: Como reconhecer sinais de cansaço respiratório em bebês", category: "consultorio", badge: "🚨 Alerta Pais", growthIndicator: "+22% buscas" },
      { title: "Telas e Celular na Primeira Infância: Impacto comprovado na fala e sono", category: "viral", badge: "🔥 Viral nos Pais" },
      { title: "Introdução Alimentar: BLW ou Papinhas? O posicionamento da SBP", category: "consultorio", badge: "🍼 Puericultura" },
      { title: "Febre Infantil sem Sintomas: Quando ir ao pronto-socorro e quando esperar", category: "consultorio", badge: "🩺 Orientação Segura" },
      { title: "Sinais Precoces de Autismo (TEA) no primeiro ano de vida", category: "viral", badge: "🧠 Neurodesenvolvimento" },
    ],
  },
  {
    id: "psiquiatria",
    name: "Psiquiatria & Saúde Mental",
    iconName: "Brain",
    description: "Transtornos de humor, neurociência, sono e farmacologia psiquiátrica",
    trendingTopics: [
      { title: "Ansiedade Generalizada vs. Pânico: Como a amígdala cerebral comanda a crise", category: "viral", badge: "🔥 Top Engajamento" },
      { title: "TDAH no Adulto: Por que tantos diagnósticos tardios agora?", category: "viral", badge: "💡 Super Em Alta", growthIndicator: "+54% buscas" },
      { title: "Desmame de Benzodiazepínicos (Clonazepam): Protocolo seguro e sem sofrimento", category: "consultorio", badge: "💊 Farmacologia" },
      { title: "Insônia Crônica e Higiene do Sono: Quebrando o ciclo do Zolpidem", category: "consultorio", badge: "🌙 Sono & Mente" },
      { title: "Burnout Médico e de Profissionais de Alta Performance: O esgotamento neuroquímico", category: "viral", badge: "🧠 Saúde Mental" },
    ],
  },
  {
    id: "endocrinologia",
    name: "Endocrinologia & Metabologia",
    iconName: "Activity",
    description: "Hormônios, diabetes, tireoide, obesidade e modulação metabólica",
    trendingTopics: [
      { title: "Semaglutida e Tirzepatida: Efeito rebote, perda muscular e o que fazer", category: "viral", badge: "🔥 Mais Procurado", growthIndicator: "+80% buscas" },
      { title: "Hipotireoidismo Subclínico: Quando dosar T3 livre e quando tratar TSH limítrofe", category: "consultorio", badge: "🔬 Tireoide" },
      { title: "Resistência Insulínica e HOMA-IR: O que a glicose de jejum normal esconde", category: "viral", badge: "📈 Prevenção" },
      { title: "Reposição de Testosterona (TRT): Mitos, indicações reais e riscos", category: "mito", badge: "⚖️ Ciência sem Tabu" },
      { title: "Cortisol Alto vs. 'Fadiga Adrenal': O que a medicina de fato reconhece", category: "mito", badge: "🧠 Desmistificação" },
    ],
  },
  {
    id: "ortopedia_esportiva",
    name: "Ortopedia & Medicina Esportiva",
    iconName: "Bone",
    description: "Saúde articular, lesões esportivas, coluna e longevidade muscular",
    trendingTopics: [
      { title: "Dor Lombar: Por que a hérnia de disco na ressonância nem sempre é a culpada", category: "viral", badge: "🔥 Desmistificação", growthIndicator: "+20% buscas" },
      { title: "Condromalácia Patelar e Dor no Joelho: Fortalecimento vs. Infiltração", category: "consultorio", badge: "🏃 Ortopedia Prática" },
      { title: "Creatina, Whey e Massa Muscular após os 40 Anos: O seguro de vida metabólico", category: "viral", badge: "💪 Longevidade" },
      { title: "Bursite e Tendinite no Ombro: O protocolo de reabilitação sem cirurgia", category: "consultorio", badge: "🩺 Tratamento Conservador" },
      { title: "Alongamento antes do treino previne lesão? O que diz a biomecânica", category: "mito", badge: "⚡ Mito Esportivo" },
    ],
  },
  {
    id: "gastroenterologia",
    name: "Gastroenterologia & Hepatologia",
    iconName: "Stomach",
    description: "Microbiota intestinal, refluxo, esteatose e saúde digestiva",
    trendingTopics: [
      { title: "SIBO e Disbiose Intestinal: Por que o estômago estufa após qualquer refeição", category: "viral", badge: "🔥 Viral no Insta", growthIndicator: "+48% buscas" },
      { title: "Omeprazol e Pantoprazol por Anos: Riscos reais e como fazer o desmame", category: "consultorio", badge: "💊 Farmaco-segurança" },
      { title: "Esteatose Hepática: O plano de reversão alimentar comprovado pela EASL", category: "consultorio", badge: "🥗 Hepatologia" },
      { title: "H. Pylori: Sintomas de alarme, erradicação e prevenção do câncer gástrico", category: "consultorio", badge: "🩺 Consulta Frequente" },
      { title: "Intolerância Alimentar vs. Alergia: Testes que funcionam e testes enganosos", category: "mito", badge: "🔍 Rigor Científico" },
    ],
  },
  {
    id: "neurologia",
    name: "Neurologia & Medicina do Sono",
    iconName: "Workflow",
    description: "Cefaleias, AVC, cognição, declínio de memória e neuroproteção",
    trendingTopics: [
      { title: "Enxaqueca não é só dor de cabeça: O papel dos anticorpos anti-CGRP", category: "consultorio", badge: "🧠 Terapia Moderna", growthIndicator: "+25% buscas" },
      { title: "Esquecimentos no Dia a Dia: Sobrecarga mental ou início de demência?", category: "viral", badge: "🔥 Preocupação Comum" },
      { title: "Apneia Obstrutiva do Sono: Ronco e o impacto no risco vascular e cognitivo", category: "consultorio", badge: "🌙 Sono & Cérebro" },
      { title: "Neuropatia Diabética e Formigamento nos Pés: Sinais iniciais reversíveis", category: "consultorio", badge: "🩺 Diagnóstico Inicial" },
      { title: "Ginkgo Biloba e Nootrópicos: Há evidência real de melhora de foco?", category: "mito", badge: "⚖️ Mito vs Fato" },
    ],
  },
  {
    id: "oftalmologia",
    name: "Oftalmologia",
    iconName: "Eye",
    description: "Saúde ocular, catarata, glaucoma e fadiga visual de telas",
    trendingTopics: [
      { title: "Olho Seco e Fadiga Visual de Telas: A regra 20-20-20 que alivia a vista", category: "viral", badge: "🔥 Pauta Comportamental" },
      { title: "Glaucoma: O ladrão silencioso da visão periférica que não causa dor", category: "consultorio", badge: "👁️ Prevenção Crítica" },
      { title: "Moscas Volantes e Flashes de Luz: Quando pode ser descolamento de retina", category: "consultorio", badge: "🚨 Alerta de Urgência" },
      { title: "Cirurgia Refrativa a Laser (LASIK/PRK): Quem realmente pode operar", category: "consultorio", badge: "🔍 Cirurgia Ocular" },
      { title: "Lentes com Filtro de Luz Azul: Funcionam mesmo ou é marketing?", category: "mito", badge: "🧠 Ciência Comprovada" },
    ],
  },
  {
    id: "urologia",
    name: "Urologia & Andrologia",
    iconName: "Shield",
    description: "Saúde do homem, cálculo renal, próstata e reposição androgênica",
    trendingTopics: [
      { title: "Cálculo Renal: Água com limão dissolve pedra? O que a bioquímica explica", category: "viral", badge: "🔥 Mitos Populares" },
      { title: "Hiperplasia Prostática Benigna (HPB): Jato fraco e levantar à noite", category: "consultorio", badge: "🩺 Consultório Urológico" },
      { title: "PSA e Toque Retal: Por que um exame NÃO substitui o outro", category: "consultorio", badge: "🛡️ Rastreio da Próstata" },
      { title: "Disfunção Erétil como Marcador de Risco Coronariano Oculto", category: "viral", badge: "💡 Conexão Vascular" },
    ],
  },
];

export const DEFAULT_SPECIALTY_ID = "academico_medicina";

export function getSpecialtyById(id: string): MedicalSpecialty {
  return (
    MEDICAL_SPECIALTIES.find((s) => s.id === id) ||
    MEDICAL_SPECIALTIES.find((s) => s.name.toLowerCase().includes(id.toLowerCase())) ||
    MEDICAL_SPECIALTIES[0]
  );
}
