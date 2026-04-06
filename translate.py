import os

files = [
    "index.html",
    "about-mohamed-baghdad.html",
    "projects-mohamed-baghdad.html",
    "contact-mohamed-baghdad.html"
]

translations = {
    # Nav links
    """href="about-mohamed-baghdad.html">About</a>""": """href="about-mohamed-baghdad-fr.html">A propos</a>""",
    """href="projects-mohamed-baghdad.html">Projects</a>""": """href="projects-mohamed-baghdad-fr.html">Projets</a>""",
    """href="index.html#skills">Skills</a>""": """href="index-fr.html#skills">Compétences</a>""",
    """href="index.html#process">Process</a>""": """href="index-fr.html#process">Processus</a>""",
    """href="index.html#testimonials">Testimonials</a>""": """href="index-fr.html#testimonials">Témoignages</a>""",
    """href="contact-mohamed-baghdad.html">Contact</a>""": """href="contact-mohamed-baghdad-fr.html">Contact</a>""",
    """href="#contact" class="nav-cta">Hire Me ↗</a>""": """href="#contact" class="nav-cta">Embauchez-moi ↗</a>""",
    """>Download CV ↓</a>""": """>Télécharger CV ↓</a>""",
    
    # Hero
    """Backend Engineer · System Design · Android / Full Stack""": """Ingénieur Backend · System Design · Android / Full Stack""",
    """Backend Engineer focused on scalable systems, API architecture, and production-grade software.""": """Ingénieur Backend axé sur les systèmes scalables, architecture d'API et logiciels de production.""",
    """Strong in system design, with experience building Android and full stack products end to end.""": """Solide en system design, avec expérience en création de produits Android et full stack de bout en bout.""",
    """View My Work →""": """Voir mon travail →""",
    """Hire Me ↗""": """Embauchez-moi ↗""",
    
    # Hero Right
    """System Architecture — Typical Stack""": """Architecture Système — Stack Typique""",
    """GitHub Repos""": """Dépôts GitHub""",
    """API Reqs / mo""": """Req API / mois""",
    """Client Satisfaction""": """Satisfaction Client""",
    """Products Built""": """Produits créés""",
    """Place Hackathon""": """Place au Hackathon""",
    """Every Push""": """À chaque Push""",
    
    # Ticker
    """Backend Engineering""": """Ingénierie Backend""",
    """Hackathon Award""": """Prix Hackathon""",
    """4th Year Student""": """Étudiant 4ème année""",
    """Multi-tenant Platforms""": """Plateformes Multi-tenant""",
    """Available for Freelance""": """Disponible pour Freelance""",
    
    # About
    """01 — Profile""": """01 — Profil""",
    """Engineering<br>with <em>purpose.</em>""": """Ingénierie<br>avec <em>dessein.</em>""",
    """A product-oriented developer who connects technical precision with genuine business value""": """Un développeur orienté produit qui allie précision technique et valeur métier""",
    """Background""": """Contexte""",
    """Hi, I'm Mohamed Baghdad. I have a backend-first mindset and strong architecture thinking. Before writing a single line of code, I architect scalable systems and define strict APIs.""": """Bonjour, je suis Mohamed Baghdad. J'ai une mentalité axée Backend et une forte pensée architecturale. Avant d'écrire une seule ligne de code, je conçois des systèmes scalables et définis des API strictes.""",
    """While my core identity is in backend engineering and database design, I deliver end-to-end applications across Android and Full Stack when needed. My work spans from complex mobile apps to high-traffic SaaS products.""": """Bien que mon identité principale réside dans l'ingénierie backend et la conception de bases de données, je livre des applications de bout en bout sur Android et Full Stack si nécessaire. Mon travail couvre des applications mobiles complexes jusqu'aux produits SaaS à fort trafic.""",
    """What I Build""": """Ce que je construis""",
    """REST API architecture and auth flows""": """Architecture API REST et flux d'authentification""",
    """Database schemas across SQL &amp; NoSQL""": """Schémas de bases de données SQL &amp; NoSQL""",
    """Backend systems for mobile &amp; web""": """Systèmes back-end pour mobile et web""",
    """SaaS platforms with multi-tenant logic""": """Plateformes SaaS avec logique multi-tenant""",
    """CI/CD pipelines via GitHub Actions""": """Pipelines CI/CD via GitHub Actions""",
    """Products from idea to deployment""": """Produits de l'idée au déploiement""",
    """Opportunities""": """Opportunités""",
    """Software engineering internship""": """Stage en génie logiciel""",
    """Android / mobile development roles""": """Rôles de développement Android / mobile""",
    """Full-stack freelance projects""": """Projets full-stack en freelance""",
    """Product-focused engineering teams""": """Équipes d'ingénierie axées sur le produit""",
    """SaaS startup collaboration""": """Collaboration startup SaaS""",
    """Open-source partnerships""": """Partenariats open source""",
    
    # Projects
    """02 — Work""": """02 — Projets""",
    """Featured<br><em>Projects.</em>""": """Projets<br><em>Clés.</em>""",
    """Four production-grade products built to solve distinct real-world business problems""": """Quatre produits de qualité production créés pour résoudre des problèmes métiers réels""",
    """Problem:""": """Problème :""",
    """Solution:""": """Solution :""",
    """Results:""": """Résultats :""",
    """Case Study →""": """Étude de cas →""",
    """system flow""": """flux système""",
    """loyalty flow + RBAC layers""": """flux de fidélité + couches RBAC""",
    """entity schema + role access""": """schéma d'entité + accès par rôle""",
    """offline-first sync architecture""": """architecture de synchro orientée hors-ligne""",
    
    # Skills
    """03 — Expertise""": """03 — Expertise""",
    """Technical<br><em>Skills.</em>""": """Compétences<br><em>Techniques.</em>""",
    """A precise, layered skill set from mobile UI to database architecture. No padding, no guesswork.""": """Un ensemble de compétences précises et structurées, allant de l'interface mobile à l'architecture de bases de données. Pas de superflu.""",
    
    # Process
    """04 — Methodology""": """04 — Méthodologie""",
    """How I<br><em>Work.</em>""": """Comment je<br><em>Travaille.</em>""",
    """A structured, repeatable process from discovery to deployment. Organized, communicative, and shipping with intention.""": """Un processus itératif, structuré de la découverte au déploiement. Organisé, communicatif, et livré avec intention.""",
    """Discovery""": """Découverte""",
    """Define the real problem. Understand users, workflows, and constraints before touching code.""": """Définir le vrai problème. Comprendre les utilisateurs, workflows et contraintes avant le code.""",
    """Architecture""": """Architecture""",
    """Design the system — data models, API contracts, component boundaries, deployment strategy.""": """Concevoir le système — modèles de données, contrats d'API, limites des composants, stratégie de déploiement.""",
    """Development""": """Développement""",
    """Iterative builds. Meaningful commits. Modular code. CI runs on every push to main.""": """Générations itératives. Commits significatifs. Code modulaire. CI exécutée à chaque push.""",
    """Testing""": """Test""",
    """Unit tests, integration checks, edge case coverage. Automated pipelines validate every build.""": """Tests unitaires, contrôles d'intégration, couverture des cas limites. Pipelines automatisés valident chaque build.""",
    """Delivery""": """Livraison""",
    """Deployed via pipeline. Structured handoff, README docs, and post-launch monitoring.""": """Déployé via pipeline. Transition structurée, docs README, et suivi après le lancement.""",
    
    # Engineering
    """05 — Standards""": """05 — Standards""",
    """Engineering<br><em>Discipline.</em>""": """Discipline<br><em>Ingénierie.</em>""",
    """Code quality isn't a bonus — it's the baseline. Every project ships with CI, clean architecture, and documentation.""": """La qualité du code n'est pas un bonus — c'est la norme. Chaque projet est livré avec CI, une archi clean et sa documentation.""",
    """Version Control Discipline""": """Discipline dans le contrôle de version""",
    """Semantic commits, feature branch strategy, pull request reviews. Every repo tells a clean story of how the product evolved.""": """Commits sémantiques, stratégie feature branch, revue des PR. Chaque dépôt raconte l'évolution du produit.""",
    """CI/CD via GitHub Actions""": """CI/CD via GitHub Actions""",
    '''Automated test → build → deploy pipeline on every push. No manual releases. No "works on my machine."''': '''Test auto → compilation → déploiement à chaque push. Pas de publis manuelles. Pas de "ça marche chez moi".''',
    """MVVM &amp; Clean Architecture""": """MVVM &amp; Clean Architecture""",
    """Presentation, domain, and data layers kept strictly separate. ViewModels that don't know about Views. Repositories that don't know about UI.""": """Couches présentation, domaine et data conservées strictement séparées. ViewModels ignorants les vues. Repositories ignorants l'UI.""",
    """Documentation as a Deliverable""": """La documentation comme Livrable""",
    """READMEs, API endpoint docs, inline comments, and architecture diagrams. Every project is understandable by any engineer, not just me.""": """READMEs, documentation API, commentaires inline, et diagrammes d'archi. Tout projet est compréhensible.""",
    
    # Feedback
    """06 — Endorsements""": """06 — Témoignages""",
    """Client<br><em>Feedback.</em>""": """Retours<br><em>Clients.</em>""",
    """What product owners and technical judges say about the software I build and deliver in real environments.""": """Ce que disent les PO et les juges techniques sur les logiciels que je crée et livre en environnements réels.""",
    
    # Contact
    """Available Now""": """Disponible""",
    """Let's build<br>something<br><em>worth shipping.</em>""": """Construisons<br>quelque chose<br><em>qui a du sens.</em>""",
    """Looking for an engineer who can turn ideas into real products? Let’s talk.""": """Vous cherchez un ingénieur pour transformer vos idées en produits réels ? Parlons-en.""",
    """Let's talk.""": """Parlons-en.""",
    """Call Me""": """M'appeler""",
    
    # Replacements of file names inside links
    """href="index.html\"""": """href="index-fr.html\"""",
    """href="about-mohamed-baghdad.html\"""": """href="about-mohamed-baghdad-fr.html\"""",
    """href="projects-mohamed-baghdad.html\"""": """href="projects-mohamed-baghdad-fr.html\"""",
    """href="contact-mohamed-baghdad.html\"""": """href="contact-mohamed-baghdad-fr.html\"""",

    # Extras for mobile
    """<a href="about-mohamed-baghdad.html" class="mobile-link">About</a>""": """<a href="about-mohamed-baghdad-fr.html" class="mobile-link">A propos</a>""",
    """<a href="projects-mohamed-baghdad.html" class="mobile-link">Projects</a>""": """<a href="projects-mohamed-baghdad-fr.html" class="mobile-link">Projets</a>""",
    """<a href="index.html#skills" class="mobile-link">Skills</a>""": """<a href="index-fr.html#skills" class="mobile-link">Compétences</a>""",
    """<a href="index.html#process" class="mobile-link">Process</a>""": """<a href="index-fr.html#process" class="mobile-link">Processus</a>""",
    """<a href="index.html#testimonials" class="mobile-link">Testimonials</a>""": """<a href="index-fr.html#testimonials" class="mobile-link">Témoignages</a>""",
    """<a href="contact-mohamed-baghdad.html" class="mobile-link">Contact</a>""": """<a href="contact-mohamed-baghdad-fr.html" class="mobile-link">Contact</a>"""
}

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Simple replace
    for en, fr in translations.items():
        content = content.replace(en, fr)
    
    # Fix the lang="en"
    content = content.replace('lang="en"', 'lang="fr"')
    
    dest = f.replace('.html', '-fr.html')
    with open(dest, 'w', encoding='utf-8') as file:
        file.write(content)
        
print("Translated files generated successfully.")
