-- ============================================================================
-- Pinturitas · 08 · Corrección: las láminas ya no dependen de una
-- suscripción en la base de datos, porque el acceso ahora se controla con
-- el código simple (?codigo=...) guardado en el celular del cliente.
-- Sin esto, NINGÚN usuario puede ver ninguna lámina, nunca.
-- Ejecutar una sola vez. Idempotente (se puede correr de nuevo sin problema).
-- ============================================================================

drop policy if exists drawings_read_subscribed on public.drawings;

create policy drawings_read_authenticated on public.drawings
  for select to authenticated using (true);
