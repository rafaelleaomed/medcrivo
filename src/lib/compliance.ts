/**
 * MedCrivo Studio - Motor de Conformidade Ética para médicos, dentistas e LGPD
 * Baseado nas referências oficiais exibidas em cada achado; é uma triagem automatizada, não um parecer jurídico.
 * Padrão Ponytail: Engenharia enxuta, determinística, rápida e auditável.
 */

export interface ComplianceRule {
  id: string;
  category: 
    | 'promessa_resultado'
    | 'identificacao_obrigatoria'
    | 'lgpd_dados_sensiveis'
    | 'exame_diagnostico_metadados'
    | 'sensacionalismo'
    | 'comercio_e_precos'
    | 'especialidade_rqe'
    | 'imagem_odontologica';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  pattern: RegExp;
  reason: string;
  legalReference: string;
  sourceUrl?: string;
  suggestionFn: (match: string) => string;
}

export interface AuditResult {
  score: number; // 0 a 100
  isApproved: boolean;
  infractions: {
    ruleId: string;
    category: string;
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    detectedText: string;
    reason: string;
    legalReference: string;
    sourceUrl?: string;
    suggestion: string;
  }[];
  sanitizedText: string;
}

export interface ComplianceAuditResult {
  isCompliant: boolean;
  score: number;
  issues?: string[];
  detectedTerms?: string[];
  suggestions?: string[];
  timestamp?: string;
  infractions?: AuditResult['infractions'];
  sanitizedText?: string;
}

export const GENERAL_HEALTH_RULES: ComplianceRule[] = [
  {
    id: 'LGPD-001-PII-PACIENTE',
    category: 'lgpd_dados_sensiveis',
    severity: 'CRITICAL',
    // Documentos: sem distinção de maiúsculas.
    pattern: /(CPF[:\s]*\d{3}\.\d{3}\.\d{3}-\d{2}|RG[:\s]*\d+|prontu[aá]rio[:\s]*\d+)/gi,
    reason: 'O texto expõe dados que podem identificar um paciente e exige revisão de privacidade antes da publicação.',
    legalReference: 'LGPD, arts. 5º, II, e 11',
    suggestionFn: () => 'paciente em acompanhamento clínico',
  },
  {
    id: 'LGPD-001-PII-PACIENTE',
    category: 'lgpd_dados_sensiveis',
    severity: 'CRITICAL',
    // Nome próprio depois de "paciente": sensível a maiúsculas (sem a flag i), senão "paciente sem autorização" vira nome.
    pattern: /[Pp]aciente[:\s]+[A-ZÀ-Ý][a-zà-ÿ]+(?:\s+(?:d[aeo]s?\s+)?[A-ZÀ-Ý][a-zà-ÿ]+)+/g,
    reason: 'O texto expõe dados que podem identificar um paciente e exige revisão de privacidade antes da publicação.',
    legalReference: 'LGPD, arts. 5º, II, e 11',
    suggestionFn: () => 'paciente em acompanhamento clínico',
  },
  {
    id: 'LGPD-002-METADADOS-EXAMES',
    category: 'exame_diagnostico_metadados',
    severity: 'CRITICAL',
    pattern: /(laudo\s+n[uú]mero|data\s+do\s+exame[:\s]*\d{2}\/\d{2}\/\d{4})/gi,
    reason: 'Exames não devem expor metadados institucionais ou datas que possam contribuir para reidentificar o paciente.',
    legalReference: 'LGPD, arts. 5º, II, e 11',
    suggestionFn: () => '[DADO INSTITUCIONAL HIGIENIZADO]',
  },
  {
    id: 'LGPD-002-METADADOS-EXAMES',
    category: 'exame_diagnostico_metadados',
    severity: 'CRITICAL',
    // Instituição nomeada (inicial maiúscula), para não pegar "procure o hospital mais próximo" ou "convênio médico".
    pattern: /([Hh]ospital\s+(?:d[aeo]s?\s+)?[A-ZÀ-Ý][\wÀ-ÿ]+|[Cc]onv[eê]nio(?::\s*|\s+)[A-ZÀ-Ý][\wÀ-ÿ]+)/g,
    reason: 'Exames não devem expor metadados institucionais ou datas que possam contribuir para reidentificar o paciente.',
    legalReference: 'LGPD, arts. 5º, II, e 11',
    suggestionFn: () => '[DADO INSTITUCIONAL HIGIENIZADO]',
  },
  {
    id: 'LGPD-003-RELATO-TEMPO-REAL',
    category: 'lgpd_dados_sensiveis',
    severity: 'CRITICAL',
    pattern: /(atendi hoje|caso de hoje no plant[aã]o|paciente que chegou hoje|veio ao meu consult[oó]rio hoje|acabei de atender|cirurgia que realizei hoje|operei hoje)/gi,
    reason: 'Relatos temporalmente situados elevam o risco de reidentificação indireta por cruzamento com data, local e contexto do atendimento.',
    legalReference: 'LGPD, arts. 5º, II, e 11',
    suggestionFn: () => 'Em situações clínicas observadas na prática profissional habitual',
  },
  {
    id: 'LGPD-004-EXAME-PRINT-TELA',
    category: 'exame_diagnostico_metadados',
    severity: 'CRITICAL',
    pattern: /(foto da tela|print do sistema|laudo em anexo|foto do exame|veja a tomografia dele|veja a resson[aâ]ncia dele|veja o raio-x dele)/gi,
    reason: 'Fotos de telas, laudos e exames podem conter dados ou metadados sensíveis; a mídia precisa de revisão e anonimização efetiva.',
    legalReference: 'LGPD, arts. 5º, II, e 11',
    suggestionFn: () => 'imagem diagnóstica ilustrativa, revisada e sem dados identificáveis',
  },
];

