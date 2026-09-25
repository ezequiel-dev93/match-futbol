# ⚽ Match Fútbol — Búsqueda de Jugadores y Rivales

Plataforma web (Mobile-First / PWA) diseñada para resolver la organización de partidos de fútbol: encontrar jugadores para completar cupos o buscar equipos rivales de forma rápida, segura y centralizada.

> 📖 **Documentación Técnica:** Consulta el detalle profundo del diseño de software en [**ARCHITECTURE.md**](./ARCHITECTURE.md).

---

## 🎯 El Problema
Los partidos se organizan históricamente en grupos caóticos de WhatsApp o redes sociales sin un flujo claro de solicitud, aceptación y matching formal. **Match Fútbol** centraliza este flujo, protegiendo la privacidad de los datos personales (ej. teléfono o contacto directo) hasta que ambas partes confirman el encuentro.

---

## 🚀 Funcionalidades Principales (MVP)
*   **Publicaciones duales:**
    *   *Busco jugadores:* para completar cupos faltantes (admite definir suplentes).
    *   *Busco rival:* para jugar contra otro equipo completo o que se va armando.
*   **Sistema de Solicitudes y Matching:** Solicitudes individuales o grupales, con flujo de aceptación/rechazo por parte del organizador.
*   **Privacidad por Defecto (Niveles de Visibilidad):**
    *   *Públicos siempre:* Alias, foto, posición, zona de juego.
    *   *Privados hasta aceptación:* Teléfono y datos de contacto directo.
*   **Chat en Tiempo Real:** Canal habilitado automáticamente entre los participantes confirmados de un partido.
*   **Experiencia Inmersiva:** Tipografía oficial **Messi Font** + **DM Serif Display**, escalas fluidas con `clamp()`, animaciones con **GSAP** e interacciones 3D con **Three.js**.

---

## 🏛️ Resumen de Arquitectura

El proyecto implementa una combinación de **Screaming Architecture**, **Arquitectura Hexagonal (Ports & Adapters)**, **Programación Orientada a Objetos (POO)** y principios **SOLID** (ver más en [`ARCHITECTURE.md`](./ARCHITECTURE.md)):

```text
src/
├── core/                         # 🧠 LÓGICA DE NEGOCIO (Hexagonal + POO + SOLID)
│   ├── shared/domain/            # Clases madre: Entity, ValueObject, DomainError
│   ├── profiles/                 # Dominio, Casos de Uso, Adaptadores y Tests de Perfiles
│   ├── matches/                  # Dominio, Casos de Uso, Adaptadores y Tests de Partidos
│   ├── applications/             # Dominio, Casos de Uso, Adaptadores y Tests de Solicitudes
│   └── chat/                     # Dominio, Casos de Uso, Adaptadores y Tests de Mensajería
│
├── features/                     # 🗣️ SCREAMING ARCHITECTURE (UI y Flujo de Producto)
│   ├── matches/                  # components/, data/, types/, animations/
│   ├── applications/             # components/, data/, types/, animations/
│   ├── profiles/                 # components/, data/, types/, animations/
│   └── chat/                     # components/, data/, types/, animations/
│
├── shared/                       # 🧱 TRANSVERSAL Y DESIGN SYSTEM
│   ├── components/               # Componentes UI reutilizables (shadcn/ui)
│   ├── lib/                      # Motores gráficos (gsap.ts, three.ts) y utilidades
│   ├── hooks/                    # Hooks globales
│   ├── types/                    # Tipos globales
│   └── animations/               # Presets GSAP y escenas Three.js reutilizables
│
├── prisma/                       # 🗄️ CONTRATO DE BASE DE DATOS (Prisma 8)
│   ├── contract.prisma
│   ├── contract.json
│   ├── contract.d.ts
│   └── db.ts
│
└── app/                          # 🌐 NEXT.JS APP ROUTER (Rutas, Layouts y globals.css)
```

---

## 🛠️ Stack Tecnológico

*   **Framework Fullstack:** Next.js 16 (App Router, Server Components, Server Actions).
*   **Estilos y Design System:** Tailwind CSS v4 (Escalas fluidas `clamp()` + CSS Reset `:where()`) + [shadcn/ui](https://ui.shadcn.com/).
*   **Tipografías Oficiales:** **Messi Font** (`localFont`) + **DM Serif Display** (`H1`, `H2`, `H3`).
*   **Animaciones y 3D:** [GSAP](https://gsap.com/) (`@gsap/react`) + [Three.js](https://threejs.org/).
*   **Notificaciones In-App:** [Sonner](https://sonner.emilkowal.ski/).
*   **Estado & Caché:** Zustand + TanStack React Query.
*   **Base de Datos, Auth & Realtime:** [Supabase](https://supabase.com/) (PostgreSQL).
*   **ORM Contract-First:** [Prisma 8](https://www.prisma.io/) (`@prisma/orm-postgres`).
*   **Calidad y Testing:** [Oxlint](https://oxc.rs/) (Rust Linter) + [Vitest](https://vitest.dev/) (Unit Testing).

---

## 💻 Comandos Útiles

```bash
# Levantar servidor de desarrollo
pnpm dev

# Ejecutar Oxlint (Linter en Rust)
pnpm lint

# Ejecutar suite de tests unitarios (Vitest)
pnpm test

# Emitir contrato de Prisma 8 tras editar src/prisma/contract.prisma
pnpm prisma contract emit

# Sincronizar cambios del contrato con la base de datos en Supabase
pnpm prisma db update
```

---

## 🗺️ Roadmap

### Fase 1: MVP (En progreso)
- [x] Configuración base (Next.js + Tailwind v4 + Supabase + Prisma 8).
- [x] Contrato de datos y tablas en PostgreSQL (`profiles`, `publications`, `applications`, `messages`).
- [x] Arquitectura base (`core/`, `features/`, `shared/`) documentada en `ARCHITECTURE.md`.
- [x] Módulo `profiles` (Entidades POO, Value Objects, privacidad y tests).
- [x] Módulo `matches` (Publicación y búsqueda de partidos 5v5, 7v7, 8v8, 11v11 y tests).
- [x] Módulo `applications` (Flujo de solicitud, aceptación y tests).
- [x] Módulo `chat` (Reglas de acceso post-aceptación, mensajería y tests).
- [x] Configuración de Oxlint (Rust), Vitest y Design System Fluido (`clamp()` + tipografías Messi & Display).
- [ ] Interfaz de usuario e integración visual (`features/` con GSAP y Three.js).

### Fase 2: Crecimiento & Expansión
- [ ] PWA instalable con notificaciones Push.
- [ ] Sistema de reputación de jugadores y penalización por ausencias.
- [ ] Integración de mapas interactivos y geolocalización avanzada.

### Fase 3: Microservicio de Inteligencia Artificial (Futuro) 🤖
- Matchmaking inteligente por nivel, zona e historial.
- Balanceo automático de equipos.
- Predicción preventiva de ausencias.