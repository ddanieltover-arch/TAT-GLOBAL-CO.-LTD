const STEP_SEPARATORS = [' — ', ' – ', ' - '] as const;

export function parseStepText(text: string): {title: string; description: string} {
  for (const separator of STEP_SEPARATORS) {
    const index = text.indexOf(separator);
    if (index !== -1) {
      return {
        title: text.slice(0, index).trim(),
        description: text.slice(index + separator.length).trim(),
      };
    }
  }
  return {title: text.trim(), description: ''};
}