export const CFM_RULES: ComplianceRule[] = [
  {
    id: 'CFM-001-PROMESSA',
    category: 'promessa_resultado',
    severity: 'CRITICAL',
    pattern: /(resultado(s)? garantido(s)?|garantia de cura|cura definitiva|100%\s*(eficaz|garantido)|tratamento infal[ií]vel|sem chances de erro)/gi,
    reason: 'É expressamente vedado ao médico garantir resultados ou prometer cura de qualquer enfermidade.',
    legalReference: 'Resolução CFM nº 2.336/2023, Art. 11, II',
    suggestionFn: () => 'tratamento que auxilia significativamente na evolução clínica individual',
  },
  {
    id: 'CFM-002-SENSACIONALISMO-SUPERLATIVO',
    category: 'sensacionalismo',
    severity: 'CRITICAL',
    pattern: /(o melhor (m[eé]dico|cirurgi[aã]o|tratamento)|refer[eê]ncia absoluta|o [uú]nico capaz|l[ií]der incontest[aá]vel|tecnologia milagrosa)/gi,
    reason: 'Uso de adjetivos superlativos ou autopromoção desleal infringe as normas éticas de publicidade médica.',
    legalReference: 'Resolução CFM nº 2.336/2023, Art. 3º',
    suggestionFn: () => 'profissional dedicado com atuação na área',
  },

  {
    id: 'CFM-003-ESPECIALISTA-SEM-RQE',
    category: 'especialidade_rqe',
    severity: 'WARNING',
    pattern: /(p[oó]s-gradua(do|da|cao)|especializando em|estudos avan[cç]ados)/gi,
    reason: 'Médicos com pós-graduação lato sensu sem RQE devem obrigatoriamente veicular a expressão NÃO ESPECIALISTA.',
    legalReference: 'Resolução CFM nº 2.380/2024 e Res. 2.336/2023, Art. 5º',
    suggestionFn: (match) => `${match} (NÃO ESPECIALISTA)`,
  },

  {
    id: 'CFM-004-PROMOCAO-PRECO',
    category: 'comercio_e_precos',
    severity: 'WARNING',
    // "promoção" isolada; ignora "autopromoção" e o termo de saúde pública "promoção da saúde".
    pattern: /(\bpromo[cç][aã]o\b(?!\s+(?:da|de|à)\s+sa[uú]de)|desconto de \d+%|combo de procedimentos|pre[cç]o imperd[ií]vel|black friday)/gi,
    reason: 'A divulgação de valores de consulta é permitida pela Res. 2.336/2023, mas a mercantilização agressiva e combos promocionais continuam vedados.',
    legalReference: 'Resolução CFM nº 2.336/2023, Art. 9º',
    suggestionFn: () => 'informações sobre valores disponíveis mediante contato ético com a recepção',
  },

  {
    id: 'CFM-005-METODO-EXCLUSIVO',
    category: 'sensacionalismo',
    severity: 'CRITICAL',
    pattern: /(t[eé]cnica exclusiva minha|meu m[eé]todo pr[oó]prio de cura|inova[cç][aã]o que s[oó] eu fa[cç]o|m[eé]todo secreto)/gi,
    reason: 'É proibido anunciar método ou técnica exclusiva não consagrada no meio científico ou atribuir a si exclusividade de procedimento.',
    legalReference: 'Resolução CFM nº 2.336/2023, Art. 11, VII',
    suggestionFn: () => 'abordagem técnica baseada nas diretrizes clínicas da especialidade',
  },
];

