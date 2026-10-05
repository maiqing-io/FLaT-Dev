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
  // To add a future report: append a new object to this array with the same shape
  // as the ones below, plus a `categories` array drawn from the ids in CATEGORIES
  // above (e.g. categories: ['law', 'finance']). A report tagged with more than one
  // category automatically appears under each of those filters without the content
  // being duplicated anywhere. An optional `abstract` array of paragraph strings
  // renders as a highlighted abstract block before the numbered sections, and a
  // paragraph entry shaped as { quote: '...' } inside any section renders as a
  // styled blockquote instead of a plain paragraph.
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

      if (report.summary) {
        var summaryEl = document.createElement('p');
        summaryEl.className = 'report-summary';
        summaryEl.textContent = report.summary;
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
        li.textContent = ref;
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
