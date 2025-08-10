# Willkommen beim Apologetik-Projekt!

Hallo und herzlich willkommen im Team! Wir freuen uns riesig, dass du da bist und mit uns an diesem spannenden Projekt arbeitest. Damit du dich schnell zurechtfindest, haben wir hier die wichtigsten Informationen für dich zusammengestellt. Damit kommst du hoffentlich superschnell rein.

## Was ist das hier? Ein Monorepo!

Du hast es vielleicht schon bemerkt: Dieses Projekt ist ein sogenanntes **Monorepo**. Das bedeutet, dass wir mehrere Projekte in einem einzigen Repository verwalten. Das klingt vielleicht erstmal kompliziert, hat aber super viele Vorteile für uns.

Unsere Struktur sieht so aus:

-   `apps/`: Hier leben die einzelnen Applikationen. Aktuell ist das unsere `website`.
-   `packages/`: Hier findest du wiederverwendbare Pakete, die von unseren Apps genutzt werden. Momentan haben wir hier unser `payload` CMS.

**Warum machen wir das so?**

Die Verwendung eines Monorepos bietet uns mehrere Vorteile: Es vereinfacht das Teilen von Code, wie z.B. Konfigurationen für das Payload CMS, die im `packages`-Ordner abgelegt und von mehreren Apps genutzt werden können. Außerdem verwalten wir alle unsere NPM-Pakete zentral, was Updates und die Verwaltung von Abhängigkeiten erheblich erleichtert.

## Los geht's! So startest du das Projekt

Bevor du loslegst, stelle sicher, dass du [Node.js](https://nodejs.org/) (Version 22 oder höher) und [Docker](https://www.docker.com/products/docker-desktop) installiert hast.

Wir benutzen `pnpm` als unseren Paketmanager. Falls du es noch nicht installiert hast, kannst du das ganz einfach tun:

```bash
npm install -g pnpm
```

Sobald `pnpm` startklar ist, kannst du die Abhängigkeiten für das gesamte Projekt installieren. Wechsle dazu ins Hauptverzeichnis des Monorepos und führe folgenden Befehl aus:

```bash
pnpm install
```

### Datenbank starten

Das Payload CMS benötigt eine Datenbank. Wir verwenden Docker, um eine PostgreSQL-Datenbank lokal zu starten. Du kannst die Datenbank mit folgendem Befehl starten:

```bash
pnpm db:start
```

Dieser Befehl muss nur einmal ausgeführt werden. Die Datenbank läuft dann im Hintergrund weiter. Du kannst sie mit folgendem Befehl stoppen:

```bash
pnpm db:stop
```

### Alle Applikationen starten

Um alle Applikationen (also die Website und das Payload CMS) gleichzeitig zu starten, kannst du diesen Befehl verwenden:

```bash
pnpm dev
```

Das war's schon! Jetzt sollte alles laufen und du kannst anfangen, den Code zu erkunden.

## Noch Fragen?

Wenn du Fragen hast, zögere nicht, sie zu stellen! Wir sind ein Team und helfen uns gegenseitig. Viel Spaß und happy coding! 