const CFO_196_SOURCE = 'https://website.cfo.org.br/resolucao-cfo-196-2019/';

export const CFO_RULES: ComplianceRule[] = [
  {
    id: 'CFO-001-IMAGEM-DURANTE-PROCEDIMENTO',
    category: 'imagem_odontologica',
    severity: 'CRITICAL',
    pattern: /(passo\s+a\s+passo\s+(cir[uú]rgico|do\s+procedimento)|(?:foto|imagem|v[ií]deo)s?\s+(?:do\s+)?(?:durante|transcurso)\s+(?:da\s+|do\s+)?(?:cirurgia|procedimento|tratamento))/gi,
    reason: 'O texto sugere exposição de imagens durante o procedimento. O FAQ oficial do CFO informa que esse tipo de imagem permanece vedado fora de publicações científicas.',
    legalReference: 'Resolução CFO nº 196/2019 e Código de Ética Odontológica, art. 44, XII (FAQ oficial do CFO)',
    sourceUrl: CFO_196_SOURCE,
    suggestionFn: () => 'conteúdo educativo sem imagens do transcurso do procedimento',
  },
  {
    id: 'CFO-002-DIAGNOSTICO-RESULTADO-CONDICIONADO',
    category: 'imagem_odontologica',
    severity: 'WARNING',
    pattern: /(antes\s*(?:e|\/|x)\s*depois|imagens?\s+(?:do\s+)?diagn[oó]stico|imagens?\s+(?:do\s+)?resultado\s+final|resultado\s+final\s+(?:do|de)\s+tratamento)/gi,
    reason: 'A Resolução CFO nº 196/2019 não libera “antes e depois” de forma indiscriminada: a divulgação é condicionada ao tratamento realizado pelo próprio cirurgião-dentista; clínicas ou outras pessoas jurídicas não estão abrangidas.',
    legalReference: 'Resolução CFO nº 196/2019 (FAQ oficial do CFO: diagnóstico e resultado final)',
    sourceUrl: CFO_196_SOURCE,
    suggestionFn: () => 'confirme autoria do procedimento, autorização escrita do paciente e identificação do profissional com CRO',
  },
  {
    id: 'CFO-003-SELFIE-COM-PACIENTE',
    category: 'imagem_odontologica',
    severity: 'WARNING',
    pattern: /((?:selfie|autorretrato)\s+(?:com|ao\s+lado\s+d[oa])\s+(?:o\s+|a\s+|um\s+|uma\s+)?paciente)/gi,
    reason: 'Selfie do cirurgião-dentista com paciente requer autorização formal por escrito para o uso da imagem, segundo o esclarecimento oficial do CFO.',
    legalReference: 'Resolução CFO nº 196/2019 (FAQ oficial do CFO: autorização de uso de imagem)',
    sourceUrl: CFO_196_SOURCE,
    suggestionFn: () => 'publique somente após obter e arquivar autorização formal por escrito do paciente',
  },
];

