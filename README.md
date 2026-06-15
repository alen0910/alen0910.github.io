# Brnas Ploče d.o.o. — web stranica

Statična web stranica firme **Brnas Ploče d.o.o.** (usluge klimatizacije,
grijanja i elektroinstalacija, Ploče, Hrvatska).

Izrađena u običnom **HTML-u, CSS-u i vanilla JavaScriptu** — bez build koraka i
bez vanjskih okvira (frameworka).

## Struktura

```
index.html        # početna stranica (sve sekcije)
legal.html        # pravila privatnosti
404.html          # stranica za nepostojeće rute
css/styles.css    # cjelokupni dizajn
js/main.js        # navigacija, animacije, kontakt obrazac
assets/img/       # logo, fotografije, logotipi klijenata
CNAME             # custom domena (brnasploce.com)
.nojekyll         # GitHub Pages servira datoteke kao statične
```

## Lokalni pregled

Otvorite `index.html` u pregledniku, ili pokrenite jednostavan poslužitelj:

```bash
python3 -m http.server 8000
# pa otvorite http://localhost:8000
```

## Kontakt obrazac

Obrazac šalje podatke putem [Formspree](https://formspree.io/)
(`https://formspree.io/f/xkgjbgne`) AJAX zahtjevom. Polja: ime, e-pošta,
kontakt broj i poruka.

## Deploy

Stranica se poslužuje preko GitHub Pages-a kao statične datoteke. Datoteka
`.nojekyll` osigurava da se sadržaj ne procesira kroz Jekyll.
