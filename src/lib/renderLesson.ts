/**
 * Renders lesson markdown-like text to HTML.
 * Converts **bold** to <strong> and highlights OSHA clause references.
 */
export function renderLesson(text: string): string {
  return text
    .replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="text-industrial-900">$1</strong>'
    )
    .replace(
      /(\d{4}\.\d+(?:\([a-zA-Z]\)(?:\(\d+\))?)?)/g,
      '<code class="bg-safety-orange/10 text-safety-orange px-1 rounded text-xs font-mono">$1</code>'
    );
}