export class HealthcareComplianceEngine {
  /**
   * Audita o texto completo da legenda, roteiro ou slide conforme a profissão informada.
   */
  public static audit(text: string, doctorMetadata?: { profession?: 'medico' | 'dentista'; hasRqe?: boolean; doctorName?: string; crm?: string }): AuditResult {
    const infractions: AuditResult['infractions'] = [];
    let sanitizedText = text;
    const profession = doctorMetadata?.profession ?? 'medico';
    const applicableRules = [
      ...GENERAL_HEALTH_RULES,
      ...(profession === 'dentista' ? CFO_RULES : CFM_RULES),
    ];

    for (const rule of applicableRules) {
      const matches = text.match(rule.pattern);
      if (matches) {
        for (const match of matches) {
          infractions.push({
            ruleId: rule.id,
            category: rule.category,
            severity: rule.severity,
            detectedText: match,
            reason: rule.reason,
            legalReference: rule.legalReference,
            sourceUrl: rule.sourceUrl,
            suggestion: rule.suggestionFn(match),
          });

          // Aplica a sugestão no texto sanitizado
          sanitizedText = sanitizedText.replace(match, rule.suggestionFn(match));
        }
      }
    }

    const hasCrmIdentifier = /(CRM[\/\s-]*[A-Z]{2}\s*\d+|M[EÉ]DICO)/i.test(text);
    if (profession === 'medico' && !hasCrmIdentifier) {
      infractions.push({
        ruleId: 'CFM-000-IDENTIFICACAO',
        category: 'identificacao_obrigatoria',
        severity: 'WARNING',
        detectedText: '[Falta Identificação]',
        reason: 'Toda peça de comunicação médica deve conter obrigatoriamente o Nome, a palavra MÉDICO e o número do CRM/UF.',
        legalReference: 'Resolução CFM nº 2.336/2023, Art. 2º',
        suggestion: doctorMetadata?.crm 
          ? `Dr. ${doctorMetadata.doctorName || 'Nome'} - MÉDICO - ${doctorMetadata.crm}`
          : 'Insira no rodapé: Dr(a). [Nome] - MÉDICO - CRM/UF [Número]',
      });
    }

    const hasCfoImageFinding = infractions.some((item) =>
      ['CFO-002-DIAGNOSTICO-RESULTADO-CONDICIONADO', 'CFO-003-SELFIE-COM-PACIENTE'].includes(item.ruleId),
    );
    const hasCroIdentifier = /\bCRO[\/\s-]*[A-Z]{2}\s*\d+\b/i.test(text);
    const normalizedName = doctorMetadata?.doctorName?.trim().toLocaleLowerCase('pt-BR');
    const hasProfessionalName = normalizedName ? text.toLocaleLowerCase('pt-BR').includes(normalizedName) : false;
    if (profession === 'dentista' && hasCfoImageFinding && (!hasCroIdentifier || !hasProfessionalName)) {
      infractions.push({
        ruleId: 'CFO-000-IDENTIFICACAO-IMAGEM',
        category: 'identificacao_obrigatoria',
        severity: 'WARNING',
        detectedText: '[Identificação incompleta na divulgação de imagem]',
        reason: 'Nas imagens de diagnóstico ou resultado final, o CFO informa que devem constar o nome do profissional que realizou o procedimento e sua inscrição no CRO.',
        legalReference: 'Resolução CFO nº 196/2019 (FAQ oficial do CFO: identificação nas imagens)',
        sourceUrl: CFO_196_SOURCE,
        suggestion: doctorMetadata?.crm
          ? `${doctorMetadata.doctorName || 'Dr(a). [Nome]'} - CIRURGIÃO-DENTISTA - ${doctorMetadata.crm}`
          : 'Inclua na imagem: Dr(a). [Nome] - CIRURGIÃO-DENTISTA - CRO/UF [Número]',
      });
    }

    // Cálculo do Score de Conformidade (0 a 100)
    let score = 100;
    for (const infraction of infractions) {
      if (infraction.severity === 'CRITICAL') score -= 30;
      if (infraction.severity === 'WARNING') score -= 10;
      if (infraction.severity === 'INFO') score -= 5;
    }
    score = Math.max(0, score);

    return {
      score,
      isApproved: score >= 80 && !infractions.some(i => i.severity === 'CRITICAL'),
      infractions,
      sanitizedText,
    };
  }

