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
*   **Geolocalización:** Filtrado de partidos y rivales por cercanía geográfica (PostGIS).

---

## 📐 Arquitectura del Proyecto

El proyecto está diseñado bajo estándares de alta calidad técnica para garantizar mantenibilidad, testabilidad y escalabilidad:

### 1. Screaming Architecture (Estructura de Directorios)
La estructura de carpetas expresa directamente el dominio del negocio (fútbol y partidos), no las herramientas técnicas:

```text
src/
├── modules/
│   ├── matches/          # Publicaciones, búsquedas de jugadores/rivales
│   ├── applications/     # Solicitudes de unión a partidos
│   ├── profiles/         # Gestión de usuarios, perfiles y privacidad
│   ├── chat/             # Mensajería y salas en tiempo real
│   └── notifications/    # Sistema de avisos (push, in-app)
├── shared/               # Componentes UI (shadcn), clientes y utilidades comunes
└── app/                  # Next.js App Router (Rutas, layouts y Server Actions)