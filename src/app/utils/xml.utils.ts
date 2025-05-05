export function parseText(xml: string): string {
  return xml
    .replace(/<italique.*?>/g, "*")
    .replace(/<\/italique.*?>/g, "*")
    .replace(/<gras.*?>/g, "**")
    .replace(/<\/gras.*?>/g, "**")
    .replace(/<exposant.*?>/g, "<sup>")
    .replace(/<\/exposant.*?>/g, "</sup>")
    .replace(/<br.*?\/>/g, "\n\n")
    .replace(/<lienAdt[^>]*.*?>/g, "[")
    .replace(/<\/lienAdt.*?>/g, "]");
}
