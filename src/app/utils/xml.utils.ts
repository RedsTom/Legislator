export function parseText(xml: string): string {
  return xml
    .replaceAll(/<italique.*?>/g, "<i>")
    .replaceAll(/<\/italique.*?>/g, "</i>")
    .replaceAll(/<gras.*?>/g, "<b>")
    .replaceAll(/<\/gras.*?>/g, "</b>")
    .replaceAll(/<exposant.*?>/g, "<sup>")
    .replaceAll(/<\/exposant.*?>/g, "</sup>")
    .replaceAll(/<(\/|).*?br.*?(\/|)>/g, "\n")
    .replaceAll(/<lienAdt[^>]*.*?>/g, "[")
    .replaceAll(/<\/lienAdt.*?>/g, "]");
}
