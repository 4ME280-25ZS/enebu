Wishlist (sdílený) — jednoduchá webová aplikace

Co to dělá
- Umožní vytvořit veřejný wishlist (adresovaný slugem v URL, např. `?id=moje-narozeniny`).
- Kdokoli, kdo má URL, může položku na wishlistu "rezervovat" (zadáním svého jména).
- Aplikace používá Firebase Firestore jako databázi a nasadíte ji jako statický web na GitHub Pages.

Soubory
- `index.html` — rozhraní
- `style.css` — základní styly
- `app.js` — logika a Firebase integrace
- `firestore.rules` — doporučené pravidla zabezpečení

Nastavení Firebase
1. Vytvořte projekt ve Firebase konzoli (https://console.firebase.google.com/).
2. Zapněte Firestore (Native mode).
3. Zkopírujte konfiguraci webové aplikace (firebaseConfig). Vložte ji do `app.js` do proměnné `firebaseConfig`.
4. V konzoli -> Firestore -> Rules nahraďte obsahem `firestore.rules` a publikujte.

Poznámky k bezpečnosti
- Pravidla v `firestore.rules` povolují veřejné čtení a umožní aktualizaci položky pouze tehdy, pokud je `owner` dosud `null`. To pomáhá zabránit přepsání rezervace.
- Pokud chcete později přidat možnost odrezervování nebo řízení oprávnění, upravte pravidla a klientskou logiku.

Nasazení na GitHub Pages
1. Vytvořte git repozitář a pushněte tyto soubory na GitHub (větve `main` nebo `master`).
2. V GitHub repo -> Settings -> Pages: vyberte větev `main` a root jako zdroj, uložte.
3. Po chvíli bude web dostupný na `https://<vaše-uživatelské-jméno>.github.io/<repo>/`.
4. Sdílejte odkaz `https://.../?id=moje-narozeniny`.

Lokální test

Spusťte jednoduchý HTTP server ve složce projektu (např. Python):

```bash
python3 -m http.server 8000
# otevřít http://localhost:8000/?id=test
```

Další kroky
- Přidat validaci slugu, hezčí UI, možnost nahrát obrázek, export seznamu.
- Volitelně přidat ověření přes Google/Email pro správce.

Pokud chcete, že to pro vás plně nastavím (včetně vytvoření Firebase projektu a vložení konfigurace), dejte vědět a provedu to krok za krokem.
