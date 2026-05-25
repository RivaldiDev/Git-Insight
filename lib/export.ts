import { toPng } from 'html-to-image'

export async function exportToPng(element: HTMLElement, filename: string): Promise<void> {
  try {
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
    })
    
    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = dataUrl
    link.click()
  } catch (err) {
    console.error('Export failed:', err)
    throw new Error('Failed to export profile card')
  }
}
