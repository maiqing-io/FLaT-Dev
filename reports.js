(function () {
  var REPORTS_URL = 'https://script.google.com/macros/s/AKfycbwkJXYCspcwfojOLRZE9fonB8gbajlDGM2osCLkRiNk4W5XYw4lGcxJHRnNJ17BZmj4UQ/exec';

  // Categories available for filtering the Reports section, in the order their
  // filter buttons should appear (after "All"). Ids are lowercase and used in
  // each report's `categories` array and in the ?category= deep-link / #hash.
  var CATEGORIES = [
    { id: 'finance', label: 'Finance' },
    { id: 'law', label: 'Law' },
    { id: 'technology', label: 'Technology' }
  ];
  var CATEGORY_IDS = CATEGORIES.map(function (c) { return c.id; });
  var CATEGORY_LABELS = {};
  CATEGORIES.forEach(function (c) { CATEGORY_LABELS[c.id] = c.label; });

  // "Native" reports are stored directly in this file as full text and open as an
  // in-page article (reusing the article-modal-* pattern from index.html), rather
  // than fetching a Google Drive PDF into an iframe like the Sheet-backed reports do.
  //
  // To add a future report: insert a new object into this array with the same shape
  // as the ones below, plus a `categories` array drawn from the ids in CATEGORIES
  // above (e.g. categories: ['law', 'finance']). A report tagged with more than one
  // category automatically appears under each of those filters without the content
  // being duplicated anywhere. An optional `abstract` array of paragraph strings
  // renders as a highlighted abstract block before the numbered sections, and a
  // paragraph entry shaped as { quote: '...' } inside any section renders as a
  // styled blockquote instead of a plain paragraph. Give each report a unique,
  // URL-safe `slug` (e.g. 'my-report-title') so it can be opened directly via
  // reports.html?report=my-report-title. The listing shows newest first, which is
  // simply the order reports appear in this array, so insert a new report above
  // (earlier in the array than) any older report it should outrank. Each card shows
  // an `author` line and, for its excerpt, a hand-written `summary` string if one is
  // given, otherwise the first two sentences of `abstract[0]` are used automatically.
  // References can use *asterisks* for italics (titles, case names) and plain
  // https:// URLs, both of which are rendered automatically as italic text and
  // clickable new-tab links respectively.
  var NATIVE_REPORTS = [
    {
      kind: 'native',
      title: 'Who Regulates the Algorithm? Comparing the UK and EU\'s Approaches to AI in Financial Services',
      author: 'Madison Farrell',
      date: 'August 2026',
      wordCount: '1,756 words',
      readingTime: '9 min read',
      summary: 'Why the UK\'s principles-based model and the EU\'s prescriptive AI Act have run into two different kinds of trouble in 2026, and what each would need to borrow from the other.',
      eyebrow: 'COMMITTEE REPORT · AI IN FINANCIAL SERVICES',
      meta: 'Madison Farrell · 1,756 words · 9 min read',
      categories: ['law', 'finance', 'technology'],
      sections: [
        {
          heading: 'Introduction',
          paragraphs: [
            'The UK and the EU have taken visibly different routes to regulating artificial intelligence in financial services. The UK has, so far, declined to write a single AI-specific rule for the sector. The EU has done the opposite, naming particular financial AI applications directly in law and attaching a detailed compliance regime to them. The temptation is to treat this as a simple contrast: flexible versus prescriptive, principles versus rules, the common-law instinct against the civil-law one. That framing is not wrong, but it is incomplete, and it misses what has actually happened over the course of 2026, a year in which both regimes met the practical limits of the philosophy each had chosen. The EU\'s model, built to bind the technology itself, has just been forced to delay its own central obligations by sixteen months because the infrastructure needed to enforce them was not ready. The UK\'s model, built to bind only regulated firms, has just published its first serious self-examination and concluded that the framework holds, while simultaneously admitting that a meaningful share of consumers are already taking financial advice from tools sitting entirely outside that framework. Neither jurisdiction has solved the problem. Each has inherited the particular weakness that its chosen regulatory philosophy was always going to produce, and comparing the two is more useful as an exercise in seeing that weakness clearly than in declaring a winner.'
          ]
        },
        {
          heading: 'The UK — Extending the Existing Perimeter',
          paragraphs: [
            'The UK\'s approach rests on a single, repeated design choice: do not write new rules for AI, apply the rules that already exist. The Bank of England and the Financial Conduct Authority have described this as a technology-agnostic stance, one that neither prescribes nor prohibits particular technologies, preferring instead to hold firms to existing outcome-based obligations regardless of the technology used to meet them. The clearest expression of this is the Consumer Duty, which does not mention AI at all but requires firms to act to deliver good outcomes for retail customers, a standard that applies as much to an AI-generated recommendation as to a human adviser\'s. For banks specifically, the Prudential Regulation Authority\'s SS1/23, published in May 2023 and in effect since May 2024, applies the same logic to model governance: five principles covering identification, governance, development, validation and mitigation, deliberately worded to capture machine learning models without ever using the words "artificial intelligence" as a trigger for a separate regime.',
            'This approach was tested properly for the first time in 2026. In January, the FCA Board commissioned a review, led by executive director Sheldon Mills, into how far-reaching AI could reshape retail financial services by 2030. The review ran a call for input, drew on over 140 written submissions and commissioned a survey of more than 5,000 UK retail financial services consumers. It reported on 6 July 2026, and its central conclusion was that the existing framework remains fit for purpose: no AI-specific rules, no wholesale reform, with the Consumer Duty and the Senior Managers Regime confirmed as the anchors of accountability even as AI systems take on more autonomous roles. That confirmation was not, however, unqualified. The review\'s own consumer research found that one in five UK adults were already open to AI making financial decisions for them, and that around 26% already trusted general-purpose tools such as ChatGPT, Claude or Gemini for financial advice, frequently with limited awareness that the formal routes to redress available for regulated advice would not apply to them. The review\'s response was not to extend the Consumer Duty to cover these tools directly, since it cannot, as their providers are not regulated financial services firms. Instead, it recommended that the FCA launch a dedicated review, within three to six months, into the scale and impact of general-purpose AI tools operating outside the regulatory perimeter altogether.',
            'That recommendation is the tell. A principles-based regime built around binding firms rather than technologies is, by construction, unable to reach activity happening outside the perimeter of who counts as a firm, no matter how sophisticated its principles are. The Mills Review did not find a flaw in the Consumer Duty. It found the edge of what the Consumer Duty, or any firm-based regime, can be made to cover.'
          ]
        },
        {
          heading: 'The EU — Naming the Risk in Advance',
          paragraphs: [
            'The EU\'s AI Act takes the opposite starting point. Rather than binding firms and trusting outcomes-based principles to apply as circumstances demand, it classifies specific AI applications as high-risk in advance and attaches a fixed set of obligations to that classification wherever it applies, regardless of who is deploying the system. For financial services, that classification sits in Annex III, point 5, which the Act places within the broader category of access to essential private services. Point 5(b) covers AI systems used to evaluate the creditworthiness of natural persons or to establish their credit score, with an explicit carve-out for systems used solely to detect financial fraud. Point 5(c) does the same for risk assessment and pricing in life and health insurance, a narrower scope than it first appears, since property, casualty and general commercial insurance pricing fall outside it entirely. A narrow exemption exists under Article 6(3) for systems posing no significant risk of harm, but for consumer credit decisions that exemption has, in practice, proven difficult to rely on, since a model that genuinely influences whether someone is extended credit is exactly the kind of system the Article was written to catch.',
            'Where a system does fall within Annex III, the obligations that follow are substantial and specific: a conformity assessment before the system reaches the market, documented risk management processes, technical documentation, human oversight arrangements and bias testing, assessed against harmonised technical standards and, for many systems, verified by an independent notified body. This is regulation that specifies not just the outcome required but a considerable part of the process for achieving it, the near-opposite of the UK\'s approach.',
            'The difficulty is that this model requires an entire compliance ecosystem to exist before it can function at all: harmonised standards from European standardisation bodies, notified bodies accredited to carry out conformity assessments, and national market surveillance authorities designated and resourced to enforce the regime. By late 2025, it was clear that ecosystem was not ready. The European Commission published a proposal, the Digital Omnibus on AI, on 19 November 2025, to defer the high-risk obligations originally due to apply from 2 August 2026. After stalled negotiations in April 2026, the Council and Parliament reached a political agreement on 7 May, formally adopted the following weeks, and the Omnibus entered into force on 27 July 2026. Under the revised timeline, high-risk obligations for stand-alone Annex III systems, including the credit scoring and insurance pricing provisions relevant to financial services, now apply from 2 December 2027, a deferral of sixteen months. Obligations embedded in already-regulated products under Annex I move further still, to August 2028. Notably, the Act\'s transparency requirements, including the duty to disclose that a person is interacting with an AI system, were not part of the deferral and remain live from August 2026, meaning the Act\'s most process-heavy obligations were the ones postponed, while its simplest, disclosure-based ones were not.'
          ]
        },
        {
          heading: 'Where Theory Meets 2026 — Two Different Failure Modes',
          paragraphs: [
            'This is not simply a story of one jurisdiction moving faster than the other. It maps onto a long-running debate in regulatory theory about what each approach actually costs. Academic work comparing rules-based and principles-based financial regulation, notably Frantz and Instefjord\'s analysis for the London School of Economics, has argued that principles-based systems offer clarity about the regulatory objective while leaving firms to reverse-engineer what compliance actually requires at the firm level, an ambiguity that generates real social cost, particularly under regulatory competition. Rules-based systems invert that trade-off: clarity about the compliance process itself, at the cost of a harder problem in translating detailed rules into the regulatory objective they were meant to serve, and, as 2026 has demonstrated, at the cost of needing the machinery to enforce those rules to actually exist on schedule.',
            'Read against that framework, both jurisdictions\' 2026 experiences look less like isolated events and more like textbook illustrations of the trade-off each model was always going to face. The UK\'s principles-based approach required no new enforcement infrastructure, no conformity bodies, no harmonised standards, because it never specified a process to certify against in the first place; it simply extended supervisory expectations it already had the machinery to enforce. That is precisely why it could be reaffirmed in a matter of months rather than delayed by over a year. But the same design choice is what leaves a general-purpose AI chatbot advising a consumer on their pension entirely outside the regime\'s reach, because the regime was built to bind firms, and that chatbot\'s provider is not one. The EU\'s model can, in principle, reach that exact chatbot, because it binds systems meeting a defined technical description rather than firms holding a particular authorisation. But building a Union-wide certification and enforcement apparatus capable of actually assessing those systems against harmonised standards, across twenty-seven member states, on a fixed statutory calendar, has proven to be a substantially harder practical problem than writing the classification itself.',
            'Put simply: the UK\'s gap is a perimeter problem, defined by who the rules bind. The EU\'s gap is an infrastructure problem, defined by when the rules can actually be enforced. Both are boundary failures. Neither is a design flaw unique to one jurisdiction; each is the specific cost that regulatory theory predicts for the specific choice each jurisdiction made.'
          ]
        },
        {
          heading: 'Conclusion',
          paragraphs: [
            'Neither the UK nor the EU has produced a regime that fully answers the question posed by AI in financial services, and the more interesting comparison is not which one is closer to succeeding but what each would need to borrow from the other to close its own gap. The UK\'s Mills Review has already gestured at this, recommending a perimeter review specifically because its principles-based model cannot, by itself, reach activity outside the regulated sector, an acknowledgement that outcome-based regulation eventually needs a harder edge somewhere. The EU\'s Digital Omnibus, in turn, is itself an admission that specifying the rules in exhaustive detail counts for little if the apparatus to enforce them cannot be built to schedule, a lesson in the practical limits of ex-ante prescription that principles-based regulators have long used as their central argument against it. The next eighteen months, as the EU\'s December 2027 deadline approaches and the FCA\'s promised perimeter review takes shape, will be a genuine test of whether either regulator is willing to make that adjustment, or whether both simply continue managing the particular blind spot their founding philosophy built in from the start.'
          ]
        }
      ],
      references: [
        'Aveni.ai (2026) Mills Review: Key Takeaways. Available at: https://aveni.ai/blog/mills-review-takeaways/ (Accessed: 25 August 2026).',
        'Bank of England (2023) SS1/23 – Model risk management principles for banks. Available at: https://www.bankofengland.co.uk/prudential-regulation/publication/2023/may/model-risk-management-principles-for-banks-ss (Accessed: 25 August 2026).',
        'DLA Piper (2026) The Digital AI Omnibus: Proposed deferral of high risk AI obligations under the AI Act. Available at: https://knowledge.dlapiper.com/dlapiperknowledge/globalemploymentlatestdevelopments/2026/The-Digital-AI-Omnibus-Proposed-deferral-of-high-risk-AI-obligations-under-the-AI-Act (Accessed: 25 August 2026).',
        'European Union (2024) Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (Artificial Intelligence Act), Annex III. Available at: https://artificialintelligenceact.eu/annex/3/ (Accessed: 25 August 2026).',
        'FCA (2026) FCA publishes landmark review into impact of AI on retail financial services. Available at: https://www.fca.org.uk/news/press-releases/fca-publishes-landmark-review-impact-ai-retail-financial-services (Accessed: 25 August 2026).',
        'Frantz, P. and Instefjord, N. (2015) Rules vs principles based financial regulation. London School of Economics and Political Science. Available at: http://eprints.lse.ac.uk/87889/ (Accessed: 25 August 2026).',
        'Freshfields (2026) From assistant to decision-maker: the FCA\'s Mills Review charts AI\'s path through retail financial services. Available at: https://www.freshfields.com/en/our-thinking/briefings/2026/07/from-assistant-to-decision-maker-the-fcas-mills-review-charts-ais-path-through-retail-financial-services (Accessed: 25 August 2026).',
        'Gibson Dunn (2026) EU AI Act Omnibus Agreement — Postponed High-Risk Deadlines and Other Key Changes. Available at: https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/ (Accessed: 25 August 2026).',
        'Lexara Advisory (2026) Annex III High-Risk Classification for New York Financial Services. Available at: https://lexaraadvisory.com/annex-iii-high-risk-new-york-financial-services.html (Accessed: 25 August 2026).',
        'Modulos (2026) Operationalise EU AI Act in Financial Services. Available at: https://www.modulos.ai/industries/financial-services/ (Accessed: 25 August 2026).',
        'TLT LLP (2026) The Bank of England and PRA set out plans for safe AI innovation: What firms need to know. Available at: https://www.tlt.com/insights-and-events/insight/the-bank-of-england-and-pra-set-out-plans-for-safe-ai-innovation-what-firms-need-to-know (Accessed: 25 August 2026).'
      ],
      keyTakeaway: 'The UK\'s principles-based model and the EU\'s prescriptive AI Act have each run into the specific weakness their own philosophy was always going to produce: a perimeter problem for the UK, where firm-based rules cannot reach general-purpose tools consumers already trust with financial decisions, and an infrastructure problem for the EU, where a detailed rulebook has had to be delayed sixteen months because the machinery to enforce it was not ready. Each regime would need to borrow the other\'s instinct, a harder edge for the UK and more realism about enforcement timelines for the EU, to close its own gap.'
    },
    {
      kind: 'native',
      title: 'Open Banking vs. Super-Apps: Two Models for Financial Infrastructure',
      author: 'Madison Farrell',
      date: 'August 2026',
      wordCount: '1,352 words',
      readingTime: '7 min read',
      summary: 'The UK legislated open banking into existence before demand for it existed. China let two private platforms build total dominance before regulation caught up. Neither sequencing came free.',
      eyebrow: 'COMMITTEE REPORT · FINANCIAL INFRASTRUCTURE',
      meta: 'Madison Farrell · 1,352 words · 7 min read',
      categories: ['finance', 'technology'],
      sections: [
        {
          heading: 'Introduction',
          paragraphs: [
            'The UK and China have both ended up with financial infrastructure that is data-rich, interoperable, and used by tens of millions of people daily. They arrived there by essentially opposite routes. The UK legislated openness into existence first, as a competition remedy forced onto reluctant incumbent banks, years before much consumer demand existed to use it. China\'s openness emerged the other way round entirely: two private platforms built closed, proprietary payment ecosystems that won near-total market dominance on their own, through network effects and aggressive competition, and the state has spent the years since retrofitting oversight, interoperability requirements, and now a sovereign digital currency onto infrastructure the market had already built. One system\'s central problem has been generating enough demand for infrastructure that regulation created top-down. The other\'s has been asserting enough control over infrastructure that the market created bottom-up. Neither problem is solved, and comparing how each is being worked through says more about the two models than simply describing "open banking" against "super-apps" ever could.'
          ]
        },
        {
          heading: 'The UK — Openness Legislated Before Demand Existed',
          paragraphs: [
            'UK Open Banking exists because the Competition and Markets Authority concluded, following its 2016 retail banking market investigation, that older and larger banks did not have to compete hard enough for customers, and that both personal and business current account holders in Great Britain and Northern Ireland were suffering as a result. The remedy, set out in the CMA\'s Retail Banking Market Investigation Order of 2 February 2017, ordered the nine largest current account providers in the country, together holding over 90% of personal and small business accounts, to fund and adopt a single, common, open API standard rather than nine incompatible ones. This was not a payments directive of the kind the EU introduced through PSD2, it was a competition remedy first, aimed specifically at prying open a concentrated market by mandating standardised access for challengers. The banks themselves were required to establish the delivery body, and Open Banking Limited was incorporated on 21 October 2016 to fulfil that function.',
            'Early adoption was slow, and for good reason: an infrastructure mandated into existence by a regulator does not automatically generate consumer demand to match. Uptake took years to build real scale. By April 2026, the FCA\'s own figures put the picture very differently: 145 active third-party providers and approximately 17 million active users, with open banking payments having grown 53% year on year through 2025. That scale has, in turn, prompted the UK to extend the same logic considerably further. The Data (Use and Access) Act 2025, which received Royal Assent on 19 June 2025, creates a general legal power for government to compel data sharing across sectors through "Smart Data" schemes, of which open banking becomes just one example rather than a standalone regime. Under this framework, open banking\'s original CMA9-only mandate is being folded into something both broader and more binding: the FCA published its open finance roadmap on 14 April 2026, setting out plans to extend the same data-sharing principles to mortgages, SME lending, pensions, insurance and savings by 2030, with a new "Future Entity" set to replace Open Banking Limited as the standard-setting body once the necessary legislation is in place. The direction of travel is unmistakable: from a narrow, competition-driven mandate on nine banks, to a statutory power capable of compelling participation across the wider economy.'
          ]
        },
        {
          heading: 'China — Dominance Built Before Oversight Existed',
          paragraphs: [
            'Alipay and WeChat Pay took the opposite path. Both emerged from existing platforms with enormous captive audiences, Alipay from Alibaba\'s e-commerce ecosystem, WeChat Pay from Tencent\'s messaging app, and both grew into "app within an app" payment systems without ever needing a regulator to mandate their existence. According to the OECD\'s June 2025 competition background note, Alipay and WeChat Pay held approximately 54% and 42% respectively of China\'s mobile payments market in 2024, a combined position close to total market coverage. Tencent\'s own reporting put Weixin and WeChat\'s combined monthly active users at 1.414 billion as of 30 September 2025. This dominance was built through QR codes, network effects, and years of subsidy competition between the two platforms, largely before the state had built a regulatory apparatus capable of properly overseeing it.',
            'The People\'s Bank of China\'s response has been a steady tightening, arriving well after the market position it now governs was already established. Regulations from December 2017 required barcode payment providers to hold a licence and connect to the central bank\'s own clearing infrastructure, aimed partly at curbing the subsidy competition the two platforms had used to build share. In 2019, the PBOC set out a three-year plan specifically to build a regulatory framework for interoperability between the two platforms\' previously separate QR code systems, a strikingly late point at which to be mandating interoperability between infrastructure already handling the overwhelming majority of a major economy\'s retail transactions. Further rules, effective March 2022, drew a harder line between personal and merchant payment codes, aimed at reducing the use of personal accounts to obscure business transactions and, per PBOC officials, at making it harder to funnel money to unlicensed gambling operators. Most recently, the central bank has pursued a different kind of intervention entirely: building its own rail. In 2023, the head of the PBOC\'s Digital Currency Research Institute publicly urged Alipay and WeChat Pay to unify their QR codes specifically to support payments in e-CNY, the central bank\'s own digital currency, explicitly stating that the existing business and regulatory models around the two platforms would not be changed by its rollout. By November 2025, e-CNY had reached 3.48 billion cumulative transactions worth 16.7 trillion yuan, with an interest-bearing framework introduced in January 2026, positioning the state\'s own digital currency as a third rail running alongside, rather than replacing, the private duopoly it now sits beside.'
          ]
        },
        {
          heading: 'Two Different Sequencing Problems',
          paragraphs: [
            'Read together, these are not simply two different technical architectures, an API standard against a QR code, they are two different orderings of the same underlying question: should the state build the rules before the infrastructure exists, or after? The UK chose before, and paid for that choice in years of thin adoption, an infrastructure that technically existed but that ordinary consumers had little reason to seek out, which is precisely why the government has now had to reach for compulsion again through the Data (Use and Access) Act rather than rely on voluntary uptake continuing to build on its own. China chose after, and is paying for that choice differently: through a multi-year, still-ongoing effort to retrofit licensing, interoperability and now a sovereign digital rail onto two privately built platforms that had already become closer to critical national infrastructure than either company likely set out to be, and that now sit uncomfortably close to a level of concentrated data and payments control that would have triggered scrutiny far earlier under a regime built the UK\'s way round.',
            'It is worth resisting a reflex that shows up often in Western commentary on this comparison, treating the Chinese case as a cautionary tale of unchecked platform power and the UK case as the responsible default. The UK\'s own experience complicates that story. A regulator-mandated infrastructure that takes the better part of a decade to reach meaningful usage, and that ultimately requires a second, considerably more coercive piece of legislation to actually generate the participation its designers hoped for, is not an unambiguous success story either. It is simply a different, slower-moving version of the same underlying difficulty China has faced in reverse: getting the rules and the reality to actually meet.'
          ]
        },
        {
          heading: 'Conclusion',
          paragraphs: [
            'Neither jurisdiction got the sequencing free. The UK built the rules first and is still working to generate genuine reliance on them, most visibly through the shift from a voluntary-adjacent competition remedy to a compulsory smart data regime. China let genuine reliance build first and is still working to build rules capable of governing it properly, most visibly through a decade of incremental licensing requirements culminating in the state fielding its own payment rail alongside the platforms it does not fully control. The comparison that matters is not which country has the better payments app. It is which kind of gap, a demand gap or a control gap, a state would rather spend a decade closing.'
          ]
        }
      ],
      references: [
        'Caixin Global (2019) In Depth: The Fight for Dominance in China\'s Mobile Payment Market. Available at: https://www.caixinglobal.com/2019-09-23/in-depth-the-fight-for-dominance-in-chinas-mobile-payment-market-101464880.html (Accessed: 25 August 2026).',
        'CoinLaw (2026) Alipay vs WeChat Pay in 2026: How China and the State Now Split a Trillion-Dollar Payment Market. Available at: https://coinlaw.io/alipay-vs-wechat-pay-statistics/ (Accessed: 25 August 2026).',
        'Competition and Markets Authority (2017) The Retail Banking Market Investigation Order 2017. Available at: https://assets.publishing.service.gov.uk/media/5ca22b3ced915d0c547675a1/Directions_for_RBS_2017.pdf (Accessed: 25 August 2026).',
        'Competition and Markets Authority (2023) Roadmap Completion Decision: The Retail Banking Market Investigation Order 2017. Available at: https://assets.publishing.service.gov.uk/media/63bed8958fa8f513b40f866c/BANKING_PROVIDERS_Roadmap_Completion_Decision_.pdf (Accessed: 25 August 2026).',
        'FCA (2025) FS25/4: Design of the Future Entity for UK open banking. Available at: https://www.fca.org.uk/publications/feedback-statements/fs25-4-design-future-entity-open-banking (Accessed: 25 August 2026).',
        'FCA (2026) Open finance roadmap: our vision for a smart data future. Available at: https://www.fca.org.uk/publications/corporate-documents/open-finance-roadmap (Accessed: 25 August 2026).',
        'Freshfields (2026) Open Finance: The FCA Maps Out a Smart Data Future. Available at: https://www.freshfields.com/en/our-thinking/blogs/risk-and-compliance/open-finance-the-fca-maps-out-a-smart-data-future-102mrqn (Accessed: 25 August 2026).',
        'Land, A. and Roberts, B. (2021) \'Open Banking, the UK Experience\', Competition Policy International. Available at: https://www.competitionpolicyinternational.com/wp-content/uploads/2021/04/1-Open-Banking-the-UK-Experience-By-Adam-Land-Bill-Roberts.pdf (Accessed: 25 August 2026).',
        'Legislation.gov.uk (2025) Data (Use and Access) Act 2025. Available at: https://www.legislation.gov.uk/ukpga/2025/18/notes/division/3/index.htm (Accessed: 25 August 2026).',
        'Sixth Tone (2022) What China\'s New Payment Rules Mean for Alipay, WeChat Pay. Available at: https://www.sixthtone.com/news/1009368/what-chinas-new-payment-rules-mean-for-alipay,-wechat-pay (Accessed: 25 August 2026).',
        'South China Morning Post (2023) China\'s digital yuan head urges unification of Alipay, WeChat Pay QR codes as PBOC pushes e-CNY adoption. Available at: https://www.scmp.com/tech/policy/article/3233367/chinas-digital-yuan-head-urges-unification-qr-codes-alipay-wechat-pay-pboc-pushes-e-cny-adoption (Accessed: 25 August 2026).',
        'TechNode (2020) Alipay and WeChat Pay could be affected by PBOC\'s QR code standards. Available at: https://technode.com/2017/12/28/alipay-wechat-pay-affected-pbocs-qr-code-standards/ (Accessed: 25 August 2026).'
      ],
      keyTakeaway: 'The UK and China solved the same problem, interoperable financial infrastructure, in reverse order: the UK legislated openness before demand existed, China let two private platforms build dominance before regulation existed. Each is now spending years compensating for the gap its own sequencing created, not because one model failed and the other succeeded, but because neither ordering comes free.'
    },
    {
      kind: 'native',
      title: 'The Financial Literacy Gap Nobody\'s Closing: Why School Isn\'t the Answer',
      author: 'Madison Farrell',
      date: 'August 2026',
      wordCount: '1,308 words',
      readingTime: '7 min read',
      summary: 'Financial education has been compulsory in English schools for over a decade. The government\'s own tracking shows the number of children actually reached hasn\'t moved since 2019. Here\'s what the evidence says would.',
      eyebrow: 'COMMITTEE REPORT · FINANCIAL LITERACY',
      meta: 'Madison Farrell · 1,308 words · 7 min read',
      categories: ['finance'],
      sections: [
        {
          heading: 'Introduction',
          paragraphs: [
            'Financial education has been a compulsory part of the English school curriculum for over a decade. It was written into citizenship education for 11 to 16 year olds in September 2014, following years of campaigning, and reinforced through the maths curriculum alongside it. By any reasonable policy logic, a decade should be long enough for a compulsory subject to show measurable results. It has not. The Money and Pensions Service, the government-established body responsible for tracking progress toward its own national goal on this exact issue, found that the proportion of children receiving a meaningful financial education stood at 47% in 2022, against 48% in 2019, a result it describes plainly as static. The 2030 target, 6.8 million children receiving meaningful financial education against a 2020 baseline of 4.8 million, is not being approached at a pace that gets there. This is not an argument that teaching children about money is pointless. It is evidence that the specific policy mechanism relied upon, a single mandatory subject taught in schools, has been tried, at scale, for long enough to judge, and the number has not moved. The more interesting question is not whether school-based financial education should continue, but why it has been treated as sufficient on its own for over a decade despite consistently flat results, and what the same evidence base says would actually make a difference.'
          ]
        },
        {
          heading: 'A Decade of Compulsion, an Unmoved Needle',
          paragraphs: [
            'The 2014 reform made financial education a required part of citizenship studies at Key Stages 3 and 4, covering budgeting, credit and debt, insurance, savings, pensions and how public money is raised and spent, alongside a secondary role within the maths curriculum. Two structural limits were built in from the start. First, it applied only to secondary-age pupils; primary schools were never brought within the compulsory requirement, leaving the maths curriculum\'s passing reference to financial contexts as the only formal exposure most children received before the age of eleven. Second, and more consequentially, the requirement binds local-authority-maintained schools, not academies or free schools, which by law are not required to follow the National Curriculum at all. In practice, many choose to anyway, but "many" is doing a great deal of work in a school system where academies now make up the substantial majority of English secondaries. A requirement that a large share of the schools it is meant to apply to are legally free to ignore is not really compulsory in the way the word usually implies.',
            'The UK Parliament\'s Education Committee examined implementation directly and found that despite financial education having been on the curriculum for over a decade, many teachers still lack confidence delivering its content, and many schools struggle to prioritise it beyond the most basic calculations involving money. Martin Lewis, the campaigner most credited with getting financial education onto the curriculum in the first place, has since described that achievement as a "pyrrhic victory", a striking admission from someone who fought for the policy, pointing to the lack of resourcing behind it and the academy opt-out as the reasons it never delivered what was promised. The government\'s own November 2025 curriculum review appears to accept this critique implicitly, proposing to extend statutory financial education to primary schools for the first time and to sharpen secondary content around digital risks such as fraud and scam prevention. What it does not propose is any structural change to the underlying delivery model: the answer to a decade of a single-channel policy underperforming is, so far, more of the same single channel, applied earlier.'
          ]
        },
        {
          heading: 'What the Evidence Actually Points Toward',
          paragraphs: [
            'MaPS\'s own 2022 survey contains the sharper diagnosis, and it has attracted far less policy attention than the headline compulsory-curriculum debate. The survey found that 33% of children recalled financial education at school that they found useful, 24% received financial education at home, and only 10% received both. Critically, MaPS reported that children who received this "joined-up" financial education, spanning both school and home, were more likely to demonstrate good day-to-day money management than those who received either one alone or neither. The national goal itself is measured generously, counting a child as having received a "meaningful financial education" if they report either school-based learning they found useful or structured money responsibility at home, not necessarily both. That is a reasonable way to track broad reach, but it also means the headline 47% figure includes a great many children who received only one half of what the same research identifies as the more effective combination.',
            'This lines up with a separate, independent data point: youth-focused research from the London Foundation for Banking & Finance has found that only 9% of young people name school as their main source of financial understanding, and just 2% name a bank, with the overwhelming majority learning informally, primarily from parents and friends, whether the formal system accounts for that or not. Read together, these two findings describe the same gap from opposite directions. Policy has spent over a decade building and mandating the school half of the equation. The evidence base it produced along the way suggests the home half, and specifically the combination of both, is what actually predicts whether a young person manages money well, and that half has received comparatively little structural investment or attention. MaPS has funded some targeted work in this direction, including grant programmes aimed at teacher training and provision for vulnerable groups, but the primary lever governments have reached for, in 2014 and again in the 2025 curriculum review, remains the classroom mandate rather than anything designed to close the joined-up gap directly.'
          ]
        },
        {
          heading: 'Why School Keeps Being the Answer Anyway',
          paragraphs: [
            'It is worth asking honestly why policymakers keep returning to the same lever given this evidence. The most likely reason is not that the evidence is unpersuasive, but that the school curriculum is simply the only part of this problem a government can mandate by statute. Nobody can legislate that a parent discuss a payslip with their teenager, or that a family sets clear rules around pocket money and saving, the "home" half of MaPS\'s own joined-up measure. A curriculum requirement is legible, auditable and politically simple to announce, a new statutory duty with a start date, whereas funding and scaling interventions that reach families directly, in the way MaPS\'s smaller grant-funded pilots have begun to attempt, is slower, harder to standardise, and less visible as a single policy announcement. The 2025 curriculum review\'s decision to extend the same mechanism to primary schools, rather than building new infrastructure around the joined-up finding, reads less like a rejection of the evidence and more like a continuation of applying the one lever that is administratively available, regardless of what the government\'s own commissioned research says actually works best.'
          ]
        },
        {
          heading: 'Conclusion',
          paragraphs: [
            'None of this argues for abandoning school-based financial education. It argues against treating it as sufficient, which is functionally what a decade of policy attention has done. The number that mattered, MaPS\'s own tracked measure of children receiving a meaningful financial education, has not moved since 2019, and the reform now in progress bets on the same mechanism reaching younger children rather than addressing the gap its own evidence identified: that impact is concentrated among the small minority who get financial education from both school and home together, not either channel working alone. If the 2030 target is to be met rather than quietly missed the way the current trajectory suggests, the more honest policy question is not "how do we get financial education into more classrooms," which has already been the answer once, but "what would it take to close the joined-up gap MaPS itself identified", a considerably harder question, and one that has so far received a fraction of the policy attention the classroom mandate has.'
          ]
        }
      ],
      references: [
        'FinCap (2023) UK Children and Young People\'s Financial Wellbeing Survey. Available at: https://www.fincap.org.uk/en/insights/uk-children-and-young-peoples-financial-wellbeing-survey (Accessed: 20 August 2026).',
        'House of Commons Library (2026) Financial and enterprise education in schools. Available at: https://commonslibrary.parliament.uk/research-briefings/sn06156/ (Accessed: 20 August 2026).',
        'House of Lords Library (2024) Financial education in schools. Available at: https://lordslibrary.parliament.uk/financial-education-in-schools/ (Accessed: 23 August 2026).',
        'IFA Magazine (2025) Government unveils modernised curriculum to equip young people with life and work skills — including financial education. Available at: https://ifamagazine.com/government-unveils-modernised-curriculum-to-equip-young-people-with-life-and-work-skills-including-financial-education-reaction/ (Accessed: 25 August 2026).',
        'Money and Pensions Service (2020) UK Strategy for Financial Wellbeing. Available at: https://maps.org.uk/en/our-work/uk-strategy-for-financial-wellbeing (Accessed: 20 August 2026).',
        'MoneySavingExpert.com (2024) MPs finally call for compulsory financial ed in English primary and secondary schools after damning evidence from Martin Lewis and others. Available at: https://www.moneysavingexpert.com/news/2024/05/martin-lewis-financial-education-committee/ (Accessed: 22 August 2026).',
        'UK Parliament Education Committee (2024) Delivering effective financial education. Available at: https://committees.parliament.uk/committee/203/education-committee/news/201630/delivering-effective-financial-education-education-committee-publishes-report/ (Accessed: 25 August 2026).'
      ],
      keyTakeaway: 'A decade of compulsory school-based financial education has left the government\'s own tracked measure flat, 47% in 2022 against 48% in 2019, and the current reform bets on the same single lever reaching younger children rather than addressing what the evidence actually shows: outcomes are concentrated among the small minority who get a joined-up education spanning both school and home, not either channel alone.'
    },
    {
      "kind": "native",
      "slug": "dollarisation-by-code",
      "title": "Dollarisation by Code: Can Sterling Stablecoins Hold the Line Against the Dollar?",
      "author": "Madison Farrell · BA (Hons) International Business with Italian",
      "date": "October 2026",
      "eyebrow": "COMMITTEE REPORT · STABLECOIN REGULATION",
      "meta": "Madison Farrell · BA (Hons) International Business with Italian",
      "categories": [
        "finance",
        "technology",
        "law"
      ],
      "abstract": [
        "Stablecoins have moved from the margins of cryptoasset trading into the centre of debates about the future of money. The market is now overwhelmingly denominated in US dollars, and the United States has legislated to turn that dominance into a durable feature of the global financial system. The euro area treats the same development as a direct threat to its monetary sovereignty. The United Kingdom has chosen a third path: a two-tier regime in which the Financial Conduct Authority (FCA) regulates stablecoin issuance generally and the Bank of England supervises sterling stablecoins that become systemic. In June 2026 the Bank softened its original proposals, dropping individual holding limits and loosening its backing requirements, in response to arguments that a stricter regime would leave sterling tokens uncompetitive against dollar rivals. This report asks whether the UK framework can protect sterling's role in a tokenised financial system. It argues that the regime is well calibrated for domestic financial stability but poorly aimed at the sovereignty question, because the real contest between currencies will be decided in wholesale and tokenised settlement rather than in retail payments, and because the regime's structure risks penalising the sterling tokens that succeed."
      ],
      "sections": [
        {
          "heading": "1. Introduction",
          "paragraphs": [
            "Money has always been a form of infrastructure, and infrastructure has always been a source of power. The dollar's position at the centre of international trade, debt issuance and foreign exchange reserves gives the United States what Eichengreen (2011) famously called an \"exorbitant privilege\": cheaper borrowing, deeper capital markets and considerable leverage over the financial behaviour of other states. For most of the post-war period that privilege rested on banks, correspondent networks and payment systems that other countries could observe, regulate and occasionally route around. Stablecoins introduce a new layer to this arrangement. They allow dollar-denominated value to circulate directly between individuals and firms anywhere with an internet connection, outside the domestic banking system of the country where they are used.",
            "The scale of this shift is no longer trivial. By mid-2026 the stablecoin market had reached roughly USD 300 billion, with over 99 per cent of that value denominated in US dollars and two issuers, Tether and Circle, responsible for more than four-fifths of supply, while euro-denominated stablecoins together amounted to well under EUR 1 billion (European Merchant Bank, 2026). For a country whose currency has been a global reserve asset for over two centuries, this raises an uncomfortable question about whether sterling will have a meaningful place in the next generation of payments infrastructure.",
            "The research question this report addresses is therefore:",
            {
              "quote": "Can the UK's stablecoin regime protect sterling's monetary sovereignty in a financial system increasingly dominated by dollar-denominated tokens?"
            }
          ]
        },
        {
          "heading": "2. Why the currency of a stablecoin matters",
          "paragraphs": [
            "A stablecoin is a privately issued token that promises redemption at par in a reference currency, backed by a pool of reserve assets held by the issuer. In economic terms it resembles a narrow bank liability. Gorton and Zhang (2023) draw the comparison with the \"wildcat\" banknotes of nineteenth-century America, privately issued paper that traded at fluctuating discounts depending on the perceived quality of the issuing bank, and argue that stablecoins reproduce many of the same vulnerabilities. The Bank for International Settlements (2025) goes further, assessing stablecoins against three tests it regards as essential for any form of money to serve as the foundation of a monetary system: singleness (every unit is accepted at par without question), elasticity (supply can expand to meet the economy's payment needs) and integrity (the system resists financial crime). It concludes that stablecoins perform poorly on all of them.",
            "The currency of denomination matters because each dollar stablecoin is, in effect, an exported dollar liability. When a business in Lagos, Istanbul or Manchester holds a dollar stablecoin, it holds a claim whose value moves with US monetary conditions, and the issuer typically backs that claim with short-term US government debt. This creates a channel through which American monetary policy is transmitted directly into the payment balances of non-American users, reinforcing what Rey (2013) describes as the global financial cycle, in which conditions set in Washington shape credit and asset prices worldwide regardless of local exchange rate arrangements. It also extends the reach of US legal jurisdiction. Farrell and Newman (2019) show how states that control central nodes in global networks can turn that control into coercive leverage, a concept they term \"weaponised interdependence\". A payments system built on dollar tokens issued under US law, held in US-regulated custody and backed by US Treasury bills is a network with Washington at its centre.",
            "For smaller monetary areas, the consequences are potentially serious. If dollar stablecoins came into wide use for payments, saving or settlement, the issuing central bank's control over domestic monetary conditions could be weakened (Schaaf, 2025). The question for the United Kingdom is whether this risk applies to sterling with the same force, and whether its regulatory response is designed to meet it."
          ]
        },
        {
          "heading": "3. The United States: regulation as strategy",
          "paragraphs": [
            "The American approach makes the strategic dimension explicit. The GENIUS Act, signed into law on 18 July 2025, restricts the issuance of payment stablecoins in the United States to permitted issuers and registered foreign issuers, and offers federal, state and foreign routes to authorisation (Orrick, 2025). The Act imposes reserve and disclosure requirements that are, on their face, consumer protection measures. Issuers must publish monthly reports on reserve composition and outstanding supply, certified by their chief executive and chief financial officer, and holders receive a first-priority security interest in the reserve assets if the issuer becomes insolvent (A&O Shearman, 2025).",
            "The protective function of these rules should not obscure their geopolitical effect. Because permitted reserves consist overwhelmingly of cash, central bank deposits and short-dated Treasury securities, every dollar of stablecoin growth creates a dollar of demand for US government debt. Regulatory legitimacy makes dollar tokens more attractive to institutional users worldwide, and that attractiveness is converted directly into financing for the US state. At the same time, commentators have noted that the requirements for foreign issuers, including a comparability determination that requires unanimous approval, create significant barriers to non-US issuers seeking access to the American market (A&O Shearman, 2025). The architecture is asymmetric by design: dollar tokens are encouraged to flow outward, while foreign tokens face a high wall on the way in."
          ]
        },
        {
          "heading": "4. The euro area: sovereignty as the central concern",
          "paragraphs": [
            "European institutions have framed the same development in defensive terms. In a widely cited blog post, an ECB adviser warned that European monetary sovereignty and financial stability could erode without a strategic response, noting that dollar stablecoins accounted for some 99% of total stablecoin market capitalisation while euro-denominated stablecoins remained below €350 million (Schaaf, 2025). The same analysis observed that in tokenised settlement, where a dependable digital cash equivalent is essential, dollar stablecoins may lock in their early dominance unless credible euro alternatives emerge.",
            "What is striking about the European debate is that it does not produce a single answer. In May 2026, ECB President Christine Lagarde cautioned against promoting euro stablecoins as Europe's response to the US strategy, arguing that Europe should instead build public settlement infrastructure anchored in central bank money (Lovguiden, 2026). The Deutsche Bundesbank has taken a more permissive view, and commercial banks have moved ahead regardless. A consortium of nine lenders, including ING, UniCredit, CaixaBank and the Italian bank Banca Sella, announced plans to issue a MiCA-compliant euro stablecoin in the second half of 2026 (Yahoo Finance, 2025). Meanwhile, the digital euro is targeting full issuance in 2029, conditional on EU legislation being adopted by the end of 2026 (CoinPaprika, 2026). The euro area therefore illustrates the tension that any non-dollar jurisdiction faces: a private stablecoin may offer the fastest route to market presence, but it also weakens the transmission of monetary policy through the banking system, which is precisely the mechanism a central bank seeks to protect."
          ]
        },
        {
          "heading": "5. The United Kingdom's two-tier regime",
          "paragraphs": [
            "The UK framework divides responsibility between two regulators. The FCA's final rules, published on 30 June 2026, build on a licensing regime created by the Financial Services and Markets Act 2000 (Cryptoassets) Regulations 2026, which brings the issuance of qualifying stablecoins within the regulatory perimeter (A&O Shearman, 2026), and the regime will come into force on 25 October 2027 (BCLP, 2026). Under the joint arrangements, the FCA regulates every UK stablecoin issuer, and once HM Treasury recognises an issuer as systemic, the Bank of England takes the lead on prudential rules under joint oversight (Payment Expert, 2026).",
            "The Bank's own regime has shifted considerably since it was first proposed. Its November 2025 consultation suggested holding limits of £20,000 per coin for individuals and £10 million for businesses, presented as a transitional measure against the risk of deposits draining from banks (Linklaters, 2025). The June 2026 policy statement abandoned those limits in favour of a temporary issuance guardrail of £40 billion per systemic stablecoin, and raised the maximum share of backing assets that may be held in short-term UK government debt from 60% to 70%, with the remainder held as central bank deposits (The Paypers, 2026). Systemic issuers will not be allowed to pay interest to holders (The Block, 2026), and the Bank confirmed plans for a future liquidity facility for eligible systemic issuers (PwC, 2026).",
            "The reasons for the change are revealing. The Bank's Deputy Governor had signalled in May 2026 that it was reconsidering holding limits and reserve requirements after digital asset firms argued that the restrictions would hinder adoption and leave UK-issued stablecoins less competitive than dollar-backed rivals (Cointelegraph, 2026). In other words, the competitive pressure exerted by dollar tokens shaped the design of the sterling regime before a single systemic sterling stablecoin had been issued."
          ]
        },
        {
          "heading": "6. Does the regime hold the line?",
          "paragraphs": [
            "The UK regime should be assessed against two distinct objectives that are often conflated. The first is domestic financial stability: protecting bank funding, ensuring redemption at par and preventing runs. The second is monetary sovereignty: ensuring that sterling, and the Bank of England's influence over sterling conditions, retain a meaningful role as payments become tokenised. The regime performs well against the first objective and considerably less well against the second.",
            "On domestic stability, the design is coherent. The prohibition on interest removes the main incentive for households to move savings from bank deposits into stablecoins, and the requirement to hold part of the backing in central bank deposits ensures that redemptions can be met quickly even under stress. The liquidity facility addresses the run dynamics that Gorton and Zhang (2023) identify as the central weakness of privately issued money. The issuance guardrail allows the Bank to observe the effects of growth before it becomes unmanageable.",
            "The sovereignty question is harder, and it depends on where the competition between currencies will take place. In retail payments, the threat to sterling is limited. Domestic consumers already have fast, cheap and well-protected options through Faster Payments and card schemes, and a dollar stablecoin offers a UK household currency risk without a compensating benefit. In this setting, the UK is in a stronger position than emerging economies with unstable currencies or the euro area with its fragmented payment landscape.",
            "Wholesale and tokenised settlement is a different matter. As securities, funds and eventually deposits are issued on distributed ledgers, those markets will need a settlement asset that lives on the same infrastructure. Whichever asset becomes the default for that role is likely to benefit from strong network effects, because liquidity attracts liquidity. Dollar stablecoins already enjoy a head start measured in hundreds of billions. Set against that scale, a £40 billion cap on any single sterling coin signals caution more than ambition, and the Bank's own framing, which positions stablecoins alongside tokenised deposits and a possible retail digital pound as one element of a \"multi-money\" system, leaves open which asset is meant to anchor sterling-denominated tokenised markets.",
            "The regime also contains a structural asymmetry that deserves more attention than it has received. Stablecoins that are not designated as systemic and are used mainly for cryptoasset transactions, including USDT and USDC, remain under the FCA's supervision alone (The Block, 2026). A sterling stablecoin that succeeds, gaining enough use in payments to be recognised as systemic, moves into the more demanding Bank of England regime, with its backing constraints, its interest prohibition and its issuance guardrail. A dollar stablecoin with significant UK usage may remain outside that regime unless HM Treasury chooses to recognise it. The effect is a potential penalty on success that applies to domestic issuers more readily than to foreign ones. The Bank has acknowledged the need for a managed transition between the two tiers, but managing a transition is a different task from ensuring competitive neutrality between sterling and dollar tokens operating in the same market."
          ]
        },
        {
          "heading": "7. Policy implications",
          "paragraphs": [
            "If the sovereignty objective is taken seriously, four adjustments would strengthen the UK's position without sacrificing the stability gains of the current design.",
            "First, the authorities should treat sovereignty principally as a settlement question. The decisive contest is over which asset settles tokenised transactions in sterling markets, and the strongest answer is one anchored in central bank money. The Bank's existing work on tokenised settlement and the Digital Securities Sandbox gives it a foundation; the priority should be ensuring that wholesale tokenised markets in the UK can settle in a sterling asset with the safety of central bank money before dollar tokens become entrenched by default.",
            "Second, HM Treasury should publish clear, quantitative criteria for recognising foreign-currency stablecoins as systemic when their use in UK payments reaches a defined threshold. This would remove the asymmetry identified above and ensure that the most demanding rules apply according to a token's role in the UK economy rather than its currency of denomination.",
            "Third, the issuance guardrail should come with a published review path. Uncertainty about whether and when the £40 billion figure will rise is itself a competitive handicap, because institutional users choosing a settlement asset need confidence that it can scale with their activity.",
            "Fourth, the UK should pursue comparability arrangements with the European Union, where the sovereignty concern is shared. A coordinated approach to recognising each other's regulated non-dollar stablecoins would create a larger combined market than either jurisdiction can offer alone, and would give both a stronger position when negotiating access under the comparability provisions of the GENIUS Act."
          ]
        },
        {
          "heading": "8. Conclusion",
          "paragraphs": [
            "The UK's stablecoin regime is a careful piece of financial engineering, and its June 2026 revisions show a central bank willing to adjust in response to evidence and argument. Judged as a framework for protecting bank funding and ensuring redemption at par, it is among the more robust in the world. Judged as a defence of sterling's monetary sovereignty, it is incomplete. The softening of the Bank's proposals was itself a response to dollar competition, which demonstrates how much the regime's design is shaped by forces it does not control.",
            "Sterling is not in immediate danger in British retail payments. The risk lies in a slower and less visible process, in which the infrastructure of tokenised finance is built around a dollar settlement asset because no credible sterling alternative existed when the choice was made. Monetary sovereignty in the twenty-first century will depend less on who prints the notes than on whose liabilities sit at the centre of the ledgers. The UK has built a sound framework for regulating the coins. The more consequential task is securing a place for sterling in the settlement layer beneath them."
          ]
        }
      ],
      "references": [
        "A&O Shearman (2025) *The GENIUS Act: transforming US stablecoin regulation*. Available at: https://www.aoshearman.com/insights/ao-shearman-on-fintech-and-digital-assets/the-genius-act-transforming-us-stablecoin-regulation (Accessed: 23 October 2026).",
        "A&O Shearman (2026) *UK FCA confirms final rules for new UK crypto regime*. Available at: https://finreg.aoshearman.com/uk-fca-confirms-final-rules-for-new-uk-crypto-regime (Accessed: 23 October 2026).",
        "Bank for International Settlements (2025) 'The next-generation monetary and financial system', in *Annual Economic Report 2025*. Basel: BIS.",
        "Bank of England (2025) *Proposed regulatory regime for sterling-denominated systemic stablecoins*. Consultation Paper, November 2025. London: Bank of England.",
        "Bank of England (2026) *Policy statement and draft Code of Practice for sterling-denominated systemic stablecoin issuers*. London: Bank of England.",
        "BCLP (2026) *The FCA's final crypto regime: what firms need to know and do next*. Available at: https://www.bclplaw.com/en-US/events-insights-news/the-fcas-final-crypto-regime-what-firms-need-to-know-and-do-next.html (Accessed: 23 October 2026).",
        "CoinPaprika (2026) *Lagarde warns dollar stablecoins erode Europe's financial sovereignty*. Available at: https://coinpaprika.com/news/lagarde-dollar-stablecoins-europe-sovereignty/ (Accessed: 23 October 2026).",
        "Cointelegraph (2026) *Bank of England eases stablecoin rules, introduces 40B pound issuance cap*. Available at: https://cointelegraph.com/news/bank-of-england-stablecoin-rules-clears-path-for-2027-launch (Accessed: 23 October 2026).",
        "Eichengreen, B. (2011) *Exorbitant Privilege: The Rise and Fall of the Dollar and the Future of the International Monetary System*. Oxford: Oxford University Press.",
        "European Merchant Bank (2026) *Euro stablecoins and the EU's monetary sovereignty*. Available at: https://em.bank/blog/thought-leadership/euro-stablecoins-and-the-eus-monetary-sovereignty/ (Accessed: 23 October 2026).",
        "Farrell, H. and Newman, A.L. (2019) 'Weaponized interdependence: how global economic networks shape state coercion', *International Security*, 44(1), pp. 42-79.",
        "Financial Conduct Authority (2026) *PS26/10: Stablecoin issuance*. London: FCA.",
        "Gorton, G.B. and Zhang, J.Y. (2023) 'Taming wildcat stablecoins', *University of Chicago Law Review*, 90(3), pp. 909-971.",
        "Linklaters (2025) *Bank of England consults on UK regime for systemic stablecoins*. Available at: https://financialregulation.linklaters.com/post/102lu4i/bank-of-england-consults-on-uk-regime-for-systemic-stablecoins (Accessed: 23 October 2026).",
        "Lovguiden (2026) *ECB warns against euro stablecoins, builds DLT infrastructure instead*. Available at: https://lovguiden.dk/en/det-offentlige/den-europaeiske-centralbank/2026-05-08-ecb-advarer-mod-eurostablecoins-bygger-i-stedet-dlt-infrastruktur (Accessed: 23 October 2026).",
        "Orrick (2025) *Stablecoin framework signed into law*. Available at: https://www.orrick.com/en/Insights/2025/07/Stablecoin-Framework-Signed-into-Law (Accessed: 23 October 2026).",
        "Payment Expert (2026) *FCA sets final crypto rules, Bank takes systemic stablecoins*. Available at: https://paymentexpert.com/2026/06/30/fca-crypto-rules-bank-stablecoin/ (Accessed: 23 October 2026).",
        "PwC (2026) *BoE softens systemic stablecoin rules*. Available at: https://www.pwc.co.uk/industries/financial-services/understanding-regulatory-developments/boe-softens-systemic-stablecoin-rules.html (Accessed: 23 October 2026).",
        "Rey, H. (2013) 'Dilemma not trilemma: the global financial cycle and monetary policy independence', *Proceedings of the Economic Policy Symposium, Jackson Hole*. Kansas City: Federal Reserve Bank of Kansas City, pp. 285-333.",
        "Schaaf, J. (2025) *From hype to hazard: what stablecoins mean for Europe*. The ECB Blog, 28 July. Available at: https://www.ecb.europa.eu/press/blog/date/2025/html/ecb.blog20250728~e6cb3cf8b5.en.html (Accessed: 23 October 2026).",
        "The Block (2026) *Bank of England drops proposed holding caps for sterling stablecoins, sets £40 billion issuance guardrail*. Available at: https://www.theblock.co/news/regulation/2026-06-22-bank-of-england-drops-proposed-individual-holding-caps-for-sterling-stablecoins-sets-40-billion-issuance-guardrail-405545 (Accessed: 23 October 2026).",
        "The Paypers (2026) *Bank of England publishes stablecoin rules for systemic issuers*. Available at: https://thepaypers.com/regulations/news/bank-of-england-publishes-stablecoin-rules-for-systemic-issuers (Accessed: 23 October 2026).",
        "Yahoo Finance (2025) *Nine European banks to launch MiCA euro stablecoin in 2026*. Available at: https://finance.yahoo.com/news/nine-european-banks-launch-mica-130701192.html (Accessed: 23 October 2026)."
      ]
    },
    {
      "kind": "native",
      "slug": "who-authorised-that",
      "title": "Who Authorised That? AI Agents and the Breakdown of Payment Consent",
      "author": "Madison Farrell · BA (Hons) International Business with Italian",
      "date": "October 2026",
      "eyebrow": "COMMITTEE REPORT · AI AGENTS & PAYMENTS",
      "meta": "Madison Farrell · BA (Hons) International Business with Italian",
      "categories": [
        "finance",
        "law",
        "technology"
      ],
      "abstract": [
        "UK payments law rests on a simple division between authorised and unauthorised transactions. Where a customer has consented to a payment, the loss generally falls on the customer; where they have not, the payment service provider must normally refund it. Agentic payments, in which an AI system initiates transactions on a person's behalf under a broad instruction rather than a specific approval, place that division under considerable strain. In July 2026 HM Treasury formally asked whether the Payment Services Regulations 2017 need to change to accommodate them. This report examines how the existing framework applies to agent-initiated payments, identifies the scenarios in which it produces unclear or unfair outcomes, and evaluates the main candidate models for allocating loss. It argues that the signed mandate, rather than the individual transaction, should become the legal unit of consent, and that residual losses arising from agent error or manipulation should fall on the party best placed to prevent them, which in most cases is the regulated provider of the agentic service."
      ],
      "sections": [
        {
          "heading": "1. Introduction",
          "paragraphs": [
            "For most of the history of electronic payments, a person has stood at the moment of decision. A customer enters a card number, approves a transfer in a banking app, or authorises a direct debit with full knowledge of its terms. The law has been built around that moment. Consent is given or withheld, authentication confirms who gave it, and liability follows from the answer.",
            "Agentic AI changes the structure of that moment. A customer may now instruct an AI system to keep office supplies stocked within a monthly budget, rebook a cancelled flight at the best available fare, or switch energy supplier whenever a cheaper tariff appears. The system then searches, compares, decides and pays, often without any further input. The customer has consented to something, but what they consented to is a goal and a set of constraints, and the individual payment that results is a decision the customer never saw.",
            "UK policymakers have recognised the problem. HM Treasury's consultation of 14 July 2026 on modernising payment services regulation asks whether the Payment Services Regulations 2017 should be updated in areas such as authentication, consent and liability for unauthorised transactions so that agentic payments can operate safely and at scale (A&O Shearman, 2026). A companion Financial Services AI Adoption Plan, published the same day, calls for an agentic payments trust framework including a \"Know Your Agent\" standard and secure machine-to-machine authentication (Finexer, 2026).",
            "The research question of this report is therefore:",
            {
              "quote": "When an AI agent initiates a payment on a customer's behalf and the outcome is one the customer did not want, who should bear the loss under UK law, and what should the rules be?"
            }
          ]
        },
        {
          "heading": "2. How agentic payments work",
          "paragraphs": [
            "The infrastructure for agentic payments is developing rapidly and largely through private standard-setting. Google announced its open Agent Payments Protocol (AP2) on 16 September 2025 with more than sixty launch partners, including Mastercard, PayPal, Coinbase and American Express (Eco, 2026). The protocol's central concept is the mandate. An Intent Mandate records the conditions a user has approved in advance, while a Cart Mandate gives explicit authorisation for a specific purchase, and both act as tamper-evident records using verifiable credential standards (Gefferie, 2025). Card networks have built parallel arrangements. Mastercard's Agent Pay uses tokenisation to allow AI agents to transact on a user's behalf (Technology Magazine, 2025), and Visa requires providers of agentic payment services to register with the network and to maintain a defensible chain of authorisation by verifying the user's instruction, enforcing controls that reflect the scope of what was delegated, and keeping transaction-level records (Goodwin Procter, 2026).",
            "Two features of this emerging architecture matter for the legal analysis. The first is that the customer's consent is increasingly expressed as a structured, machine-readable mandate, which creates the possibility of determining with some precision what the customer did and did not authorise. The second is that the rules governing mandates are currently being written by card networks and technology firms through contract and scheme rules. Private ordering is filling a space that public law has not yet occupied."
          ]
        },
        {
          "heading": "3. The current UK framework",
          "paragraphs": [
            "The Payment Services Regulations 2017 (PSRs) allocate loss primarily through the concept of consent. Regulation 67 provides that a payment transaction is authorised only where the payer has given consent, and it requires the payer to consent to each specific transaction or to a defined series of transactions (Finexer, 2026). Where a transaction is unauthorised, regulation 76 requires the payer's provider to refund it promptly, subject to limited exceptions. Regulation 77 restricts the payer's own liability: a payer may bear up to £35 of losses arising from a lost or stolen payment instrument, and bears the full loss only where they have acted fraudulently or failed, intentionally or with gross negligence, to keep their security credentials safe. The structure is consumer-protective for unauthorised transactions and largely indifferent to the merits of authorised ones.",
            "That indifference was confirmed by the Supreme Court in *Philipp v Barclays Bank UK plc* [2023] UKSC 25. Mrs Philipp had been deceived by fraudsters into instructing her bank to transfer her savings, and argued that the bank owed her a duty to protect her from her own instruction. The Court rejected the claim, holding that where a customer has authorised a payment, the bank's basic duty is to execute it, and that the so-called *Quincecare* duty arises only where the instruction comes from an agent whose authority is in doubt. The decision draws a firm line: authorisation places the risk of a bad decision on the person who made it.",
            "Regulation has softened that line for one category of loss. Since 7 October 2024, mandatory reimbursement for authorised push payment (APP) fraud has required sending and receiving payment providers to reimburse most victims, with liability split 50/50 between the two providers (Payment Expert, 2026a), up to a maximum of £85,000 per claim. APP reimbursement represents a policy judgement that, at least where fraud is involved, the formal fact of authorisation should not settle the question of who bears the loss."
          ]
        },
        {
          "heading": "4. Where the binary breaks down",
          "paragraphs": [
            "The difficulty with agentic payments is that they generate outcomes that do not fit comfortably on either side of the authorised and unauthorised divide. Four scenarios illustrate the problem.",
            "In the first, a criminal gains control of the customer's agent or the credentials it uses and directs payments to themselves. This is the easiest case. A criminal who compromises an account and diverts funds to themselves does not become legitimate merely because an AI tool was involved (Ashfords, 2026), and the transaction is unauthorised in the ordinary sense, triggering the refund obligation under regulation 76.",
            "In the second, the agent is manipulated rather than hijacked. A malicious website might contain hidden instructions that cause the agent to purchase from a fraudulent merchant, a technique known as prompt injection. The customer's credentials were never compromised, the agent acted within its technical permissions, and the payment was initiated through the channel the customer had approved. Formally, the transaction looks authorised. Substantively, the customer would never have approved it, and the agent was deceived in a way that closely resembles the deception practised on Mrs Philipp. Under *Philipp*, the loss would fall on the customer; under the logic of APP reimbursement, it arguably should not.",
            "In the third, the agent makes a genuine error within its mandate. It buys the wrong item, misreads a fare or renews a subscription the customer had meant to cancel. No third party is at fault and nothing was hacked. The payment is authorised in every formal sense, and the customer's complaint is really about the quality of the service the agent's provider supplied.",
            "In the fourth, the agent exceeds its mandate, spending above an agreed limit or buying a category of goods the customer had excluded. Regulation 67's reference to a \"defined series of transactions\" was drafted with standing orders and recurring card payments in mind, where the parameters are fixed in advance. An intent-based mandate is open-textured by design. Whether a particular payment falls inside or outside it may depend on interpretation, which is exactly the kind of judgement the agent was given discretion to exercise. The question of whether the payment was authorised therefore turns on the content of the mandate, which current law does not define.",
            "One US analysis concludes that existing rules allocate risk between customers and financial institutions with reasonable clarity, but leave unresolved the position between a user and the provider of the agentic service where the agent is alleged to have acted outside its authority (Goodwin Procter, 2026). The scenarios above suggest that the UK position is less settled still, because the PSRs make the customer's consent the decisive fact and agentic systems make that consent difficult to locate."
          ]
        },
        {
          "heading": "5. The limits of agency law",
          "paragraphs": [
            "An obvious response is to treat the AI system as the customer's agent and apply the established law of agency, under which a principal is bound by acts within the agent's actual or apparent authority. Chopra and White (2011) argued over a decade ago that autonomous software could be analysed in precisely these terms. The analogy is attractive because agency law already contains a sophisticated vocabulary for scope of authority, ratification and the allocation of loss when agents overstep.",
            "The analogy has a significant limitation in English law. Agency is a relationship between legal persons, and an AI system is not one. The Law Commission has noted that AI systems lack separate legal personality and so can be neither sued nor prosecuted (Legal Cheek, 2025), and has warned that \"liability gaps\" may emerge in which no natural or legal person is responsible for harm caused by an AI system. It went so far as to raise the \"perhaps radical\" option of granting some form of legal personality to AI systems (Legal Futures, 2025), while acknowledging that this would not be appropriate for all systems. In practice, the legally relevant agent in an agentic payment is the firm that provides and operates the AI system. That firm's relationship with the customer is contractual, and absent regulation, its terms of service will determine how much of the risk it accepts."
          ]
        },
        {
          "heading": "6. Allocating loss across a multi-party chain",
          "paragraphs": [
            "Agentic payments involve more participants than a conventional transfer. A single agentic payment may involve the AI provider, the fintech operating the customer interface, a wallet or payment initiator, the customer's bank, a merchant and outside data providers (Ashfords, 2026). Each controls a different part of the risk. The customer sets the mandate; the agent provider determines how the system interprets it and how resistant it is to manipulation; the bank authenticates and executes; the merchant controls the content the agent reads.",
            "The most useful framework for allocating loss in such a chain comes from the economic analysis of accident law. Calabresi (1970) argued that liability should rest with the \"cheapest cost avoider\", the party who can prevent a loss at the lowest cost, because placing the loss there creates the strongest incentive for prevention. Applied to agentic payments, this principle points away from the customer in most of the scenarios above. A consumer cannot audit a model's resistance to prompt injection or the reliability of its interpretation of an instruction. The agent provider can, and is also best placed to spread the residual cost across its customer base through pricing.",
            "The APP reimbursement model offers a partial template, but it should be adopted with care. Freshfields observes that if the APP approach were extended to agentic AI, payment providers' aggregate exposure could become significant given how quickly and at what scale agents can authorise payments (Freshfields, 2026). APP reimbursement places the loss on the sending and receiving banks, which in an agentic context may be the parties least able to prevent it. A bank executing a correctly authenticated instruction from a customer's agent has no visibility of the manipulation that preceded it. Extending APP reimbursement without adjustment would therefore misplace the incentive, loading cost onto banks while leaving the agent provider, who controls the decisive risk, outside the allocation."
          ]
        },
        {
          "heading": "7. A mandate-based framework",
          "paragraphs": [
            "A more coherent approach would rebuild the consent rules around the mandate itself. Three elements would be required.",
            "The first is to recognise a verifiable mandate as the legal unit of consent for agentic payments. A payment falling within the parameters of a signed mandate would be treated as authorised; a payment falling outside them would be treated as unauthorised and refundable by the payer's provider under the existing regulation 76 mechanism. The emerging industry standards already create machine-readable mandates, which means the boundary between authorised and unauthorised could be determined by inspecting a record. This would extend regulation 67's concept of a \"defined series of transactions\" to a form of consent that is defined by parameters rather than by a fixed schedule.",
            "The second element addresses payments that fall within the mandate but result from manipulation or error. These cases cannot be resolved by inspecting the mandate, because the payment sits within its terms. Here the cheapest cost avoider principle suggests that providers of agentic payment services should hold a specific regulatory permission, and that a condition of that permission should be a duty to reimburse customers for losses caused by manipulation of the agent or by material errors in executing the customer's instructions, with a right of recourse against merchants or other parties shown to be responsible. Placing the primary obligation on the agent provider gives that firm a direct financial incentive to invest in robustness and monitoring, which is the outcome policymakers most need.",
            "The third element preserves customer responsibility where it belongs. A customer who sets a careless mandate, for instance by authorising unlimited spending in a broad category, should bear the consequences of payments that fall within it, much as a customer who shares their security credentials bears losses under regulation 77. Mandate design tools offered by providers should be subject to Consumer Duty expectations, so that customers are guided towards sensible parameters rather than left to set them unaided.",
            "The Treasury's proposed \"Know Your Agent\" standard fits naturally within this framework. Requiring agents to be registered and identifiable would allow banks to distinguish between regulated agentic services, whose providers carry the reimbursement obligation, and unregistered tools, for which banks might reasonably apply stricter authentication."
          ]
        },
        {
          "heading": "8. Conclusion",
          "paragraphs": [
            "Agentic payments do not break UK payments law because the law contains no relevant concepts. The PSRs already recognise payments initiated on a customer's behalf and consent given to a series of transactions, and *Philipp* provides a clear account of what authorisation means. The difficulty is that these concepts assume a customer who decides each payment or fixes its parameters in advance, and agentic systems are valuable precisely because they remove that requirement.",
            "The risk is that the law resolves this tension by default. If authorisation continues to be judged by whether the customer's channel and credentials were used, then customers will bear losses caused by manipulation and error they could not have prevented, and agent providers will have little incentive to invest in preventing them. If, on the other hand, APP reimbursement is extended without modification, banks will carry risks generated elsewhere in the chain. A mandate-based framework, combined with a reimbursement duty on regulated agent providers, would align legal responsibility with practical control. The Treasury's consultation closed on 6 October 2026, and the response will shape whether the UK becomes a jurisdiction where agentic payments are trusted or one where their risks are quietly shifted onto those least able to manage them."
          ]
        }
      ],
      "references": [
        "A&O Shearman (2026) *Modernising UK payments: HM Treasury's proposed overhaul of the payment services regime*. Available at: https://www.aoshearman.com/en/insights/ao-shearman-on-fintech-and-digital-assets/modernising-uk-payments-hm-treasurys-proposed-overhaul-of-the-payment-services-regime (Accessed: 23 October 2026).",
        "Ashfords (2026) *When an AI agent makes the wrong payment, who carries the loss?* Available at: https://www.ashfords.co.uk/insights/articles/when-an-ai-agent-makes-the-wrong-payment-who-carries-the-loss (Accessed: 23 October 2026).",
        "Calabresi, G. (1970) *The Costs of Accidents: A Legal and Economic Analysis*. New Haven: Yale University Press.",
        "Chopra, S. and White, L.F. (2011) *A Legal Theory for Autonomous Artificial Agents*. Ann Arbor: University of Michigan Press.",
        "Eco (2026) *AP2 protocol explained: Google's agentic commerce standard 2026*. Available at: https://eco.com/support/en/articles/15192002-ap2-protocol-explained-google-s-agentic-commerce-standard-2026 (Accessed: 23 October 2026).",
        "Finexer (2026) *HM Treasury opens the door to agentic commerce payments, and UK consent rules aren't ready yet*. Available at: https://blog.finexer.com/newsroom/agentic-commerce-payments-2026/ (Accessed: 23 October 2026).",
        "Freshfields (2026) *Agentic AI in the payments chain: regulatory challenges for financial institutions*. Available at: https://www.freshfields.com/ja/our-thinking/briefings/2026/05/agentic-ai-in-the-payments-chain-regulatory-challenges-for-financial-institutions (Accessed: 23 October 2026).",
        "Gefferie, D. (2025) *Agentic commerce*. Available at: https://dwaynegefferie.substack.com/p/agentic-commerce (Accessed: 23 October 2026).",
        "Goodwin Procter (2026) *Authorizing agentic payments*. Available at: https://webiis08.mondaq.com/unitedstates/financial-services/1802856/authorizing-agentic-payments (Accessed: 23 October 2026).",
        "HM Treasury (2026a) *Modernising payment services regulation: consultation*. London: HM Treasury.",
        "HM Treasury (2026b) *Financial Services AI Adoption Plan*. London: HM Treasury.",
        "Law Commission (2025) *Artificial Intelligence and the Law: A Discussion Paper*. London: Law Commission.",
        "Legal Cheek (2025) *Should AI be given legal personhood? New Law Commission paper raises 'radical' possibility*. Available at: https://www.legalcheek.com/2025/08/should-ai-be-given-legal-personhood-new-law-commission-paper-raises-radical-possibility/ (Accessed: 23 October 2026).",
        "Legal Futures (2025) *Law Commission raises \"radical\" option of granting AI legal personality*. Available at: https://www.legalfutures.co.uk/latest-news/law-commission-raises-radical-option-of-granting-ai-legal-personality (Accessed: 23 October 2026).",
        "Payment Expert (2026a) *myTU's Ignas Dovidonis on agentic payments and the regulatory gap*. Available at: https://paymentexpert.com/2026/08/26/mytu-agentic-payments-regulation/ (Accessed: 23 October 2026).",
        "Payment Services Regulations 2017, SI 2017/752.",
        "*Philipp v Barclays Bank UK plc* [2023] UKSC 25.",
        "Technology Magazine (2025) *How Google's AP2 sets new standards for agentic payments*. Available at: https://technologymagazine.com/news/agentic-pay-systems-googles-agent-payments-protocol (Accessed: 23 October 2026)."
      ]
    },
    {
      "kind": "native",
      "slug": "one-model-many-banks",
      "title": "One Model, Many Banks: Should AI Providers Be Regulated as Critical Infrastructure?",
      "author": "Madison Farrell · BA (Hons) International Business with Italian",
      "date": "October 2026",
      "eyebrow": "COMMITTEE REPORT · AI AS CRITICAL INFRASTRUCTURE",
      "meta": "Madison Farrell · BA (Hons) International Business with Italian",
      "categories": [
        "finance",
        "technology"
      ],
      "abstract": [
        "The UK financial system increasingly depends on a small number of technology firms for the cloud infrastructure, data and AI models on which its operations run. In July 2026 HM Treasury made the first designations under the Critical Third Parties (CTP) regime, bringing four global cloud and technology providers within direct regulatory oversight. In the same month, the Bank of England's Financial Policy Committee warned that rapid advances in frontier AI had increased risks to financial stability. This report argues that the CTP regime, as currently framed, addresses only one of the channels through which AI concentration threatens the system. It is designed to manage the risk that a critical service stops working. It is poorly suited to the risk that a widely used model works exactly as designed while producing correlated behaviour across many firms at once. The report proposes extending the designation criteria to model providers, introducing system-wide reporting of model dependencies, and stress-testing the financial system for correlated AI behaviour."
      ],
      "sections": [
        {
          "heading": "1. Introduction",
          "paragraphs": [
            "Systemic risk in finance has traditionally been understood through balance sheets. Banks fail because they lend to one another, hold similar assets and fund themselves in the same markets, so that losses in one institution spread to others through direct exposures and fire sales. The regulatory response since 2008 has focused on capital, liquidity and the resolution of failing institutions.",
            "A different kind of interconnection has developed alongside these familiar channels. Financial firms that compete fiercely with one another increasingly rely on the same technology providers for their infrastructure and, more recently, for the AI models that inform their decisions. When those providers fail, or when their products behave in unexpected ways, the effects can appear simultaneously across firms that have no direct financial relationship with each other. The depth of this dependence became visible in October 2025, when a major cloud outage disrupted numerous financial firms (Morrison Foerster, 2026).",
            "The question this raises for regulators is no longer whether technology providers matter to financial stability, which is now widely accepted, but whether the tools built to oversee them are aimed at the right risks.",
            "The research question of this report is therefore:",
            {
              "quote": "Does the UK's Critical Third Parties regime adequately capture the systemic risks created by concentration in AI provision, and if not, how should its perimeter be redrawn?"
            }
          ]
        },
        {
          "heading": "2. The evidence of concentration",
          "paragraphs": [
            "The most systematic evidence comes from the joint Bank of England and FCA survey of AI use in UK financial services. It found that 75% of responding firms were already using AI, with a further 10% planning to do so within three years (Bank of England and FCA, 2024). A third of deployed AI use cases were third-party implementations, compared with 17% in 2022 (Stephenson Harwood, 2024). Most significantly for this report, the three largest third-party providers accounted for 73% of reported cloud providers, 44% of model providers and 33% of data providers (Bank of England and FCA, 2024).",
            "Two features of these figures deserve emphasis. Concentration at the model layer, at 44%, is lower than at the cloud layer but is already high for a technology that was barely deployed in financial services five years ago, and the direction of travel is clear. Respondents identified critical third-party dependencies as the source of the largest expected increase in systemic risk over the following three years (Financial Reporter, 2024). The survey also found that firms understood third-party models less well than those they developed internally, which means that the firms relying most heavily on external models are least able to assess how those models might behave under stress."
          ]
        },
        {
          "heading": "3. How AI concentration transmits risk",
          "paragraphs": [
            "Concentration in AI provision can affect financial stability through several distinct channels, and the argument of this report depends on keeping them separate.",
            "The first is operational failure. If a cloud provider or model host suffers an outage, every firm relying on it loses access at the same time. This is the channel most visible in practice and the one regulators have done most to address. It is similar in kind to the failure of any shared utility, and the policy response, centred on resilience, substitutability and recovery planning, is well understood.",
            "The second channel is correlated behaviour. Gensler and Bailey (2020) argued that widespread adoption of deep learning could increase systemic risk because firms using similar models trained on similar data would tend to reach similar conclusions at the same time, amplifying herding and reducing the diversity of views that stabilises markets. The risk does not depend on any system malfunctioning. A model that correctly identifies a deteriorating credit sector, used simultaneously by many lenders, could prompt a synchronised withdrawal of credit that turns a sectoral problem into a systemic one. Danielsson and Uthemann (2024) extend this concern, arguing that AI systems optimising for similar objectives may react to stress faster and more uniformly than human decision-makers, compressing the time available for authorities to respond. The Financial Stability Board (2024) has likewise identified third-party dependencies, market correlations and model risk among the main AI-related vulnerabilities in the global financial system.",
            "The third channel is the use of AI against the system. The FPC has warned that more capable AI systems can find and exploit vulnerabilities at greater scale, raising the sophistication of cyber attacks on financial firms and market infrastructure (Regulation Tomorrow, 2026). This channel interacts with the first: concentration means that a successful attack on a widely used provider would have systemic rather than firm-specific consequences.",
            "The Bank of England has recognised all of these concerns in general terms. The FPC's July 2026 record judged that recent rapid advances in frontier AI capabilities had increased financial stability risks related to cyber and operational resilience (Mondo Visione, 2026), and the Bank's AI Consortium is examining concentration risks, including those arising from third-party model providers, as a primary workstream (TLT, 2026). The question is whether the formal regulatory instrument available for overseeing third parties is designed to address each of them."
          ]
        },
        {
          "heading": "4. The Critical Third Parties regime",
          "paragraphs": [
            "The CTP regime was introduced by the Financial Services and Markets Act 2023, which inserted new powers into the Financial Services and Markets Act 2000. Regulations made under section 312L of the 2000 Act allow specific third-party entities to be designated as critical third parties where necessary to manage systemic risks from the services they provide to the UK financial sector (Lewis Silkin, 2026). Designation brings the provider within the direct oversight of the Bank of England, the PRA and the FCA, which can then set requirements on its resilience and test its ability to withstand disruption.",
            "On 10 July 2026 HM Treasury designated four major global cloud and technology providers as critical third parties under the Critical Third Parties (Designation) Regulations 2026, the first designations since the regime came into force on 1 January 2025 (Herbert Smith Freehills Kramer, 2026). The designations followed a Treasury Committee report in January 2026 which recommended that the Treasury use its CTP powers to designate AI and cloud providers critical to the sector (Lewis Silkin, 2026). The UK's approach remains cautious by comparison with the European Union. The first UK designations covered only four providers, whereas the EU had already designated 19 critical ICT third-party providers under the Digital Operational Resilience Act (Morrison Foerster, 2026).",
            "The regime is explicit that designation does not transfer responsibility away from regulated firms. Designation implies no judgement on the quality or reliability of a provider's services and does not reduce the obligations of regulated firms, which remain accountable for their outsourcing arrangements (Herbert Smith Freehills Kramer, 2026). The regime therefore operates as an additional layer, giving regulators direct visibility of providers whose failure could affect many firms at once."
          ]
        },
        {
          "heading": "5. A perimeter built for the wrong failure",
          "paragraphs": [
            "The CTP regime's design reflects its origins in operational resilience policy. Its central concern is the failure or disruption of a service, and its tools are oriented towards ensuring that critical services remain available, recover quickly and can be substituted if necessary. That orientation suits the first transmission channel identified above, and the July 2026 designations of cloud and technology providers are a sensible starting point for addressing it.",
            "The orientation is much less suited to correlated behaviour. When a widely used model produces similar outputs for many firms, there is no outage to recover from and no service failure to remediate. The service is functioning precisely as intended. The risk lies in the aggregate effect of many firms acting on the same output, which is invisible from within any single firm. Each firm's outsourcing and model risk management may be entirely adequate when judged individually, while the system as a whole becomes dangerously homogeneous. This is a classic fallacy of composition, and it is the reason macroprudential policy exists as a discipline separate from the supervision of individual institutions.",
            "The current framework places responsibility for model risk at the level of the individual firm, and it places responsibility for operational resilience of critical providers with the CTP regime. Neither instrument is designed to measure or respond to the system-wide correlation created when many firms depend on the same small group of models. A model provider whose products are embedded across lending, trading and risk management could become systemically important through the behaviour its outputs induce, without ever approaching the kind of operational significance that the designation criteria are designed to detect."
          ]
        },
        {
          "heading": "6. Redrawing the perimeter",
          "paragraphs": [
            "Three changes would bring the regulatory framework into line with the risks it is meant to address.",
            "First, HM Treasury should assess foundation model providers for designation using criteria that reflect their distinctive risk. The existing criteria focus on the materiality of a provider's services and the consequences of their disruption. For model providers, the relevant questions also include how widely their models are used in material financial decisions, how similar the outputs are across deploying firms, and how far firms can substitute an alternative model without changing their behaviour. A provider might warrant designation on these grounds even where an outage of its service would be manageable.",
            "Second, the Bank and the FCA should introduce regular reporting of model dependencies by regulated firms, covering which external models are used, for which material functions and with what degree of customisation. The 2024 survey demonstrated that such information can be collected, but a periodic survey is not a supervisory tool. Structured reporting would allow the Bank to build a system-wide map of model dependencies, in the same way that it monitors common exposures across bank balance sheets, and to identify emerging concentrations before they become entrenched.",
            "Third, the Bank should conduct a system-wide exploratory exercise focused on correlated AI behaviour under stress. The Bank has used exploratory scenarios to examine how different parts of the financial system interact in a crisis, and the same method could be applied to ask how firms relying on common models would respond to a sharp market shock, and whether their responses would amplify or absorb it. The purpose would be to understand the dynamics rather than to set capital requirements, which matches the stage of knowledge the authorities are currently at.",
            "These proposals face serious objections. Designating model providers could entrench the market position of the largest firms by signalling that they are the default safe choice, which would increase the very concentration the regime is meant to manage. Many of the relevant providers are headquartered in the United States, and the UK's ability to impose requirements on them will depend on their willingness to engage and on cooperation with US authorities. There is also a risk that heavy oversight discourages beneficial adoption at a time when the Treasury is explicitly seeking to accelerate it.",
            "None of these objections is decisive. The entrenchment concern applies equally to cloud designation and has not prevented the UK or the EU from proceeding. The jurisdictional concern argues for coordination, and the EU's broader approach under DORA provides a natural partner for joint oversight arrangements. The concern about adoption is better addressed by designing proportionate requirements than by declining to look. Dependency reporting and exploratory stress testing impose modest costs and produce information that the authorities currently lack."
          ]
        },
        {
          "heading": "7. Conclusion",
          "paragraphs": [
            "The UK has taken an important step by designating its first critical third parties, and the decision to begin with cloud and technology providers reflects the most visible form of concentration risk. The October 2025 outage demonstrated that operational dependence on a few providers is a present reality rather than a theoretical concern.",
            "The more distinctive risk posed by AI is of a different character. It arises when many firms rely on the same models and act on similar outputs, producing synchronised behaviour that no individual firm can see and no outage-focused regime is designed to catch. The Bank of England has identified this risk, and its AI Consortium is studying it, but the formal instrument for overseeing third parties remains anchored in the logic of service continuity. Extending the designation criteria to model providers, building a system-wide view of model dependencies and testing how correlated AI behaviour would interact with market stress would close that gap. The central lesson of the 2008 crisis was that institutions can be individually sound while the system they form is fragile. The concentration of AI provision presents the same problem in a new form, and it deserves the same macroprudential response."
          ]
        }
      ],
      "references": [
        "Bank of England and Financial Conduct Authority (2024) *Artificial intelligence in UK financial services - 2024*. Available at: https://www.bankofengland.co.uk/report/2024/artificial-intelligence-in-uk-financial-services-2024 (Accessed: 23 October 2026).",
        "Bank of England (2026) *Financial Stability Report - July 2026*. Available at: https://www.bankofengland.co.uk/-/media/boe/files/financial-stability-report/2026/financial-stability-report-july-2026.pdf (Accessed: 23 October 2026).",
        "Danielsson, J. and Uthemann, A. (2024) 'On the use of artificial intelligence in financial regulations and the impact on financial stability', *arXiv preprint*.",
        "Financial Reporter (2024) *75% of financial services firms using AI: FCA*. Available at: https://www.financialreporter.co.uk/75-of-financial-services-firms-using-ai-fca.html (Accessed: 23 October 2026).",
        "Financial Services and Markets Act 2000, s. 312L (as inserted by the Financial Services and Markets Act 2023).",
        "Financial Stability Board (2024) *The Financial Stability Implications of Artificial Intelligence*. Basel: FSB.",
        "Gensler, G. and Bailey, L. (2020) 'Deep learning and financial stability', *SSRN Working Paper*.",
        "Herbert Smith Freehills Kramer (2026) *HM Treasury makes first designations under UK CTP regime*. Available at: https://www.hsfkramer.com/notes/fsrandcorpcrime/2026-posts/hm-treasury-makes-first-designations-under-uk-ctp-regime (Accessed: 23 October 2026).",
        "Lewis Silkin (2026) *UK designates first technology providers under the Critical Third Parties regime*. Available at: https://www.lewissilkin.com/insights/2026/07/15/uk-designates-first-technology-providers-under-the-critical-third-parties-regime-102nbxt (Accessed: 23 October 2026).",
        "Mondo Visione (2026) *Bank of England: Financial Policy Committee Record - July 2026*. Available at: https://mondovisione.com/media-and-resources/news/bank-of-england-financial-policy-committee-record-july-2026-202677/ (Accessed: 23 October 2026).",
        "Morrison Foerster (2026) *UK announces list of first critical third parties*. Available at: https://www.mofo.com/resources/insights/260716-uk-announces-list-of-first-critical-third-parties (Accessed: 23 October 2026).",
        "Regulation Tomorrow (2026) *BoE publishes latest Financial Stability Report*. Available at: https://www.regulationtomorrow.com/2026/07/boe-publishes-latest-financial-stability-report-2/ (Accessed: 23 October 2026).",
        "Stephenson Harwood (2024) *The Bank of England and the FCA's survey on AI in UK financial services*. Available at: https://www.stephensonharwood.com/insights/the-bank-of-england-and-the-fcas-survey-on-ai-in-uk-financial-services/ (Accessed: 23 October 2026).",
        "TLT (2026) *The Bank of England and PRA set out plans for safe AI innovation: what firms need to know*. Available at: https://tlt.com/insights-and-events/insight/the-bank-of-england-and-pra-set-out-plans-for-safe-ai-innovation-what-firms-need-to-know (Accessed: 23 October 2026)."
      ]
    },
    {
      kind: 'native',
      title: 'When AI Becomes the Investment Adviser, Who Bears Legal Responsibility for Automated Financial Advice?',
      author: 'Parmis Eslami · Year 2 LLB Law',
      date: 'October 2026',
      wordCount: '1,945 words',
      readingTime: '10 min read',
      summary: 'As AI moves from supporting financial advisers to making investment decisions with little human involvement, UK regulation already places responsibility on the firm, but increasing autonomy will test how well that principle holds.',
      eyebrow: 'COMMITTEE REPORT · AI IN INVESTMENT ADVICE',
      meta: 'Parmis Eslami · Year 2 LLB Law · 1,945 words · 10 min read',
      categories: ['law', 'finance', 'technology'],
      abstract: [
        'Artificial intelligence is becoming increasingly embedded in financial services. It is already used to support investment research, portfolio management and automated investment services. In future, AI may be able to analyse an individual\'s financial circumstances, assess their tolerance for risk, recommend investments and carry out transactions with very little human involvement. This raises an important legal question: if an AI system effectively becomes an investment adviser and its recommendation causes a customer financial harm, who should be legally responsible?',
        'The question is increasingly relevant to the UK financial sector. The Financial Conduct Authority (FCA) already regulates automated investment services and has made clear that firms remain responsible for ensuring that recommendations are suitable for their clients, even where those recommendations are generated through automated or semi-automated systems. As AI becomes more sophisticated and more capable of acting independently, however, it is worth asking whether existing UK financial regulation will continue to give a clear answer when something goes wrong. This article examines whether the current UK legal and regulatory framework can cope with a future in which AI moves from assisting financial professionals to effectively making financial decisions itself.'
      ],
      sections: [
        {
          heading: '1. What happens when investment advice becomes automated?',
          paragraphs: [
            'Technology has been part of the financial sector for decades. Banks and investment firms already use computer systems to process information, assess risk and execute transactions. Artificial intelligence could take this considerably further. The important difference is that AI does not necessarily just follow instructions given to it by a human: it can process large volumes of information, identify patterns and produce recommendations based on what it finds. This creates a distinction between AI used as a financial tool and AI that effectively becomes the decision-maker.',
            'A financial adviser may use software to compare investments before making their own recommendation. In that situation it is relatively straightforward to identify who made the decision: the adviser. By contrast, a more autonomous AI system could analyse a customer\'s income, expenditure, savings, debts, investment objectives and tolerance for risk, then recommend a portfolio, invest the customer\'s money and adjust those investments as circumstances change.',
            'There may therefore be considerably less direct human involvement in individual investment decisions, which makes the question of legal responsibility more complex. The issue is not simply whether an AI system has made an inaccurate prediction. What matters more is whether the recommendation was suitable for the particular customer and, if it was not, which party should bear the resulting loss.',
            'The central question of this article is therefore:',
            { quote: 'Can existing UK financial law adequately allocate responsibility when AI becomes capable of providing investment advice with increasing levels of autonomy?' }
          ]
        },
        {
          heading: '2. What does UK law currently say about investment advice?',
          paragraphs: [
            'Before evaluating future developments, it is necessary to establish the current UK position. Advising on investments is a regulated activity under article 53 of the Financial Services and Markets Act 2000 (Regulated Activities) Order 2001. Article 53 covers advice, given to a person in their capacity as an investor or potential investor, on the merits of buying, selling, subscribing for, exchanging, redeeming or holding a particular investment.',
            'This matters in the context of AI because using an automated system does not, in itself, take investment advice outside the regulatory perimeter. Where an authorised firm provides investment advice, it remains subject to the FCA Handbook. In particular, COBS 9A sets out the suitability requirements for firms providing investment advice or portfolio management in the course of MiFID business, with COBS 9 covering broadly equivalent ground for non-MiFID business. Before making a recommendation or investment decision, a firm must obtain the necessary information about the client\'s knowledge and experience in the relevant field, their financial situation (including their ability to bear losses) and their investment objectives (including their risk tolerance). Advice must therefore fit the circumstances of the individual client rather than simply reflecting the output of an automated system.',
            'This is particularly relevant under COBS 9A.2.23UK, which deals expressly with automated and semi-automated systems. Where investment advice or portfolio management is provided wholly or partly through such a system, responsibility for the suitability assessment lies with the investment firm providing the service and is not reduced by the use of an electronic system. The current UK framework therefore places regulatory responsibility on the firm providing the service. A firm cannot avoid that responsibility simply because AI was involved in generating the recommendation.',
            'This provides an important foundation for examining the future position as AI takes on a greater role in financial decision-making. The key question is not whether AI can be used to provide investment advice, but whether the existing framework will remain sufficient to determine responsibility and protect consumers as the technology develops.'
          ]
        },
        {
          heading: '3. Suitability, explainability and accountability',
          paragraphs: [
            'Suitability is one of the central legal issues in automated investment advice. Whether an investment is appropriate cannot be judged solely by how it eventually performs. An investment that suits one person may be inappropriate for another because their financial circumstances, objectives or willingness to accept losses differ.',
            'The FCA\'s suitability requirements reflect this individualised approach. Firms must gather information about the client\'s knowledge and experience, financial circumstances, ability to bear losses, investment objectives and risk tolerance before providing advice or managing a portfolio, and the recommendation must then be consistent with that information.',
            'The involvement of AI does not change the underlying requirement for personalised advice. Instead, it raises questions about how effectively an automated system can gather, interpret and apply the information needed to satisfy that requirement. The relevant legal enquiry is therefore not whether an AI-generated recommendation ultimately produced a profit or a loss. More weight should be given to the process by which the recommendation was produced, and whether the client\'s individual circumstances were properly taken into account.',
            'This becomes especially important when AI systems process large quantities of personal and financial information. A regulated firm must still be able to show that the information used in the suitability assessment is appropriate and that the technology is operating consistently with its regulatory obligations. This leads to the issue of explainability. AI systems can process substantial amounts of information and identify patterns that are not immediately apparent to human users, and as models become more complex, understanding precisely why a particular recommendation was generated may become increasingly difficult.',
            'For financial firms, however, technological complexity does not remove the need for effective oversight. A firm must retain sufficient understanding and control of the systems it uses to provide regulated services. That includes maintaining appropriate governance, monitoring how the system operates and keeping sufficient records to demonstrate that regulatory requirements are being met. The question is not whether every technical element of an AI system must be understandable in detail, but whether the firm can exercise meaningful oversight and show that the system is being used appropriately.',
            'Explainability is consequently closely linked to accountability. If a firm cannot adequately monitor or understand how an AI system operates, it becomes harder to establish why a recommendation was produced, whether relevant information was properly considered and whether the firm\'s regulatory obligations were met. This does not mean responsibility shifts to the technology itself: under current UK regulation, using an automated system does not remove the firm\'s responsibility for the suitability assessment. Rather, increasing technological complexity places greater weight on the firm\'s ability to demonstrate effective governance and control.'
          ]
        },
        {
          heading: '4. Consumer protection and the future of investment advice',
          paragraphs: [
            'The growing use of AI in financial services also has implications for consumer protection. Not every piece of financial guidance is regulated advice: generic information, or guidance that does not relate to a particular investment, generally falls outside article 53. As AI systems produce increasingly personalised recommendations, it may become harder for consumers to tell which kind of service they are receiving. This makes transparency essential. Consumers should be able to understand whether they are receiving general information or regulated advice, the extent to which automated technology is involved and which entity is responsible for the service.',
            'The FCA has already set out its expectations of firms providing automated investment services. Following reviews of automated advice and online discretionary investment management published in 2018, it stressed that such services must carry out appropriate suitability assessments, that communications with clients must be fair, clear and not misleading, and that automated services are held to the same standards as traditional ones. Since July 2023, the Consumer Duty has added a further layer, requiring firms to act to deliver good outcomes for retail customers, including through the design of their products, services and communications.',
            'There is also a wider consumer law dimension. Under section 49 of the Consumer Rights Act 2015, every contract under which a trader supplies a service to a consumer is treated as including a term that the trader must perform the service with reasonable care and skill. This is relevant to AI-enabled financial services because consumers may interact with an automated system without fully understanding how the service operates or where responsibility lies if it falls short of that standard.',
            'The Consumer Rights Act 2015 should, however, be read alongside the sector-specific framework governing investment advice, complementing rather than replacing the FCA\'s requirements. The result is a broader consumer protection framework in which both the quality of the service and compliance with financial regulation may be relevant when deciding whether a consumer has been adequately protected.',
            'The allocation of responsibility becomes more complicated where several organisations contribute to an AI-enabled service. A financial firm may provide the regulated service while relying on technology developed, maintained or supplied by an external provider. This creates a distinction between the organisation that builds the technology and the organisation that has the direct relationship with the customer. The FCA\'s outsourcing rules in SYSC 8 make clear that a firm which outsources a function remains fully responsible for its regulatory obligations, so the customer-facing firm stays answerable to the regulator. How loss is ultimately shared between that firm and its technology provider, however, is largely a matter of contract between them.',
            'This becomes increasingly important as AI moves beyond a supporting role and begins to perform more complex stages of the investment process. Where a system operates with limited human involvement, it may be harder to identify precisely where an error occurred and which organisation should bear the consequences. The legal challenge therefore extends beyond regulating the use of AI itself, towards ensuring that responsibility remains identifiable across the different organisations and systems involved in delivering the service.'
          ]
        },
        {
          heading: '5. Conclusion',
          paragraphs: [
            'The central issue is no longer simply whether AI can provide investment advice. The more fundamental concern is whether established legal principles can continue to provide meaningful accountability as human involvement in individual financial decisions declines.',
            'The existing UK framework provides a solid foundation. It already places responsibility on regulated firms and requires investment advice to reflect the circumstances and objectives of individual clients. Its treatment of automated advice also shows that existing rules can accommodate technological systems without transferring responsibility away from the firm.',
            'Increasing autonomy may nevertheless test the practical limits of those principles. Firms may need to demonstrate greater governance, monitoring and control over AI systems to ensure that automated decision-making remains consistent with their regulatory obligations. The future may not require an entirely separate body of AI-specific financial law. Instead, established principles of suitability, accountability, consumer protection and regulatory oversight may need to be applied more rigorously as automated systems take on responsibility for financial decisions.',
            'The main legal concern is not whether AI should have a role in financial services, but whether that role can expand without weakening the link between decision-making and accountability. As AI becomes more deeply embedded in the UK\'s financial sector, a clear allocation of legal responsibility will only become more important. The challenge for future regulation will be ensuring that greater technological autonomy does not bring a corresponding reduction in accountability.'
          ]
        }
      ],
      references: [
        'Financial Services and Markets Act 2000 (Regulated Activities) Order 2001, SI 2001/544, art 53',
        'Consumer Rights Act 2015, s 49',
        'FCA Handbook, COBS 9A (Suitability), including COBS 9A.2.23UK',
        'FCA Handbook, PRIN 2A (Consumer Duty)',
        'FCA Handbook, SYSC 8 (Outsourcing)',
        'FCA, Automated investment services: our expectations (May 2018)'
      ]
    }
  ];

  var listEl = document.getElementById('reportsList');
  var filterBarEl = document.getElementById('reportsFilterBar');
  var modal = document.getElementById('reportModal');
  var modalClose = document.getElementById('reportModalClose');
  var modalTitle = document.getElementById('reportModalTitle');
  var modalFrame = document.getElementById('reportModalFrame');
  var modalOpenNew = document.getElementById('reportModalOpenNew');
  var lastFocusedElement = null;

  var articleModal = document.getElementById('articleReportModal');
  var articleModalClose = document.getElementById('articleReportModalClose');
  var articleModalContent = document.getElementById('articleReportModalContent');

  var allReports = NATIVE_REPORTS.slice();
  var currentCategory = 'all';

  function categoryLabel(id) {
    return CATEGORY_LABELS[id] || id;
  }

  function readCategoryFromLocation() {
    var fromQuery = null;
    try {
      fromQuery = new URLSearchParams(window.location.search).get('category');
    } catch (e) {
      fromQuery = null;
    }
    var fromHash = window.location.hash ? window.location.hash.replace(/^#/, '') : null;
    var candidate = (fromQuery || fromHash || 'all').toLowerCase();
    if (candidate !== 'all' && CATEGORY_IDS.indexOf(candidate) === -1) return 'all';
    return candidate;
  }

  function writeCategoryToLocation(id) {
    if (!window.history || !window.history.replaceState) return;
    var url = new URL(window.location.href);
    if (id === 'all') {
      url.searchParams.delete('category');
    } else {
      url.searchParams.set('category', id);
    }
    url.hash = '';
    var next = url.pathname + (url.search ? url.search : '');
    window.history.replaceState(null, '', next);
  }

  function filterByCategory(reports, id) {
    if (id === 'all') return reports;
    return reports.filter(function (r) {
      return r.categories && r.categories.indexOf(id) !== -1;
    });
  }

  // Returns the first two sentences of a paragraph, used to build a card excerpt
  // from a report's abstract when it has no hand-written `summary`.
  function firstTwoSentences(text) {
    if (!text) return '';
    var matches = text.match(/[^.!?]+[.!?]+(\s+|$)/g);
    if (!matches || !matches.length) return text.trim();
    return matches.slice(0, 2).join('').trim();
  }

  function excerptFor(report) {
    if (report.summary) return report.summary;
    if (report.abstract && report.abstract.length) return firstTwoSentences(report.abstract[0]);
    return '';
  }

  function findReportBySlug(slug) {
    if (!slug) return null;
    var match = allReports.filter(function (r) { return r.slug === slug; });
    return match.length ? match[0] : null;
  }

  function readReportSlugFromLocation() {
    try {
      return new URLSearchParams(window.location.search).get('report');
    } catch (e) {
      return null;
    }
  }

  function writeReportSlugToLocation(slug) {
    if (!window.history || !window.history.replaceState) return;
    var url = new URL(window.location.href);
    if (!slug) {
      url.searchParams.delete('report');
    } else {
      url.searchParams.set('report', slug);
    }
    var next = url.pathname + (url.search ? url.search : '');
    window.history.replaceState(null, '', next);
  }

  // Builds the rich content of a reference entry: *asterisked* text becomes
  // italic, and bare https:// URLs become clickable new-tab links.
  function appendReferenceRichText(container, text) {
    var italicSplit = text.split(/(\*[^*]+\*)/g);
    italicSplit.forEach(function (chunk) {
      if (!chunk) return;
      var isItalic = chunk.charAt(0) === '*' && chunk.charAt(chunk.length - 1) === '*' && chunk.length > 1;
      var inner = isItalic ? chunk.slice(1, -1) : chunk;
      var wrapper = isItalic ? document.createElement('em') : null;
      var target = wrapper || container;

      var urlSplit = inner.split(/(https?:\/\/[^\s)]+)/g);
      urlSplit.forEach(function (part) {
        if (!part) return;
        if (/^https?:\/\//.test(part)) {
          var a = document.createElement('a');
          a.href = part;
          a.textContent = part;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          target.appendChild(a);
        } else {
          target.appendChild(document.createTextNode(part));
        }
      });

      if (wrapper) container.appendChild(wrapper);
    });
  }

  function showEmpty(label) {
    listEl.innerHTML = '';
    var p = document.createElement('p');
    p.className = 'reports-empty';
    p.textContent = label
      ? 'No reports tagged "' + label + '" yet. Check back soon.'
      : 'No reports published yet. Check back soon.';
    listEl.appendChild(p);
  }

  function normaliseReports(data) {
    var raw = Array.isArray(data) ? data : (data && Array.isArray(data.reports) ? data.reports : null);
    if (!raw) return [];
    return raw
      .map(function (r) {
        if (!r || typeof r !== 'object') return null;
        var url = r.url || r.link || r.href;
        if (!url) return null;
        return {
          kind: 'sheet',
          title: r.title || r.name || 'Untitled report',
          date: r.date || r.published || '',
          summary: r.summary || r.description || '',
          categories: Array.isArray(r.categories) ? r.categories : [],
          url: url
        };
      })
      .filter(Boolean);
  }

  function renderFilterBar() {
    filterBarEl.innerHTML = '';

    var allBtn = makeFilterButton('all', 'All', allReports.length, currentCategory === 'all');
    filterBarEl.appendChild(allBtn);

    CATEGORIES.forEach(function (cat) {
      var count = filterByCategory(allReports, cat.id).length;
      filterBarEl.appendChild(makeFilterButton(cat.id, cat.label, count, currentCategory === cat.id));
    });
  }

  function makeFilterButton(id, label, count, isActive) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'reports-filter-btn';
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    btn.textContent = label + ' (' + count + ')';
    btn.addEventListener('click', function () {
      setActiveCategory(id);
    });
    return btn;
  }

  function setActiveCategory(id) {
    if (id !== 'all' && CATEGORY_IDS.indexOf(id) === -1) id = 'all';
    currentCategory = id;
    writeCategoryToLocation(id);
    renderFilterBar();
    renderReports(filterByCategory(allReports, id));
  }

  function renderReports(reports) {
    if (!reports.length) {
      showEmpty(currentCategory === 'all' ? null : categoryLabel(currentCategory));
      return;
    }

    listEl.innerHTML = '';
    reports.forEach(function (report) {
      var card = document.createElement('div');
      card.className = 'report-card';
      if (report.slug) card.id = 'report-' + report.slug;

      var content = document.createElement('div');
      content.className = 'report-content';

      if (report.date) {
        var dateEl = document.createElement('p');
        dateEl.className = 'report-date';
        dateEl.textContent = report.date;
        content.appendChild(dateEl);
      }

      var titleEl = document.createElement('h3');
      titleEl.textContent = report.title;
      content.appendChild(titleEl);

      if (report.author) {
        var authorEl = document.createElement('p');
        authorEl.className = 'report-author';
        authorEl.textContent = report.author;
        content.appendChild(authorEl);
      }

      if (report.categories && report.categories.length) {
        var tagsRow = document.createElement('div');
        tagsRow.className = 'reports-tags';
        report.categories.forEach(function (catId) {
          if (CATEGORY_IDS.indexOf(catId) === -1) return;
          var tag = document.createElement('span');
          tag.className = 'reports-tag';
          tag.textContent = categoryLabel(catId);
          tagsRow.appendChild(tag);
        });
        content.appendChild(tagsRow);
      }

      var excerpt = excerptFor(report);
      if (excerpt) {
        var summaryEl = document.createElement('p');
        summaryEl.className = 'report-summary';
        summaryEl.textContent = excerpt;
        content.appendChild(summaryEl);
      }

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'report-read-btn';
      btn.textContent = 'Read report';
      btn.addEventListener('click', function () {
        openReport(report);
      });

      card.appendChild(content);
      card.appendChild(btn);
      listEl.appendChild(card);
    });
  }

  function openReport(report) {
    if (report.kind === 'native') {
      openArticleReport(report);
    } else {
      openFrameReport(report);
    }
  }

  function openFrameReport(report) {
    lastFocusedElement = document.activeElement;
    modalTitle.textContent = report.title;
    modalFrame.src = report.url;
    modalOpenNew.href = report.url;
    modal.classList.add('open');
  }

  function closeModal() {
    modal.classList.remove('open');
    modalFrame.src = '';
    modalOpenNew.href = '#';
    if (lastFocusedElement && lastFocusedElement.focus) {
      lastFocusedElement.focus();
    }
  }

  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  // ---- Native, in-page article reports ----

  function renderArticleReport(report) {
    articleModalContent.innerHTML = '';

    var eyebrow = document.createElement('p');
    eyebrow.className = 'article-modal-eyebrow';
    eyebrow.textContent = report.eyebrow;
    articleModalContent.appendChild(eyebrow);

    var title = document.createElement('h3');
    title.className = 'article-modal-title';
    title.textContent = report.title;
    articleModalContent.appendChild(title);

    var meta = document.createElement('p');
    meta.className = 'article-modal-meta';
    meta.textContent = report.meta;
    articleModalContent.appendChild(meta);

    if (report.categories && report.categories.length) {
      var tagsRow = document.createElement('div');
      tagsRow.className = 'reports-tags reports-article-tags';
      report.categories.forEach(function (catId) {
        if (CATEGORY_IDS.indexOf(catId) === -1) return;
        var tag = document.createElement('span');
        tag.className = 'reports-tag';
        tag.textContent = categoryLabel(catId);
        tagsRow.appendChild(tag);
      });
      articleModalContent.appendChild(tagsRow);
    }

    var hr = document.createElement('hr');
    hr.className = 'article-modal-divider';
    articleModalContent.appendChild(hr);

    if (report.abstract && report.abstract.length) {
      var abstractWrap = document.createElement('div');
      abstractWrap.className = 'reports-article-abstract';

      var abstractHeading = document.createElement('h4');
      abstractHeading.textContent = 'Abstract';
      abstractWrap.appendChild(abstractHeading);

      report.abstract.forEach(function (paragraph) {
        var p = document.createElement('p');
        p.textContent = paragraph;
        abstractWrap.appendChild(p);
      });

      articleModalContent.appendChild(abstractWrap);
    }

    report.sections.forEach(function (section) {
      var sectionEl = document.createElement('div');
      sectionEl.className = 'article-modal-section';

      var heading = document.createElement('h3');
      heading.textContent = section.heading;
      sectionEl.appendChild(heading);

      section.paragraphs.forEach(function (paragraph) {
        if (paragraph && typeof paragraph === 'object' && paragraph.quote) {
          var bq = document.createElement('blockquote');
          bq.className = 'reports-article-quote';
          bq.textContent = paragraph.quote;
          sectionEl.appendChild(bq);
        } else {
          var p = document.createElement('p');
          p.textContent = paragraph;
          sectionEl.appendChild(p);
        }
      });

      articleModalContent.appendChild(sectionEl);
    });

    if (report.keyTakeaway) {
      var takeaway = document.createElement('div');
      takeaway.className = 'article-modal-takeaway';
      var takeawayP = document.createElement('p');
      var strong = document.createElement('strong');
      strong.textContent = 'Key takeaway: ';
      takeawayP.appendChild(strong);
      takeawayP.appendChild(document.createTextNode(report.keyTakeaway));
      takeaway.appendChild(takeawayP);
      articleModalContent.appendChild(takeaway);
    }

    if (report.references && report.references.length) {
      var refsWrap = document.createElement('div');
      refsWrap.className = 'article-modal-references';

      var refsHeading = document.createElement('h3');
      refsHeading.textContent = 'References';
      refsWrap.appendChild(refsHeading);

      var refsList = document.createElement('ol');
      report.references.forEach(function (ref) {
        var li = document.createElement('li');
        appendReferenceRichText(li, ref);
        refsList.appendChild(li);
      });
      refsWrap.appendChild(refsList);

      articleModalContent.appendChild(refsWrap);
    }
  }

  function openArticleReport(report) {
    lastFocusedElement = document.activeElement;
    renderArticleReport(report);
    articleModal.classList.add('open');
    setTimeout(function () { articleModalClose.focus(); }, 100);
  }

  function closeArticleModal() {
    articleModal.classList.remove('open');
    if (lastFocusedElement && lastFocusedElement.focus) {
      lastFocusedElement.focus();
    }
  }

  articleModalClose.addEventListener('click', closeArticleModal);

  articleModal.addEventListener('click', function (e) {
    if (e.target === articleModal) closeArticleModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modal.classList.contains('open')) closeModal();
      if (articleModal.classList.contains('open')) closeArticleModal();
    }
  });

  currentCategory = readCategoryFromLocation();
  renderFilterBar();
  renderReports(filterByCategory(allReports, currentCategory));

  fetch(REPORTS_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('Request failed');
      return res.json();
    })
    .then(function (data) {
      allReports = NATIVE_REPORTS.concat(normaliseReports(data));
      renderFilterBar();
      renderReports(filterByCategory(allReports, currentCategory));
    })
    .catch(function () {
      // Native reports are already rendered; nothing further to do.
    });
})();
