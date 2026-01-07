# Osobní vizitka (statická)

Tento repozitář obsahuje jednoduchou statickou webovou stránku osobní vizitky v adresáři `docs/`.

Jak nasadit na GitHub Pages:

1. Vytvořte repozitář na GitHubu a přidejte vzdálený `origin`.
2. Pushněte větev `main` (nebo `master`) do GitHubu:

```bash
git add .
git commit -m "Add personal site"
git push -u origin main
```

3. V GitHubu – Settings → Pages: vyberte zdroj *Branch: main / folder: /docs* a uložte.

Alternativa: workflow `.github/workflows/deploy.yml` automaticky nasadí obsah `docs/` do větve `gh-pages` po pushi na `main`.

Lokálně si stránku rychle otestujete z kořenové složky nebo z `docs/`:

```bash
# z root
python -m http.server 8000 --directory docs
# nebo ve složce docs
python -m http.server 8000
```

Úpravy:
- Nahraďte jméno, kontakt a projekty vlastními údaji v `docs/index.html`.
- Přidejte obrázky do `docs/assets/`.

Licence: tento projekt je příklad – upravte podle potřeby.