## Ziel

Alle Dateien aus dem öffentlichen Repository `github.com/mischagrieder/jennys-beuty` (Branch `main`) 1:1 in dieses Lovable-Projekt übertragen, damit der Stand hier dem GitHub-Stand entspricht.

## Repo-Inhalt (via GitHub API bestätigt)

Statische Website, identische Struktur wie dieses Projekt:

```text
index.html
css/style.css
js/main.js
favicon.svg
robots.txt
sitemap.xml
damen/index.html
herren/index.html
galerie/index.html
salon/index.html
team/index.html
kontakt/index.html
impressum/index.html
datenschutz/index.html
```

## Vorgehen

1. Für jede Datei den Rohinhalt von `https://raw.githubusercontent.com/mischagrieder/jennys-beuty/main/<pfad>` laden.
2. Jede Datei im Projekt mit dem GitHub-Inhalt überschreiben (Datei für Datei, Binärdatei `favicon.svg` als Text-SVG behandelt).
3. Nach dem Übertragen die Startseite `/` im Preview aufrufen und optisch prüfen, dass Layout, Bilder und Navigation korrekt geladen werden.

## Nicht Teil dieser Aufgabe

- Kein Anpassen von Texten, Bildern oder Preisen — es wird 1:1 vom Repo übernommen.
- Kein Backend, keine neuen Features.
- Keine Änderungen an `.gitignore`, `bun.lockb` o. ä. Lovable-internen Dateien.
