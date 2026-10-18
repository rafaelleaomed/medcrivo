/**
 * MedCrivo Studio - Motor de Conformidade Ética Médica e LGPD
 * Baseado nas Resoluções CFM nº 2.336/2023, CFM nº 2.380/2024 e Lei Geral de Proteção de Dados (Lei 13.709/2018).
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
    | 'especialidade_rqe';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  pattern: RegExp;
  reason: string;
  legalReference: string;
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

export const CFM_RULES: ComplianceRule[] = [
  // 1. Promessa de Cura e Resultado Garantido
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

  // 2. Especialidades e RQE (Resolução CFM 2.380/2024)
  {
    id: 'CFM-003-ESPECIALISTA-SEM-RQE',
    category: 'especialidade_rqe',
    severity: 'WARNING',
    pattern: /(p[oó]s-gradua(do|da|cao)|especializando em|estudos avan[cç]ados)/gi,
    reason: 'Médicos com pós-graduação lato sensu sem RQE devem obrigatoriamente veicular a expressão NÃO ESPECIALISTA.',
    legalReference: 'Resolução CFM nº 2.380/2024 e Res. 2.336/2023, Art. 5º',
    suggestionFn: (match) => `${match} (NÃO ESPECIALISTA)`,
  },

  // 3. LGPD & Dados Sensíveis de Pacientes (Art. 5º, II da LGPD)
  {
    id: 'LGPD-001-PII-PACIENTE',
    category: 'lgpd_dados_sensiveis',
    severity: 'CRITICAL',
    pattern: /(paciente\s+([A-Z][a-z]+\s+[A-Z][a-z]+)|CPF[:\s]*\d{3}\.\d{3}\.\d{3}-\d{2}|RG[:\s]*\d+|prontu[aá]rio[:\s]*\d+)/gi,
    reason: 'Exposição de dados pessoais identificáveis (PII) de pacientes constitui infração grave à LGPD e ao segredo médico.',
    legalReference: 'LGPD Art. 5º, II e Código de Ética Médica Art. 73',
    suggestionFn: () => 'paciente em acompanhamento clínico',
  },

  // 4. Imagens de Exames Complementares (TC, Ressonância, Raio-X, Biópsias)
  {
    id: 'LGPD-002-METADADOS-EXAMES',
    category: 'exame_diagnostico_metadados',
    severity: 'CRITICAL',
    pattern: /(laudo\s+n[uú]mero|hospital\s+[A-Za-z]+|conv[eê]nio[:\s]*[A-Za-z]+|data\s+do\s+exame[:\s]*\d{2}\/\d{2}\/\d{4})/gi,
    reason: 'Exames como Tomografia e Ressonância não podem conter metadados institucionais ou datas que permitam a reidentificação do paciente.',
    legalReference: 'LGPD Art. 11 e Parecer Consulta CFM nº 14/2020',
    suggestionFn: () => '[DADO INSTITUCIONAL HIGIENIZADO]',
  },

  // 5. Relatos de Consultório Situados no Tempo ("Atendi hoje")
  {
    id: 'LGPD-003-RELATO-TEMPO-REAL',
    category: 'lgpd_dados_sensiveis',
    severity: 'CRITICAL',
    pattern: /(atendi hoje|caso de hoje no plant[aã]o|paciente que chegou hoje|veio ao meu consult[oó]rio hoje|acabei de atender|cirurgia que realizei hoje|operei hoje)/gi,
    reason: 'Relatos fáticos temporalmente situados ("atendi hoje") criam alto risco de reidentificação indireta por cruzamento com prontuário, acompanhantes e data/hora. Infringe o sigilo profissional (Art. 75 do CEM) e a LGPD.',
    legalReference: 'Código de Ética Médica Art. 75, Resolução CFM nº 2.336/2023 Art. 11 e LGPD Art. 5º, II',
    suggestionFn: () => 'Em situações clínicas observadas na prática médica habitual',
  },

  // 6. Prints de Telas de Prontuário ou Laudos Hospitalares
  {
    id: 'LGPD-004-EXAME-PRINT-TELA',
    category: 'exame_diagnostico_metadados',
    severity: 'CRITICAL',
    pattern: /(foto da tela|print do sistema|laudo em anexo|foto do exame|veja a tomografia dele|veja a resson[aâ]ncia dele|veja o raio-x dele)/gi,
    reason: 'Prints ou fotos diretas de telas de prontuário/PACS contêm metadados sensíveis que violam a privacidade do paciente. Devem ser substituídos por imagens didáticas isoladas sem metadados.',
    legalReference: 'LGPD Art. 11, Parecer CFM nº 14/2020 e Art. 73 do CEM',
    suggestionFn: () => 'análise ilustrativa da imagem diagnóstica em caráter estritamente educativo',
  },

  // 7. Chamada de Preço sem contextualização
  {
    id: 'CFM-004-PROMOCAO-PRECO',
    category: 'comercio_e_precos',
    severity: 'WARNING',
    pattern: /(promo[cç][aã]o|desconto de \d+%|combo de procedimentos|pre[cç]o imperd[ií]vel|black friday)/gi,
    reason: 'A divulgação de valores de consulta é permitida pela Res. 2.336/2023, mas a mercantilização agressiva e combos promocionais continuam vedados.',
    legalReference: 'Resolução CFM nº 2.336/2023, Art. 9º',
    suggestionFn: () => 'informações sobre valores disponíveis mediante contato ético com a recepção',
  },

  // 8. Atribuição de Método Exclusivo
  {
    id: 'CFM-005-METODO-EXCLUSIVO',
    category: 'sensacionalismo',
    severity: 'CRITICAL',
    pattern: /(t[eé]cnica exclusiva minha|meu m[eé]todo pr[oó]prio de cura|inova[cç][aã]o que s[oó] eu fa[cç]o|m[eé]todo secreto)/gi,
    reason: 'É proibido anunciar método ou técnica exclusiva não consagrada no meio científico ou atribuir a si exclusividade de procedimento.',
    legalReference: 'Resolução CFM nº 2.336/2023, Art. 11, VII',
    suggestionFn: () => 'abordagem técnica baseada nas diretrizes clínicas da especialidade',
  }
];

export class HealthcareComplianceEngine {
  /**
   * Audita o texto completo da legenda, roteiro ou slide médico.
   */
  public static audit(text: string, doctorMetadata?: { hasRqe?: boolean; doctorName?: string; crm?: string }): AuditResult {
    const infractions: AuditResult['infractions'] = [];
    let sanitizedText = text;

    for (const rule of CFM_RULES) {
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
            suggestion: rule.suggestionFn(match),
          });

          // Aplica a sugestão no texto sanitizado
          sanitizedText = sanitizedText.replace(match, rule.suggestionFn(match));
        }
      }
    }

    // Validação de Identificação Obrigatória (Res. CFM 2.336/2023)
    const hasCrmIdentifier = /(CRM[\/\s]*[A-Z]{2}\s*\d+|M[EÉ]DICO)/i.test(text);
    if (!hasCrmIdentifier) {
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
      statusText: canPublish ? 'APROVADO PARA PUBLICAÇÃO EDUCATIVA' : 'BLOQUEADO: RISCO ÉTICO OU DE LGPD DETECTADO',
      badgeColor: canPublish ? 'teal' : 'rose',
      riskSummary: canPublish 
        ? 'O post atende aos critérios da Resolução CFM 2.336/2023 e ao princípio de anonimização da LGPD.'
        : 'A postagem viola o sigilo profissional ou expõe dados sensíveis. Ajuste as pendências antes de veicular.',
      checklist,
      sanitizedNarrative,
      tcleTemplate,
    };
  }
}