  /**
   * Validador Específico de Casos Clínicos & Imagens de Exames (TC, RM, Raio-X)
   * Analisa a viabilidade jurídica sob o Art. 75 do CEM, Resolução CFM 2.336/2023 e Art. 5º/11 da LGPD.
   */
  public static checkClinicalCasePublication(input: {
    caseNarrative: string;
    hasExamImage: boolean;
    examType?: 'TC' | 'RM' | 'RAIO_X' | 'ULTRASSOM' | 'FOTO_CLINICA' | 'LAUDO';
    hasDICOMMetadata: boolean;
    hasPatientWrittenConsent: boolean;
    isEducationalFocus: boolean;
  }) {
    const checklist: { item: string; passed: boolean; recommendation: string }[] = [];
    let canPublish = true;

    // 1. Caráter Educativo vs Sensacionalismo/Comercial
    if (input.isEducationalFocus) {
      checklist.push({
        item: 'Finalidade Estritamente Educativa (CFM 2.336/2023)',
        passed: true,
        recommendation: 'Conteúdo focado na elucidação científica da patologia e prevenção.',
      });
    } else {
      canPublish = false;
      checklist.push({
        item: 'Finalidade Estritamente Educativa (CFM 2.336/2023)',
        passed: false,
        recommendation: 'VEDADO: O relato não pode ter viés de captação de clientela ou autopromoção.',
      });
    }

    // 2. Análise da Narrativa Temporal ("Atendi hoje")
    const isTemporallySituated = /(atendi hoje|caso de hoje|paciente que chegou hoje|plant[aã]o de hoje)/i.test(input.caseNarrative);
    if (!isTemporallySituated) {
      checklist.push({
        item: 'Desvinculação Temporal (Evita identificação indireta)',
        passed: true,
        recommendation: 'Narrativa atemporal e didática em conformidade com o Art. 75 do CEM.',
      });
    } else {
      canPublish = false;
      checklist.push({
        item: 'Desvinculação Temporal (Evita identificação indireta)',
        passed: false,
        recommendation: 'REESCREVER: Remova menções ao dia de hoje ("atendi hoje"). Use: "Em casos de [doença] na prática médica..."',
      });
    }

    // 3. Exame de Imagem (TC, RM, Raio-X)
    if (input.hasExamImage) {
      if (!input.hasDICOMMetadata) {
        checklist.push({
          item: 'Higienização de Metadados DICOM (LGPD Art. 11)',
          passed: true,
          recommendation: 'Bordas cortadas e metadados de identificação eliminados.',
        });
      } else {
        canPublish = false;
        checklist.push({
          item: 'Higienização de Metadados DICOM (LGPD Art. 11)',
          passed: false,
          recommendation: 'PROIBIDO: Exame contém nome, data, hospital ou ID de prontuário. Exige crop/tarja irreversível.',
        });
      }

      // Reconstrução facial / marcas singulares
      checklist.push({
        item: 'Ausência de Marcas Anatômicas Singulares (LGPD Art. 5º, II)',
        passed: true,
        recommendation: 'Garantir que a imagem não exiba reconstrução facial 3D, tatuagens ou próteses numeradas.',
      });
    }

    // 4. Termo de Consentimento Informado (TCLE)
    if (input.hasPatientWrittenConsent) {
      checklist.push({
        item: 'Consentimento Livre e Esclarecido do Paciente (TCLE)',
        passed: true,
        recommendation: 'Autorização por escrito arquivada no prontuário para divulgação educativa.',
      });
    } else {
      // Para exames 100% anonimizados, o TCLE é altamente recomendável; para fotos corporais, é obrigatório
      const isBodyPhoto = input.examType === 'FOTO_CLINICA';
      if (isBodyPhoto) canPublish = false;
      checklist.push({
        item: 'Consentimento Livre e Esclarecido do Paciente (TCLE)',
        passed: !isBodyPhoto,
        recommendation: isBodyPhoto 
          ? 'OBRIGATÓRIO: Foto de parte do corpo exige TCLE formal assinado pelo paciente.'
          : 'RECOMENDADO: Para exames purgados (TC/RM), o TCLE resguarda o médico contra questionamentos cíveis.',
      });
    }

    // Sanitização sugerida da narrativa
    let sanitizedNarrative = input.caseNarrative
      .replace(/(atendi hoje|caso de hoje no plant[aã]o|paciente que chegou hoje|veio ao meu consult[oó]rio hoje)/gi, 'Em situações clínicas observadas na prática médica habitual')
      .replace(/(foto da tela|print do sistema|laudo em anexo)/gi, 'imagem diagnóstica ilustrativa');

    const tcleTemplate = `TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO (TCLE) PARA USO EDUCATIVO DE EXAME
Eu, [NOME DO PACIENTE OU RESPONSÁVEL LEGAL], autorizo o(a) Dr(a). [NOME DO MÉDICO], CRM [NÚMERO], a utilizar imagens descaracterizadas e anônimas do meu exame ([TIPO: TC/RM/RX]), para finalidades estritamente educativas e científicas em canais digitais, em conformidade com a Resolução CFM nº 2.336/2023 e a Lei Geral de Proteção de Dados (Lei 13.709/2018).
Data: [DATA] | Assinatura: ___________________________`;

    return {
      canPublish,
      statusText: canPublish ? 'SEM BLOQUEIO NA TRIAGEM EDUCATIVA' : 'REVISE ANTES DE PUBLICAR: RISCO ÉTICO OU DE LGPD',
      badgeColor: canPublish ? 'teal' : 'rose',
      riskSummary: canPublish 
        ? 'A triagem não encontrou bloqueio pela Res. CFM 2.336/2023 nem pela anonimização da LGPD. Confira o caso antes de publicar.'
        : 'A postagem viola o sigilo profissional ou expõe dados sensíveis. Ajuste as pendências antes de veicular.',
      checklist,
      sanitizedNarrative,
      tcleTemplate,
    };
  }
}

