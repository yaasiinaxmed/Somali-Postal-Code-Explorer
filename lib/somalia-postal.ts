export interface SomaliaRegionCode {
  code: string
  name: string
  aliases: string[]
}

const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, ' ')

export const SOMALIA_REGION_CODES: SomaliaRegionCode[] = [
  { code: 'AD', name: 'AWDAL', aliases: ['awdal'] },
  { code: 'BK', name: 'BAKOOL', aliases: ['bakool'] },
  { code: 'BN', name: 'BANAADIR', aliases: ['banaadir', 'banadir'] },
  { code: 'BR', name: 'BARI', aliases: ['bari'] },
  { code: 'BY', name: 'BAY', aliases: ['bay'] },
  {
    code: 'GG',
    name: 'GALGADUUD',
    aliases: ['galgaduud', 'galmudug'],
  },
  { code: 'GD', name: 'GEDO', aliases: ['gedo'] },
  { code: 'HR', name: 'HIIRAAN', aliases: ['hiiraan', 'hiraan', 'hiran'] },
  {
    code: 'JD',
    name: 'JUBBADA DHEXE',
    aliases: ['jubbada dhexe', 'jubada dhexe', 'middle juba'],
  },
  {
    code: 'JH',
    name: 'JUBBADA HOOSE',
    aliases: ['jubbada hoose', 'jubada hoose', 'lower juba'],
  },
  { code: 'MD', name: 'MUDUG', aliases: ['mudug'] },
  { code: 'NG', name: 'NUGAAL', aliases: ['nugaal', 'nugal'] },
  { code: 'SG', name: 'SANAAG', aliases: ['sanaag'] },
  {
    code: 'SD',
    name: 'SHABEELLADA DHEXE',
    aliases: ['shabeellada dhexe', 'middle shabelle'],
  },
  {
    code: 'SH',
    name: 'SHABEELLADA HOOSE',
    aliases: ['shabeellada hoose', 'lower shabelle'],
  },
  { code: 'SL', name: 'SOOL', aliases: ['sool'] },
  { code: 'TG', name: 'TOGDHEER', aliases: ['togdheer'] },
  {
    code: 'WG',
    name: 'WAQOOYI GALBEED',
    aliases: ['waqooyi galbeed', 'woqooyi galbeed', 'somaliland'],
  },
]

const aliasToCode = new Map<string, string>()
const codeToName = new Map<string, string>()

SOMALIA_REGION_CODES.forEach((region) => {
  codeToName.set(region.code, region.name)
  aliasToCode.set(normalize(region.name), region.code)
  aliasToCode.set(normalize(region.code), region.code)
  region.aliases.forEach((alias) => aliasToCode.set(normalize(alias), region.code))
})

export function getSomaliaRegionCode(region: string): string {
  const code = aliasToCode.get(normalize(region))
  return code ?? '--'
}

export function getSomaliaRegionName(code: string): string | undefined {
  return codeToName.get(code.toUpperCase())
}

export function formatSomaliaPostalCode(postalCode: string): string {
  const digits = postalCode.replace(/\D/g, '')
  if (!digits) {
    return postalCode.trim().toUpperCase()
  }

  return digits.slice(-5).padStart(5, '0')
}

interface SomaliaAddressLinesInput {
  recipient: string
  poBox: string
  city: string
  region: string
  postalCode: string
}

export function buildSomaliaAddressLines({
  recipient,
  poBox,
  city,
  region,
  postalCode,
}: SomaliaAddressLinesInput): string[] {
  const regionCode = getSomaliaRegionCode(region)
  const formattedPostalCode = formatSomaliaPostalCode(postalCode)

  return [
    recipient.trim(),
    `P.O. Box ${poBox.trim()}`,
    `${city.trim().toUpperCase()}, ${regionCode} ${formattedPostalCode}`,
    'SOMALIA',
  ]
}
