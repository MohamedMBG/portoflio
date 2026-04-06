import os
import glob

def inject_switcher(file_list, is_fr):
    for f in file_list:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        base_name = os.path.basename(f)
        if is_fr:
            en_file = base_name.replace('-fr.html', '.html')
            fr_file = base_name
            # In French files, FR is bold/ink, EN is faded
            switcher = f'''  <div class="lang-switch" style="display:flex; align-items:center; margin-right: 16px; font-family: var(--mono); font-size: 0.72rem; font-weight: 600;">
    <a href="{en_file}" style="color: var(--ink4); text-decoration: none; transition: color 0.15s;">EN</a><span style="color: var(--rule2); margin: 0 8px;">|</span><a href="{fr_file}" style="color: var(--ink); text-decoration: none;">FR</a>
  </div>
  <a href="#contact"'''
        else:
            en_file = base_name
            fr_file = base_name.replace('.html', '-fr.html')
            # In English files, EN is bold/ink, FR is faded
            switcher = f'''  <div class="lang-switch" style="display:flex; align-items:center; margin-right: 16px; font-family: var(--mono); font-size: 0.72rem; font-weight: 600;">
    <a href="{en_file}" style="color: var(--ink); text-decoration: none;">EN</a><span style="color: var(--rule2); margin: 0 8px;">|</span><a href="{fr_file}" style="color: var(--ink4); text-decoration: none; transition: color 0.15s;">FR</a>
  </div>
  <a href="#contact"'''
        
        # We find `<a href="#contact" class="nav-cta">` or `class="nav-cta">Hire Me ↗</a>` or similar
        # Since translated French ones have: `<a href="#contact" class="nav-cta">Embauchez-moi ↗</a>`
        # and English ones have: `<a href="#contact" class="nav-cta">Hire Me ↗</a>`
        # We can just replace `  <a href="#contact"`
        
        if '<div class="lang-switch"' not in content:
            content = content.replace('  <a href="#contact"', switcher)
            with open(f, 'w', encoding='utf-8') as out:
                out.write(content)

en_files = [
    "index.html",
    "about-mohamed-baghdad.html",
    "projects-mohamed-baghdad.html",
    "contact-mohamed-baghdad.html"
]

fr_files = [
    "index-fr.html",
    "about-mohamed-baghdad-fr.html",
    "projects-mohamed-baghdad-fr.html",
    "contact-mohamed-baghdad-fr.html"
]

inject_switcher(en_files, False)
inject_switcher(fr_files, True)
print("Switchers injected.")
