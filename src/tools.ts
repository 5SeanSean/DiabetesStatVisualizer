export function trimText(text: string, char: string): string {
    const index = text.indexOf(char);
    return index === -1 ? text : text.substring(0, index);
  }