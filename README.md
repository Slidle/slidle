# Slidle

Juego web de rompecabezas deslizante con reto diario, clasificaciones y mecánicas de retención estilo Wordle.

---

## Objetivo

Desarrollar una aplicación web interactiva con la metodología "juguete": disponibilizar un MVP jugable desde las primeras fases. 
El usuario resuelve un puzzle deslizante único por día (con semilla compartida). El sistema registra tiempos y movimientos para construir una tabla de clasificación diaria, permitiendo a los jugadores guardar su progreso vía autenticación con Google o competir anónimamente mediante apodos generados automáticamente.

**Entregable del proyecto:** Plataforma web funcional con reto diario desplegada públicamente en staging.

---

## Integrantes del equipo

| Nombre | Rol | LinkedIn | GitHub / Sitio |
|---|---|---|---|
| Sebastian Di Giuseppe | Project Manager | [link](https://www.linkedin.com/in/sebadigiuseppe/) | [https://seba-dg-portfolio.ai.studio](https://seba-dg-portfolio.ai.studio) |
| Maria Daniela Monti Julien | Frontend Developer | [link](https://www.linkedin.com/in/mariamonti/) | [https://montimaria.github.io/Portfolio/](https://montimaria.github.io/Portfolio/) |
| Héctor Armando Cortez | Backend Developer | [link](https://www.linkedin.com/in/hector-cortez-cy/?lipi=urn%3Ali%3Apage%3Ad_flagship3_detail_base%3Bjf4i0OnwQYeGAAi6HP32xA%3D%3D) | - |
| Vanina Restelli | UX/UI Designer | [link](https://www.linkedin.com/in/vaninarestelli/?lipi=urn%3Ali%3Apage%3Ad_flagship3_detail_base%3Bjf4i0OnwQYeGAAi6HP32xA%3D%3D) | - |
| Pamela Calafate | QA Tester | [link](https://www.linkedin.com/in/pamelacalafate/?lipi=urn%3Ali%3Apage%3Ad_flagship3_detail_base%3Bjf4i0OnwQYeGAAi6HP32xA%3D%3D) | - |
---

## Estructura del repositorio

Este es un monorepo: un solo repositorio de Git y cada entregable aislado en su propio directorio con su configuración independiente.

| Directorio | Entregable | Responsable principal | Detalle |
|---|---|---|---|
| `frontend/` | Aplicación web en React + Tailwind | Frontend |
| `backend/` | API REST y persistencia | Backend |
| `design/` | Flujos de usuario, diseño de pantallas y assets de Figma | UX/UI Designer |
| `testing/` | Planes de prueba, matrices de casos y reportes de QA | QA Tester |
| `database/` | Esquema y scripts de base de datos | Backend |
| `docs/` | Minutas, acuerdos técnicos y contratos de API | PM / Equipo |
---

## Stack técnico del arquetipo

El proyecto inicializa con:
* **Frontend:** React + TypeScript + Vite + Tailwind.
* **Backend:** (sujeto a definición final del equipo de backend).

### Reglas de consistencia
1. **Contrato de API primero:** Todo endpoint acordado se documenta previamente. La interfaz entre frontend y backend es el límite innegociable.
2. **Entregable funcional:** Cualquier modificación en las tecnologías debe garantizar la compatibilidad con el entorno local y el despliegue en staging.

---

## Secretos y variables de entorno

Regla número uno del proyecto: **ningún secreto ni credencial entra al repositorio**.

* Cada subdirectorio contiene un archivo `.env.example` con variables ficticias versionadas.
* Cada desarrollador copia `.env.example` a `.env` localmente (ignorado por `.gitignore`).
* Las credenciales reales (OAuth IDs de Google, cadenas de conexión de base de datos) se comparten por canal privado seguro.
* Toda variable nueva debe sumarse de inmediato a su respectivo `.env.example`.

---

## Puesta en marcha local

### Requisitos previos
* Git
* [Node.js](https://nodejs.org/) (versión 20 o superior recomendada) y npm
* JDK 21 (para desarrollo de backend en Spring Boot)

### 1. Clonar el repositorio
```bash
git clone <https://github.com/MontiMaria/slidle.git>
cd slidle