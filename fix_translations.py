import glob

missed = {
    'Hire Me →': 'Embauchez-moi →',
    'Resume': 'CV',
    'Download PDF': 'Télécharger le PDF',
    'Phone': 'Téléphone',
    'Real-world Impact': 'Impact réel',
    'Flawless Execution': 'Exécution parfaite',
    'Technical Excellence': 'Excellence technique',
    'Software Engineer · EMSI 4DDSIR · Freelancer': 'Ingénieur Logiciel · EMSI 4DDSIR · Freelance',
    'About': 'A propos',
    'Skills': 'Compétences',
    'Process': 'Processus',
    'Testimonials': 'Témoignages',
    'Contact': 'Contact',
    'Projects': 'Projets'
}

fr_files = glob.glob('*-fr.html')
for f in fr_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # We only replace them if they are text content or specific locations to avoid breaking classes
    for en, fr in missed.items():
        if en in ['About', 'Skills', 'Process', 'Testimonials', 'Contact', 'Projects', 'Resume', 'Phone']:
            content = content.replace('>' + en + '<', '>' + fr + '<')
        else:
            content = content.replace(en, fr)
            
    with open(f, 'w', encoding='utf-8') as out:
        out.write(content)

print('Minor missing translations fixed.')
