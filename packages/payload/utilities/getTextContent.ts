export function getTextContent(content?: any[]) {
  let textContent = ''

  const extractText = (node: any) => {
    if (node.type === 'text') {
      textContent += node.text + ' '
    } else if (node.type === 'block' && node.fields.blockType === 'excerptBlock') {
      node.fields.text.root.children.forEach((child: any) => extractText(child))
    } else if (node.children) {
      node.children.forEach((child: any) => extractText(child))
    }
  }

  if (typeof content === 'object' && content.length > 0) {
    content?.forEach((node) => extractText(node))
  }
  return textContent
}
