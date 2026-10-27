# Logica de Negocio

# Decisiones Tecnicas

### Políticas de Acceso a Nivel de Proyecto

En lugar de delegar los permisos a la base de datos, se decidió mantener toda la lógica de roles de los proyectos en el código del servidor. Esto permite tener las validaciones centralizadas y versionadas, además de facilitar muchísimo las pruebas unitarias sin pegarle a la base de datos. Esta decisión se tomó pensando que la estructura de roles es estática, es decir, al no prever cambios frecuentes en los permisos, construir un modelo dinámico y complejo en la capa de persistencia era un esfuerzo innecesario.

### Contenedor de DI

TSyringe por encima de Awilix e Inversify. Esto debido a que permite una integración muy limpia gracias a sus decoradores, brindando una experiencia de desarrollo bastante similar a la de NestJS. Si bien Awilix no requiere el uso de decoradores, su procesamiento inicial suele ser más lento debido a su funcionamiento interno, y la manera en como se definen claves de inyección puede introducir errores de seguridad durante el desarrollo. Mientras que Inversify, a pesar de ser una librería madura y ampliamente utilizada, resulta más pesada y su implementación contempla demasiado código repetitivo (boilerplate).

### Confianza en el ID del token

De forma general, en los casos de uso que requieren autenticación, no se validará el ID del usuario contra la base de datos. La regla es simple: si el ID viaja dentro del payload de un token firmado por el servidor, se asume que es completamente legítimo. Por esta misma razón, cuando acciones como crear una tarea o un proyecto requieran el identificador del dueño, este se tomará directamente del contexto de autenticación (el token) y no de los datos enviados por el cliente. Esta decisión se apoya en que, al menos en la versión actual, el sistema no contempla la desactivación ni el borrado de cuentas. Por lo tanto, si la firma del token es válida, el usuario también lo es. De esta manera, se garantiza la autoría real de las acciones y se evitan consultas innecesarias a la capa de persistencia.

**Nota técnica:** Esta decisión está acoplada al estado actual del sistema. Si el día de mañana se habilita la desactivación o borrado de usuarios, será necesario rastrear todos los casos de uso que extraen el ID del token y actualizar su lógica para validar primero en la base de datos que la cuenta correspondiente está activa.
