import { LEGAL, legalIdentification } from '@/lib/legal'

export type LegalDocId = 'privacy' | 'terms' | 'refund'

export type LegalSection = { heading: string; paragraphs: string[] }

export type LegalDocument = {
  title: string
  updatedLabel: string
  intro: string
  disclaimer: string
  sections: LegalSection[]
}

const UPDATED = LEGAL.lastUpdated

function fmtDate(locale: string) {
  const d = new Date(`${UPDATED}T12:00:00Z`)
  return new Intl.DateTimeFormat(
    locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es-ES' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  ).format(d)
}

const privacy = (locale: string): LegalDocument => {
  const id = legalIdentification(locale)
  if (locale === 'en') {
    return {
      title: 'Privacy Policy',
      updatedLabel: `Last updated: ${fmtDate('en')}`,
      intro: 'This policy describes how H2V Systems processes personal data on this website, in line with Brazil’s LGPD (Law 13.709/2018) and, when applicable, the GDPR.',
      disclaimer: 'This text describes current site practices. It is not a substitute for independent legal advice. If a practice changes, this page will be updated.',
      sections: [
        {
          heading: '1. Controller',
          paragraphs: [
            id,
            `Contact for data-subject requests: ${LEGAL.email}. Location: ${LEGAL.location}.`,
            'Until a legal entity is registered, the controller is the individual named above.',
          ],
        },
        {
          heading: '2. Data we collect and why',
          paragraphs: [
            'We collect only what is needed for the purpose you requested. There is no registration area and no sale of personal data.',
            'Contact form: name and email (required); company, phone and service of interest (optional); message. Purpose: reply to your inquiry by email and, if you ask, WhatsApp. Legal basis: consent (LGPD art. 7, I).',
            'Meeting booking: name and email you type, plus the data Cal.com needs to confirm the slot. Purpose: schedule a technical conversation. Legal basis: consent. Cal.com acts as a processor/independent controller for the calendar — see cal.com/privacy.',
            'Newsletter: email only. Purpose: send occasional technical notes. Legal basis: consent. You can unsubscribe in every message.',
            'Security logs: truncated IP and timestamp, used only to rate-limit abuse of the APIs. Legal basis: legitimate interest in keeping the service available (LGPD art. 7, IX). We do not use this for marketing.',
            'Analytics (Vercel Analytics and Speed Insights): anonymous or pseudonymous usage metrics. Loaded only after you accept analytics cookies. Legal basis: consent.',
          ],
        },
        {
          heading: '3. What we do not collect',
          paragraphs: [
            'We do not ask for CPF, ID documents, payment cards, precise geolocation, biometrics or browsing history beyond the optional analytics you accept.',
            'The architecture simulator runs in your browser and is not stored on our servers.',
          ],
        },
        {
          heading: '4. Sharing',
          paragraphs: [
            'Resend (email delivery of contact and newsletter messages).',
            'Cal.com (meeting bookings).',
            'WhatsApp / Meta, only if you choose to send the pre-filled message.',
            'Vercel (hosting, and analytics only with consent).',
            'We do not sell, rent or exchange personal data. Subprocessors are used only to deliver the service you requested.',
          ],
        },
        {
          heading: '5. International transfers',
          paragraphs: [
            'Hosting and some processors (Vercel, Cal.com, Resend) may store data outside Brazil, including the United States. Transfers occur only as needed for the service, with contractual safeguards required of those providers.',
          ],
        },
        {
          heading: '6. Retention',
          paragraphs: [
            'Contact messages: kept only as long as needed to handle the request and any follow-up, then deleted or archived with restricted access.',
            'Newsletter: until you unsubscribe or request deletion.',
            'Calendar bookings: according to Cal.com’s retention and the calendar you connected.',
            'Rate-limit logs: short window (minutes), then discarded.',
            'Cookie consent: stored locally in your browser until you change it.',
          ],
        },
        {
          heading: '7. Your rights (LGPD arts. 18 and 9)',
          paragraphs: [
            'You may request confirmation of processing, access, correction, anonymisation, blocking, deletion of data processed with consent, portability, information about sharing, and withdrawal of consent.',
            `Send requests to ${LEGAL.email}. We will reply within the legal timeframe. You may also complain to the Autoridade Nacional de Proteção de Dados (ANPD).`,
          ],
        },
        {
          heading: '8. Cookies',
          paragraphs: [
            'Strictly necessary: locale preference, cookie-consent record, and technical session items required to run the site. These do not require consent under LGPD/ANPD guidance for essential cookies.',
            'Analytics: Vercel Analytics and Speed Insights, only after you click “Accept analytics” (or equivalent). They help us understand aggregated traffic and performance. They are not used for advertising.',
            'You can change your choice at any time via “Cookie settings” in the footer. Rejecting analytics does not block the site.',
          ],
        },
        {
          heading: '9. Security',
          paragraphs: [
            'We use HTTPS, a content-security policy, rate limiting and server-side validation. No method is 100% secure; we apply reasonable technical and organisational measures for a marketing site of this size.',
          ],
        },
        {
          heading: '10. Children',
          paragraphs: [
            'This site is aimed at businesses and professionals. We do not knowingly collect data from children under 13.',
          ],
        },
      ],
    }
  }
  if (locale === 'es') {
    return {
      title: 'Política de privacidad',
      updatedLabel: `Última actualización: ${fmtDate('es')}`,
      intro: 'Esta política describe cómo H2V Systems trata datos personales en este sitio, de acuerdo con la LGPD brasileña (Ley 13.709/2018) y, cuando corresponda, el RGPD.',
      disclaimer: 'Este texto describe las prácticas actuales del sitio. No sustituye asesoría jurídica independiente. Si una práctica cambia, esta página se actualizará.',
      sections: [
        {
          heading: '1. Responsable del tratamiento',
          paragraphs: [
            id,
            `Contacto para ejercer derechos: ${LEGAL.email}. Ubicación: ${LEGAL.location}.`,
            'Hasta que se constituya una persona jurídica, el responsable es la persona física indicada.',
          ],
        },
        {
          heading: '2. Datos que recogemos y para qué',
          paragraphs: [
            'Recogemos solo lo necesario para la finalidad que usted solicita. No hay área de registro ni venta de datos.',
            'Formulario de contacto: nombre y correo (obligatorios); empresa, teléfono y servicio de interés (opcionales); mensaje. Finalidad: responder por correo y, si usted lo pide, por WhatsApp. Base: consentimiento.',
            'Agenda: nombre y correo, más los datos que Cal.com necesita para confirmar el horario. Finalidad: agendar una conversación técnica. Base: consentimiento. Cal.com trata esos datos según cal.com/privacy.',
            'Boletín: solo el correo. Finalidad: enviar notas técnicas ocasionales. Base: consentimiento. Puede darse de baja en cada mensaje.',
            'Registros de seguridad: IP truncada y marca de tiempo, solo para limitar abuso de las APIs. Base: interés legítimo. No se usa para marketing.',
            'Analítica (Vercel Analytics y Speed Insights): métricas de uso. Se carga solo si acepta cookies analíticas. Base: consentimiento.',
          ],
        },
        {
          heading: '3. Lo que no recogemos',
          paragraphs: [
            'No pedimos CPF, documentos, tarjetas, geolocalización precisa, biometría ni historial de navegación más allá de la analítica opcional.',
            'El simulador de arquitectura corre en su navegador y no se guarda en nuestros servidores.',
          ],
        },
        {
          heading: '4. Compartición',
          paragraphs: [
            'Resend (envío de correo), Cal.com (agenda), WhatsApp/Meta solo si usted envía el mensaje, y Vercel (alojamiento; analítica solo con consentimiento).',
            'No vendemos ni alquilamos datos personales.',
          ],
        },
        {
          heading: '5. Transferencias internacionales',
          paragraphs: [
            'El alojamiento y algunos encargados (Vercel, Cal.com, Resend) pueden tratar datos fuera de Brasil, incluido Estados Unidos, solo para prestar el servicio solicitado.',
          ],
        },
        {
          heading: '6. Conservación',
          paragraphs: [
            'Mensajes de contacto: el tiempo necesario para atenderlos. Boletín: hasta la baja. Agenda: según Cal.com. Registros de límite de tasa: minutos. Consentimiento de cookies: en su navegador.',
          ],
        },
        {
          heading: '7. Derechos (LGPD arts. 18 y 9)',
          paragraphs: [
            `Puede pedir confirmación, acceso, corrección, anonimización, bloqueo, eliminación, portabilidad, información sobre compartición y revocación del consentimiento. Escríbanos a ${LEGAL.email}. También puede acudir a la ANPD.`,
          ],
        },
        {
          heading: '8. Cookies',
          paragraphs: [
            'Necesarias: idioma, registro de consentimiento y elementos técnicos del sitio.',
            'Analíticas: Vercel Analytics y Speed Insights, solo si acepta. No se usan para publicidad. Puede cambiar la elección en “Ajustes de cookies” del pie de página.',
          ],
        },
        {
          heading: '9. Seguridad',
          paragraphs: [
            'Usamos HTTPS, política de seguridad de contenido, limitación de tasa y validación en el servidor. Ningún método es infalible.',
          ],
        },
        {
          heading: '10. Niños',
          paragraphs: [
            'El sitio está dirigido a empresas y profesionales. No recogemos a sabiendas datos de menores de 13 años.',
          ],
        },
      ],
    }
  }
  return {
    title: 'Política de Privacidade',
    updatedLabel: `Última atualização: ${fmtDate('pt')}`,
    intro: 'Esta política descreve como a H2V Systems trata dados pessoais neste site, em conformidade com a Lei nº 13.709/2018 (LGPD) e, quando aplicável, o GDPR.',
    disclaimer: 'Este texto descreve as práticas atuais do site. Não substitui assessoria jurídica independente. Se alguma prática mudar, esta página será atualizada.',
    sections: [
      {
        heading: '1. Controlador',
        paragraphs: [
          id,
          `Canal para exercer direitos do titular: ${LEGAL.email}. Localização: ${LEGAL.location}.`,
          'Enquanto não houver pessoa jurídica constituída, o controlador é a pessoa física identificada acima.',
        ],
      },
      {
        heading: '2. Quais dados coletamos e para quê',
        paragraphs: [
          'Coletamos apenas o necessário para a finalidade que você solicitou. Não há área de cadastro nem venda de dados pessoais.',
          'Formulário de contato: nome e e-mail (obrigatórios); empresa, telefone e serviço de interesse (opcionais); mensagem. Finalidade: responder ao pedido por e-mail e, se você escolher, por WhatsApp. Base legal: consentimento (LGPD art. 7º, I).',
          'Agendamento de reunião: nome e e-mail que você informar, além dos dados que o Cal.com precisa para confirmar o horário. Finalidade: marcar conversa técnica. Base legal: consentimento. O Cal.com trata esses dados conforme cal.com/privacy.',
          'Informativo (newsletter): apenas o e-mail. Finalidade: enviar notas técnicas eventuais. Base legal: consentimento. É possível descadastrar em cada mensagem.',
          'Registros de segurança: IP truncado e data/hora, usados só para limitar abuso das APIs. Base legal: legítimo interesse em manter o serviço disponível (LGPD art. 7º, IX). Não usamos isso para marketing.',
          'Analítica (Vercel Analytics e Speed Insights): métricas de uso agregadas ou pseudonimizadas. Só são carregadas se você aceitar cookies analíticos. Base legal: consentimento.',
        ],
      },
      {
        heading: '3. O que não coletamos',
        paragraphs: [
          'Não pedimos CPF, documentos de identidade, cartão de pagamento, geolocalização precisa, biometria nem histórico de navegação além da analítica opcional que você aceitar.',
          'O simulador de arquitetura roda no seu navegador e não é armazenado em nossos servidores.',
        ],
      },
      {
        heading: '4. Compartilhamento',
        paragraphs: [
          'Resend (envio dos e-mails de contato e do informativo).',
          'Cal.com (agendamento de reuniões).',
          'WhatsApp / Meta, somente se você optar por enviar a mensagem pré-preenchida.',
          'Vercel (hospedagem; analítica só com consentimento).',
          'Não vendemos, alugamos nem trocamos dados pessoais. Encadeados são usados só para cumprir o que você pediu.',
        ],
      },
      {
        heading: '5. Transferência internacional',
        paragraphs: [
          'A hospedagem e alguns operadores (Vercel, Cal.com, Resend) podem tratar dados fora do Brasil, inclusive nos Estados Unidos. A transferência ocorre apenas o necessário para prestar o serviço, com as salvaguardas contratuais exigidas desses fornecedores.',
        ],
      },
      {
        heading: '6. Conservação',
        paragraphs: [
          'Mensagens de contato: pelo tempo necessário para atender o pedido e o follow-up, depois são excluídas ou arquivadas com acesso restrito.',
          'Informativo: até o descadastro ou pedido de exclusão.',
          'Agendamentos: conforme a retenção do Cal.com e da agenda conectada.',
          'Registros de rate-limit: janela curta (minutos) e descarte.',
          'Consentimento de cookies: fica no seu navegador até você alterar.',
        ],
      },
      {
        heading: '7. Seus direitos (LGPD arts. 18 e 9º)',
        paragraphs: [
          'Você pode pedir confirmação do tratamento, acesso, correção, anonimização, bloqueio, eliminação de dados tratados com consentimento, portabilidade, informação sobre compartilhamento e revogação do consentimento.',
          `Envie o pedido para ${LEGAL.email}. Responderemos no prazo legal. Também é possível reclamar à Autoridade Nacional de Proteção de Dados (ANPD).`,
        ],
      },
      {
        heading: '8. Cookies',
        paragraphs: [
          'Estritamente necessários: preferência de idioma, registro do consentimento e itens técnicos para o site funcionar. Não exigem consentimento, segundo a orientação da ANPD para cookies essenciais.',
          'Analíticos: Vercel Analytics e Speed Insights, somente depois de “Aceitar analíticos”. Servem para entender tráfego e desempenho agregados. Não são usados para publicidade.',
          'Você pode mudar a escolha a qualquer momento em “Configurar cookies” no rodapé. Recusar analíticos não impede o uso do site.',
        ],
      },
      {
        heading: '9. Segurança',
        paragraphs: [
          'Usamos HTTPS, política de segurança de conteúdo, limitação de taxa e validação no servidor. Nenhum método é 100% seguro; aplicamos medidas razoáveis para um site institucional deste porte.',
        ],
      },
      {
        heading: '10. Crianças',
        paragraphs: [
          'Este site é voltado a empresas e profissionais. Não coletamos, de forma intencional, dados de menores de 13 anos.',
        ],
      },
    ],
  }
}

const terms = (locale: string): LegalDocument => {
  const id = legalIdentification(locale)
  if (locale === 'en') {
    return {
      title: 'Terms of Service',
      updatedLabel: `Last updated: ${fmtDate('en')}`,
      intro: 'These terms govern use of the H2V Systems website and the information published here. Paid engineering work is governed by a separate written proposal or contract.',
      disclaimer: 'Nothing on this website is a binding offer, a guarantee of results, or legal, accounting or investment advice.',
      sections: [
        { heading: '1. Who we are', paragraphs: [id, `Contact: ${LEGAL.email}.`] },
        {
          heading: '2. The website',
          paragraphs: [
            'The site presents the brand, articles and contact channels. Content may change without notice.',
            'The architecture simulator is an educational illustration, not a certified architecture, quote or SLA.',
          ],
        },
        {
          heading: '3. Services',
          paragraphs: [
            'Software engineering, consulting and related services are contracted only after a written proposal accepted by both parties. Deadlines, fees, SLAs and deliverables are those in that document — not marketing copy on this site.',
            'We do not sell digital products, courses with “approval guarantees”, or consumer packages on this website.',
          ],
        },
        {
          heading: '4. No guaranteed outcomes',
          paragraphs: [
            'We do not promise specific business results, uptime percentages, cost savings or third-party approvals (banks, government, app stores, certifications). Any figure on the site is a target or historical illustration, not a contractual commitment.',
          ],
        },
        {
          heading: '5. Acceptable use',
          paragraphs: [
            'Do not misuse forms, attempt to break the site, scrape at abusive rates, or send unlawful content. We may refuse or delete abusive submissions.',
          ],
        },
        {
          heading: '6. Intellectual property',
          paragraphs: [
            'Site copy, layout, logo and original code belong to the operator, unless credited otherwise. Client names and third-party marks are not used as endorsements.',
            'Images on this site are original brand assets (logo and generated Open Graph art), not stock photos licensed from third-party libraries.',
          ],
        },
        {
          heading: '7. Third-party services',
          paragraphs: [
            'WhatsApp, Cal.com, LinkedIn and GitHub are independent services with their own terms. We are not responsible for their availability or policies.',
          ],
        },
        {
          heading: '8. Liability',
          paragraphs: [
            'The website is provided as is. To the extent allowed by Brazilian law, we are not liable for indirect losses arising from use of the public site. Liability for contracted work is limited as stated in the signed proposal.',
          ],
        },
        {
          heading: '9. Law and venue',
          paragraphs: [
            `These terms are governed by the laws of ${LEGAL.governingLaw}. Disputes about the website shall be submitted to the courts of ${LEGAL.venue}, without prejudice to mandatory consumer-protection venues when they apply.`,
          ],
        },
      ],
    }
  }
  if (locale === 'es') {
    return {
      title: 'Términos de servicio',
      updatedLabel: `Última actualización: ${fmtDate('es')}`,
      intro: 'Estos términos rigen el uso del sitio de H2V Systems. El trabajo de ingeniería remunerado se rige por una propuesta o contrato escrito aparte.',
      disclaimer: 'Nada en este sitio es una oferta vinculante, una garantía de resultados ni asesoría legal, contable o de inversión.',
      sections: [
        { heading: '1. Quiénes somos', paragraphs: [id, `Contacto: ${LEGAL.email}.`] },
        {
          heading: '2. El sitio',
          paragraphs: [
            'El sitio presenta la marca, artículos y canales de contacto. El contenido puede cambiar sin aviso.',
            'El simulador de arquitectura es ilustrativo, no una arquitectura certificada, presupuesto ni SLA.',
          ],
        },
        {
          heading: '3. Servicios',
          paragraphs: [
            'Los servicios se contratan solo tras una propuesta escrita aceptada por ambas partes. Plazos, honorarios y entregables son los de ese documento.',
            'No vendemos productos digitales ni paquetes con “garantía de aprobación” en este sitio.',
          ],
        },
        {
          heading: '4. Sin resultados garantizados',
          paragraphs: [
            'No prometemos resultados de negocio, porcentajes de uptime, ahorros ni aprobaciones de terceros. Las cifras del sitio son metas o ilustraciones, no un compromiso contractual.',
          ],
        },
        {
          heading: '5. Uso aceptable',
          paragraphs: [
            'No abuse de los formularios, no intente vulnerar el sitio ni envíe contenido ilícito.',
          ],
        },
        {
          heading: '6. Propiedad intelectual',
          paragraphs: [
            'Textos, diseño y logotipo son del operador, salvo crédito en contrario. Las imágenes del sitio son activos propios de la marca, no bancos de fotos de terceros.',
          ],
        },
        {
          heading: '7. Terceros',
          paragraphs: [
            'WhatsApp, Cal.com, LinkedIn y GitHub son servicios independientes, con sus propios términos.',
          ],
        },
        {
          heading: '8. Responsabilidad',
          paragraphs: [
            'El sitio se ofrece tal cual. En la medida permitida por la ley brasileña, no respondemos por daños indirectos derivados del uso del sitio público.',
          ],
        },
        {
          heading: '9. Ley y fuero',
          paragraphs: [
            `Se aplica la ley de ${LEGAL.governingLaw}. Para controversias sobre el sitio, los tribunales de ${LEGAL.venue}, sin perjuicio de fueros imperativos de consumo cuando correspondan.`,
          ],
        },
      ],
    }
  }
  return {
    title: 'Termos de Serviço',
    updatedLabel: `Última atualização: ${fmtDate('pt')}`,
    intro: 'Estes termos regem o uso do site da H2V Systems e das informações publicadas aqui. Trabalho de engenharia remunerado é regido por proposta ou contrato escrito em separado.',
    disclaimer: 'Nada neste site é oferta vinculante, garantia de resultado ou aconselhamento jurídico, contábil ou de investimento.',
    sections: [
      { heading: '1. Quem somos', paragraphs: [id, `Contato: ${LEGAL.email}.`] },
      {
        heading: '2. O site',
        paragraphs: [
          'O site apresenta a marca, artigos e canais de contato. O conteúdo pode mudar sem aviso prévio.',
          'O simulador de arquitetura é ilustração educativa, não arquitetura certificada, orçamento nem SLA.',
        ],
      },
      {
        heading: '3. Serviços',
        paragraphs: [
          'Engenharia de software, consultoria e serviços correlatos só são contratados após proposta escrita aceita pelas partes. Prazos, honorários, SLA e entregáveis são os desse documento — não o texto de marketing deste site.',
          'Não vendemos neste site produtos digitais, cursos com “promessa de aprovação” nem pacotes de consumo em massa.',
        ],
      },
      {
        heading: '4. Sem resultado garantido',
        paragraphs: [
          'Não prometemos resultado comercial específico, percentual de uptime, economia de custo nem aprovação de terceiros (bancos, órgãos públicos, lojas de aplicativos, certificações). Qualquer número no site é meta ou ilustração histórica, não compromisso contratual.',
        ],
      },
      {
        heading: '5. Uso aceitável',
        paragraphs: [
          'Não abuse dos formulários, não tente romper o site, não faça coleta automatizada abusiva nem envie conteúdo ilícito. Podemos recusar ou apagar envios abusivos.',
        ],
      },
      {
        heading: '6. Propriedade intelectual',
        paragraphs: [
          'Textos, layout, logotipo e código original do site pertencem ao operador, salvo crédito em contrário. Nomes de clientes e marcas de terceiros não são usados como endosso.',
          'As imagens deste site são ativos originais da marca (logotipo e arte Open Graph gerada), não fotos de bancos licenciados de terceiros.',
        ],
      },
      {
        heading: '7. Serviços de terceiros',
        paragraphs: [
          'WhatsApp, Cal.com, LinkedIn e GitHub são serviços independentes, com termos próprios. Não respondemos pela disponibilidade nem pelas políticas deles.',
        ],
      },
      {
        heading: '8. Responsabilidade',
        paragraphs: [
          'O site é oferecido no estado em que se encontra. Na medida permitida pela lei brasileira, não respondemos por perdas indiretas decorrentes do uso do site público. A responsabilidade por trabalho contratado limita-se ao que a proposta assinada estabelecer.',
        ],
      },
      {
        heading: '9. Lei e foro',
        paragraphs: [
          `Estes termos submetem-se às leis do ${LEGAL.governingLaw}. Controvérsias sobre o site serão propostas no foro de ${LEGAL.venue}, sem prejuízo de foros legais obrigatórios de consumo quando aplicáveis.`,
        ],
      },
    ],
  }
}

const refund = (locale: string): LegalDocument => {
  if (locale === 'en') {
    return {
      title: 'Refund and cancellation policy',
      updatedLabel: `Last updated: ${fmtDate('en')}`,
      intro: 'This site does not sell products at checkout. This policy explains how cancellations and refunds work for contacts, bookings and contracted work.',
      disclaimer: 'When a consumer relationship exists under the Brazilian Consumer Defence Code, mandatory rights prevail over this page.',
      sections: [
        {
          heading: '1. What is free',
          paragraphs: [
            'Browsing the site, reading articles, using the architecture simulator, sending the contact form and the first diagnostic conversation (when offered) have no charge.',
            'The newsletter is free. There is nothing to refund.',
          ],
        },
        {
          heading: '2. Meeting bookings',
          paragraphs: [
            'Slots booked via Cal.com can be cancelled or rescheduled in the confirmation email or in Cal.com’s interface, subject to the notice shown at booking.',
            'A booking is not a paid purchase on this website.',
          ],
        },
        {
          heading: '3. Contracted engineering work',
          paragraphs: [
            'Fees, payment schedule, change requests and refunds for software or consulting work are defined only in the signed commercial proposal or contract.',
            'If that document is silent, unused prepaid hours may be discussed in good faith; work already delivered or reserved capacity is not automatically refundable.',
          ],
        },
        {
          heading: '4. How to request',
          paragraphs: [
            `Write to ${LEGAL.email} with the proposal number or booking reference. We will reply with the applicable next step.`,
          ],
        },
      ],
    }
  }
  if (locale === 'es') {
    return {
      title: 'Política de reembolso y cancelación',
      updatedLabel: `Última actualización: ${fmtDate('es')}`,
      intro: 'Este sitio no vende productos en un checkout. Esta política explica cancelaciones y reembolsos de contactos, reservas y trabajo contratado.',
      disclaimer: 'Si existe relación de consumo según el Código de Defensa del Consumidor de Brasil, esos derechos prevalecen sobre esta página.',
      sections: [
        {
          heading: '1. Lo que es gratuito',
          paragraphs: [
            'Navegar, leer artículos, usar el simulador, enviar el formulario y la primera conversación de diagnóstico (cuando se ofrezca) no tienen costo.',
            'El boletín es gratuito. No hay nada que reembolsar.',
          ],
        },
        {
          heading: '2. Reservas de reunión',
          paragraphs: [
            'Los horarios reservados en Cal.com se pueden cancelar o reprogramar desde el correo de confirmación o en Cal.com, según el aviso mostrado al reservar.',
            'Una reserva no es una compra pagada en este sitio.',
          ],
        },
        {
          heading: '3. Trabajo de ingeniería contratado',
          paragraphs: [
            'Honorarios, calendario de pago y reembolsos se definen solo en la propuesta o contrato firmado.',
            'Si el documento no dice nada, las horas prepagadas no usadas se pueden tratar de buena fe; el trabajo ya entregado no es automáticamente reembolsable.',
          ],
        },
        {
          heading: '4. Cómo solicitar',
          paragraphs: [
            `Escriba a ${LEGAL.email} con el número de propuesta o la referencia de la reserva.`,
          ],
        },
      ],
    }
  }
  return {
    title: 'Política de Reembolso e Cancelamento',
    updatedLabel: `Última atualização: ${fmtDate('pt')}`,
    intro: 'Este site não vende produtos em checkout. Esta política explica como funcionam cancelamentos e reembolsos de contatos, agendamentos e trabalho contratado.',
    disclaimer: 'Quando houver relação de consumo nos termos do Código de Defesa do Consumidor, os direitos legais obrigatórios prevalecem sobre esta página.',
    sections: [
      {
        heading: '1. O que é gratuito',
        paragraphs: [
          'Navegar no site, ler artigos, usar o simulador de arquitetura, enviar o formulário de contato e a primeira conversa de diagnóstico (quando oferecida) não têm cobrança.',
          'O informativo é gratuito. Não há o que reembolsar.',
        ],
      },
      {
        heading: '2. Agendamento de reunião',
        paragraphs: [
          'Horários marcados pelo Cal.com podem ser cancelados ou remarcados no e-mail de confirmação ou na interface do Cal.com, observado o aviso exibido no momento da reserva.',
          'O agendamento não é compra paga neste site.',
        ],
      },
      {
        heading: '3. Trabalho de engenharia contratado',
        paragraphs: [
          'Honorários, cronograma de pagamento, alterações de escopo e reembolso de software ou consultoria são definidos apenas na proposta comercial ou no contrato assinado.',
          'Se esse documento for omisso, horas pré-pagas não utilizadas podem ser tratadas de boa-fé; trabalho já entregue ou capacidade já reservada não é automaticamente reembolsável.',
        ],
      },
      {
        heading: '4. Como solicitar',
        paragraphs: [
          `Escreva para ${LEGAL.email} com o número da proposta ou a referência do agendamento. Responderemos com o próximo passo aplicável.`,
        ],
      },
    ],
  }
}

export function getLegalDocument(id: LegalDocId, locale: string): LegalDocument {
  if (id === 'privacy') return privacy(locale)
  if (id === 'terms') return terms(locale)
  return refund(locale)
}
