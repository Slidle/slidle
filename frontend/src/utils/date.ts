export function getFormattedToday(): string {
  const today = new Date();
  const day = today.getDate();
  const month = today.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
  const weekday = today.toLocaleDateString('es-AR', { weekday: 'long' });

  // Ej: "Sábado, 24 oct"
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} ${month}`;
}