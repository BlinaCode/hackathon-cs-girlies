// Curated national mental health / suicide crisis helplines, verified against
// Wikipedia's "List of suicide crisis lines" at the time this was written.
// Not exhaustive — numbers can change, so this is reviewed periodically rather
// than fetched live. For countries not listed here, point people at
// findahelpline.com (linked in the UI), a maintained global directory.
export const CRISIS_LINES = [
  {
    countryCode: 'US',
    countryName: 'United States',
    lines: [
      { name: '988 Suicide & Crisis Lifeline', phone: '988', text: '838255', hours: '24/7' }
    ]
  },
  {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    lines: [
      { name: 'Samaritans', phone: '116 123', hours: '24/7' }
    ]
  },
  {
    countryCode: 'CA',
    countryName: 'Canada',
    lines: [
      { name: 'Talk Suicide Canada', phone: '988', hours: '24/7' }
    ]
  },
  {
    countryCode: 'AU',
    countryName: 'Australia',
    lines: [
      { name: 'Lifeline Australia', phone: '13 11 14', hours: '24/7' }
    ]
  },
  {
    countryCode: 'IN',
    countryName: 'India',
    lines: [
      { name: 'Tele-MANAS Mental Health Network', phone: '14416', hours: '24/7' }
    ]
  },
  {
    countryCode: 'IE',
    countryName: 'Ireland',
    lines: [
      { name: 'Samaritans Ireland', phone: '116 123', hours: '24/7' }
    ]
  },
  {
    countryCode: 'DE',
    countryName: 'Germany',
    lines: [
      { name: 'Telefonseelsorge', phone: '116 123', hours: '24/7' }
    ]
  },
  {
    countryCode: 'FR',
    countryName: 'France',
    lines: [
      { name: 'Numéro national de prévention du suicide', phone: '3114', hours: '24/7' }
    ]
  },
  {
    countryCode: 'NZ',
    countryName: 'New Zealand',
    lines: [
      { name: 'Need to Talk?', phone: '1737' }
    ]
  },
  {
    countryCode: 'ZA',
    countryName: 'South Africa',
    lines: [
      { name: 'SADAG Mental Health Line', phone: '0800 567 567', hours: '24/7' }
    ]
  },
  {
    countryCode: 'SG',
    countryName: 'Singapore',
    lines: [
      { name: 'Samaritans of Singapore (SOS)', phone: '1767' }
    ]
  },
  {
    countryCode: 'JP',
    countryName: 'Japan',
    lines: [
      { name: '#いのちSOS (Inochi SOS)', phone: '0120 061 338' }
    ]
  },
  {
    countryCode: 'BR',
    countryName: 'Brazil',
    lines: [
      { name: 'CVV — Centro de Valorização da Vida', phone: '188', hours: '24/7' }
    ]
  },
  {
    countryCode: 'AR',
    countryName: 'Argentina',
    lines: [
      { name: 'Orientación y Apoyo en la Urgencia de Salud Mental', phone: '0800 999 0091' }
    ]
  },
  {
    countryCode: 'CL',
    countryName: 'Chile',
    lines: [
      { name: 'Línea de Prevención del Suicidio y Saludablemente', phone: '*4141' }
    ]
  },
  {
    countryCode: 'CO',
    countryName: 'Colombia',
    lines: [
      { name: 'Línea 106 Nacional de Salud Mental', phone: '106' }
    ]
  },
  {
    countryCode: 'PE',
    countryName: 'Peru',
    lines: [
      { name: 'Línea 113 Salud', phone: '113', note: 'Press 5 for mental health support' }
    ]
  },
  {
    countryCode: 'UY',
    countryName: 'Uruguay',
    lines: [
      { name: 'Línea de Prevención del Suicidio', phone: '0800 0767' }
    ]
  },
  {
    countryCode: 'EC',
    countryName: 'Ecuador',
    lines: [
      { name: 'Línea 171 MSP', phone: '171', note: 'Press 6 for mental health support' }
    ]
  }
];
