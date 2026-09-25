# ⚽ Match Fútbol — Búsqueda de Jugadores y Rivales

Plataforma web (Mobile-First / PWA) diseñada para resolver la organización de partidos de fútbol: encontrar jugadores para completar cupos o buscar equipos rivales de forma rápida, segura y centralizada.

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
*   **Experiencia Inmersiva:** Animaciones fluidas con **GSAP** e interacciones 3D con **Three.js**.

---

## 🏛️ Arquitectura del Proyecto

El proyecto implementa una combinación de **Screaming Architecture**, **Arquitectura Hexagonal (Ports & Adapters)**, **Programación Orientada a Objetos (POO)** y principios **SOLID**:

```text
src/
├── core/                         # 🧠 LÓGICA DE NEGOCIO (Hexagonal + POO + SOLID)
│   ├── shared/domain/            # Clases madre: Entity, ValueObject, DomainError
│   ├── profiles/                 # Dominio, Casos de Uso y Adaptadores de Perfiles
│   ├── matches/                  # Dominio, Casos de Uso y Adaptadores de Partidos
│   ├── applications/             # Dominio, Casos de Uso y Adaptadores de Solicitudes
│   └── chat/                     # Dominio, Casos de Uso y Adaptadores de Mensajería
│
├── features/                     # 🗣️ SCREAMING ARCHITECTURE (UI y Flujo de Producto)
│   ├── matches/                  # components/, data/, types/, animations/
│   ├── applications/             # components/, data/, types/, animations/
│   ├── profiles/                 # components/, data/, types/, animations/
│   └── chat/                     # components/, data/, types/, animations/
│
├── shared/                       # 🧱 TRANSVERSAL Y DESIGN SYSTEM
│   ├── components/               # Componentes UI reutilizables (shadcn/ui)
│   ├── lib/                      # Clientes (gsap.ts, three.ts, supabase.ts, utils.ts)
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
└── app/                          # 🌐 NEXT.JS APP ROUTER (Rutas y Layouts)
```

---

## 🛠️ Stack Tecnológico

*   **Framework Fullstack:** Next.js 16 (App Router, Server Components, Server Actions).
*   **Estilos y UI:** Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com/).
*   **Animaciones y 3D:** [GSAP](https://gsap.com/) (`@gsap/react`) + [Three.js](https://threejs.org/).
*   **Notificaciones In-App:** [Sonner](https://sonner.emilkowal.ski/).
*   **Estado & Caché:** Zustand + TanStack React Query.
*   **Base de Datos, Auth & Realtime:** [Supabase](https://supabase.com/) (PostgreSQL).
*   **ORM Contract-First:** [Prisma 8](https://www.prisma.io/) (`@prisma/orm-postgres`).

---

## 💻 Comandos Útiles

```bash
# Levantar servidor de desarrollo
pnpm dev

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
- [x] Arquitectura base (`core/`, `features/`, `shared/`).
- [x] Módulo `profiles` (Entidades POO, Value Objects y privacidad).
- [x] Módulo `matches` (Publicación y búsqueda de partidos 5v5, 7v7, 8v8, 11v11).
- [x] Módulo `applications` (Flujo de solicitud y aceptación).
- [x] Módulo `chat` (Reglas de acceso post-aceptación y mensajería del partido).
- [ ] Interfaz de usuario e integración visual (`features/` con GSAP y Three.js).

### Fase 2: Crecimiento & Expansión
- [ ] PWA instalable con notificaciones Push.
- [ ] Sistema de reputación de jugadores y penalización por ausencias.
- [ ] Integración de mapas interactivos y geolocalización avanzada.

### Fase 3: Microservicio de Inteligencia Artificial (Futuro) 🤖
- Matchmaking inteligente por nivel, zona e historial.
- Balanceo automático de equipos.
- Predicción preventiva de ausencias.