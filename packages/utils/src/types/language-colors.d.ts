declare module 'language-colors' {
  interface Color {
    model: string
    color: [number, number, number]
    valpha: number
  }

  const LanguageColors: {
    [language: string]: Color
  }

  export = LanguageColors
}
