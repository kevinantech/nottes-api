# Miembros de proyecto como parte del contexto `project`

**Fecha:** 2026-10-29

## Problema

Un proyecto necesita relacionar usuarios con un rol propio del proyecto. La
membresía no representa un dominio ni un subdominio independiente: su ciclo de
vida, sus invariantes y sus reglas de acceso pertenecen a la gestión de
proyectos.

## Opciones

- **Nuevo contexto `project-member`:** separación física clara. (− crea un
  dominio artificial, duplica reglas de proyecto y obliga a coordinar dos
  contextos para una sola transacción)
- **Segundo agregado dentro de `project`:** mantiene límites reales. (+ la
  membresía evoluciona con el proyecto; − el módulo `project` crece y debe
  exponer una política de acceso reutilizable)
- **Array embebido en `Project`:** simple y atómico. (− dificulta consultar por
  usuario y el ciclo de vida independiente de cada membresía)

## Decisión

La membresía vive en `src/core/project/` como un segundo agregado del contexto.
No se crea un módulo `project-member` ni se ubica en `management`, que solo
contiene constantes de políticas.

## Consecuencias

El contexto `project` debe exponer un repositorio de membresías y una política
de autorización para que otros módulos, como tareas, no dupliquen las reglas.
La creación del proyecto y de su membresía `OWNER` ocurre en una transacción.

---

# Persistencia de miembros

## Problema

Los miembros deben consultarse por proyecto, por usuario y por la combinación
`(projectId, userId)`, además de ser referenciados por otras entidades.

## Opciones

- **Array embebido en el documento del proyecto:** una sola escritura. (−
  consultas por usuario menos naturales y actualizaciones posicionales)
- **Colección separada `project_members`:** consultas directas e índice único.
  (− requiere una transacción al crear el proyecto)

## Decisión

Colección separada `project_members` con índice único `(projectId, userId)` y
un índice por `userId`. El límite de 20 miembros no obliga a embeber: los
patrones de consulta y la referencia futura desde tareas favorecen una
colección.

## Consecuencias

Cada membresía tiene identidad propia (`id`, `joinedAt`, `invitedBy`) y puede
gestionarse sin reescribir el documento completo del proyecto. El límite de
miembros se controla con un contador atómico, no con `countDocuments`.

---

# Propiedad del proyecto

## Problema

`Project.ownerId` ya existe y es consultado por los casos de uso actuales. La
nueva membresía `OWNER` introduce una segunda representación de la propiedad.

## Opciones

- **Eliminar `ownerId` y derivar la propiedad del rol `OWNER`:** modelo único,
  pero requiere migrar proyecto, tareas y autorizaciones existentes.
- **Mantener `ownerId` como fuente de verdad y la membresía `OWNER` como
  espejo:** menor impacto y compatible con el código actual. (− exige una
  invariante explícita)

## Decisión

`Project.ownerId` sigue siendo la fuente de verdad. Cada proyecto tiene una
membresía `OWNER` obligatoria creada en la misma transacción. El owner no puede
eliminarse ni cambiar de rol; una futura transferencia de propiedad deberá
actualizar ambos datos en una transacción.

## Consecuencias

El backfill debe crear la membresía `OWNER` de los proyectos existentes. La
autorización no debe repartirse entre comparaciones directas contra `ownerId` y
consultas de membresía.

---

# Roles y autorización de proyecto

## Problema

El rol global de la cuenta (`UserRole`) no representa permisos dentro de un
proyecto. Además, las reglas de quién puede editar el proyecto o gestionar
miembros deben ser consistentes entre módulos.

## Opciones

- **Reutilizar `UserRole`:** evita un enum nuevo. (− mezcla autenticación global
  con autorización contextual)
- **Roles de proyecto con política centralizada:** separa conceptos. (+ reglas
  reutilizables; − un archivo adicional de dominio)

## Decisión

Se crea `ProjectRole` con `OWNER`, `ADMIN`, `MEMBER` y `VIEWER`. Las reglas de
permisos se concentran en una política de acceso del contexto `project`:

- `OWNER`: control total.
- `ADMIN`: gestiona miembros y edita el proyecto.
- `MEMBER`: consulta y colabora.
- `VIEWER`: solo lectura.

Nadie puede asignar el rol `OWNER` manualmente ni modificar al owner. Solo
`OWNER` y `ADMIN` gestionan membresías.

## Consecuencias

Los casos de uso resuelven el rol del actor y delegan la decisión a la política.
El módulo `_task` queda pendiente de consumir esa política cuando se reactive.
