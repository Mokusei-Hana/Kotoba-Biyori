export interface WiktionaryZhExample {
  ja: string
  zh: string
}

export interface WiktionaryZhEntry {
  title: string
  definitions: string[]
  examples: WiktionaryZhExample[]
  /** 来自中文维基词典 {{ja-pron}} 渲染的标准东京音调数字（如 [0], [2]），无则为空数组 */
  pitchAccents: number[]
  sourceName: '中文维基词典 (Wiktionary)'
  sourceUrl: string
  license: 'CC BY-SA 4.0'
}

const zhCache = new Map<string, WiktionaryZhEntry | null>()

function cleanText(raw: string): string {
  return raw.replace(/\s+/g, ' ').replace(/\s+([，。；：、！？）】])/g, '$1').trim()
}

/**
 * Extract plain Japanese text from an element containing <ruby><rt>...</rt></ruby>
 * without duplicating furigana readings.
 */
function extractPlainJapanese(el: Element): string {
  const clone = el.cloneNode(true) as Element
  clone.querySelectorAll('rt, rp, style, sup').forEach((n) => n.remove())
  return cleanText(clone.textContent ?? '')
}

/**
 * Parse rendered HTML from zh.wiktionary.org (variant=zh-cn)
 * and extract Chinese definitions & Japanese-Chinese examples from the ==日语== section.
 */
function parseWiktionaryZhHtml(title: string, html: string): WiktionaryZhEntry | null {
  if (!html || typeof DOMParser === 'undefined') return null

  const doc = new DOMParser().parseFromString(html, 'text/html')
  const root = doc.querySelector('.mw-parser-output') ?? doc.body
  const children = Array.from(root.children)

  // Locate the ==日语== / ==日語== h2 section
  let inJapaneseSection = false
  const jaNodes: Element[] = []

  for (const child of children) {
    const isH2 =
      child.tagName === 'H2' ||
      child.classList.contains('mw-heading2') ||
      Boolean(child.querySelector(':scope > h2'))

    if (isH2) {
      const headingText = cleanText(child.textContent ?? '')
      if (/日[语語]/.test(headingText)) {
        inJapaneseSection = true
        continue
      } else if (inJapaneseSection) {
        break
      }
    }

    if (inJapaneseSection) {
      jaNodes.push(child)
    }
  }

  if (jaNodes.length === 0) return null

  const definitions: string[] = []
  const examples: WiktionaryZhExample[] = []
  const pitchAccents: number[] = []
  const seenDefs = new Set<string>()
  const seenEx = new Set<string>()
  const seenAccents = new Set<number>()

  // Extract verified Tokyo pitch accent numbers rendered by {{ja-pron}},
  // e.g. "(东京) さくら [sàkúrá] (平板型 – [0])" or "(東京) はし (尾高型 - [2])"
  const tokyoPitchRegex = /(?:东|東)京[\s\S]{0,120}?(?:平板型|头高型|頭高型|中高型|尾高型|Heiban|Atamadaka|Nakadaka|Odaka)\s*[–—-]\s*\[(\d+)\]/g
  for (const node of jaNodes) {
    const text = cleanText(node.textContent ?? '')
    if (!text) continue
    let match: RegExpExecArray | null
    tokyoPitchRegex.lastIndex = 0
    while ((match = tokyoPitchRegex.exec(text)) !== null) {
      const num = Number(match[1])
      if (Number.isInteger(num) && num >= 0 && num <= 20 && !seenAccents.has(num)) {
        seenAccents.add(num)
        pitchAccents.push(num)
      }
    }
  }

  for (const node of jaNodes) {
    const ols = node.tagName === 'OL' ? [node] : Array.from(node.querySelectorAll('ol'))
    for (const ol of ols) {
      // Skip citation reference lists
      if (ol.classList.contains('references') || ol.closest('.reflist, .references')) continue

      const items = Array.from(ol.children).filter((el) => el.tagName === 'LI')
      for (const li of items) {
        // 1. Extract Chinese definition text (excluding nested examples/lists/citations)
        const defClone = li.cloneNode(true) as Element
        defClone.querySelectorAll('dl, ul, ol, style, sup, .citation-whole').forEach((n) => n.remove())
        const defText = cleanText(defClone.textContent ?? '')
        if (defText && defText.length <= 120 && !seenDefs.has(defText)) {
          seenDefs.add(defText)
          definitions.push(defText)
        }

        // 2. Extract Japanese-Chinese examples from nested <dl><dd>
        const dds = Array.from(li.querySelectorAll(':scope > dl > dd'))
        for (const dd of dds) {
          const jaEl = dd.querySelector('span[lang="ja"], .Jpan')
          if (!jaEl) continue
          const ja = extractPlainJapanese(jaEl)
          if (!ja || seenEx.has(ja)) continue

          // Find Chinese translation inside nested <dl><dd> (skipping romaji .tr)
          const subDds = Array.from(dd.querySelectorAll('dl > dd'))
          let zh = ''
          for (let i = subDds.length - 1; i >= 0; i -= 1) {
            const sub = subDds[i]
            if (sub.querySelector('.tr, span[lang="la"]')) continue
            const candidate = cleanText(sub.textContent ?? '')
            if (candidate && candidate !== ja) {
              zh = candidate
              break
            }
          }

          if (zh) {
            seenEx.add(ja)
            examples.push({ ja, zh })
          }
        }
      }
    }
  }

  if (definitions.length === 0 && pitchAccents.length === 0) return null

  return {
    title,
    definitions: definitions.slice(0, 6),
    examples: examples.slice(0, 4),
    pitchAccents,
    sourceName: '中文维基词典 (Wiktionary)',
    sourceUrl: `https://zh.wiktionary.org/wiki/${encodeURIComponent(title)}`,
    license: 'CC BY-SA 4.0',
  }
}

/**
 * Fetch authentic Simplified Chinese definitions & examples for a Japanese word
 * from zh.wiktionary.org (CC BY-SA 4.0, native CORS via origin=*).
 */
export async function fetchWiktionaryZh(
  word: string,
  signal?: AbortSignal,
): Promise<WiktionaryZhEntry | null> {
  const key = word.trim()
  if (!key) return null
  if (zhCache.has(key)) return zhCache.get(key) ?? null

  try {
    const url =
      `https://zh.wiktionary.org/w/api.php?action=parse` +
      `&page=${encodeURIComponent(key)}` +
      `&prop=text&variant=zh-cn&format=json&formatversion=2&origin=*`

    const res = await fetch(url, { signal })
    if (!res.ok) return null
    const data = (await res.json()) as {
      error?: { code?: string }
      parse?: { title?: string; text?: string }
    }
    if (data.error || !data.parse?.text) {
      zhCache.set(key, null)
      return null
    }

    const parsed = parseWiktionaryZhHtml(data.parse.title || key, data.parse.text)
    zhCache.set(key, parsed)
    return parsed
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') throw err
    return null
  }
}
