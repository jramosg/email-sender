import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
  Font,
  Row
} from '@react-email/components';

// Constants
const Address = {
  name: 'Zubitxo Plaza, 3, 20130 Urnieta, Gipuzkoa',
  url: 'https://maps.app.goo.gl/ct7ZQvDpocAY3V5ZA'
};

const Phone = {
  name: '943 036 070',
  url: 'tel:+34943036070'
};

const WhatsApp = {
  name: '688 734 113',
  url: 'https://wa.me/688734113',
  urlCall: 'tel:+34688734113'
};

interface ContactConfirmationEmailProps {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  attachmentNames?: string;
  lang?: 'eu' | 'es';
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const ContactConfirmationEmail = ({
  name,
  email,
  phone,
  message,
  attachmentNames,
  lang = 'es'
}: ContactConfirmationEmailProps) => {
  const translations = {
    eu: {
      previewText: 'Zure mezua jaso dugu - Laguntza Fisioterapia',
      title: 'Zure mezua jaso dugu',
      greeting: `Kaixo ${name}`,
      thankYou: 'Eskerrik asko gurekin harremanetan jartzeagatik.',
      confirmation: 'Zure eskaera arrakastaz jaso dugu.',
      responseTime: 'Ahalik eta azkarren erantzungo dizugu, normalean',
      responseTimeRange: '24 ordutan gehienez',
      messageReceived: 'Jasotako mezua:',
      contactInfo: 'Zure kontaktu-datuak:',
      emergencyNote: 'Larrialdi kasuetan, deitu iezaguzu:',
      phone: 'Telefonoak',
      whatsapp: 'WhatsApp',
      address: 'Helbidea',
      addressValue: Address.name,
      hours: 'Ordutegia:',
      hoursValue: 'Astelehenetik ostiralera: 9:00 - 20:00',
      footer:
        'Mezu hau zure kontaktu-formularioaren baieztapen automatikoa da. Ez erantzun mezu honi zuzenean.',
      team: 'Laguntza Fisioterapia'
    },
    es: {
      previewText: 'Hemos recibido tu mensaje - Laguntza Fisioterapia',
      title: 'Hemos recibido tu mensaje',
      greeting: `Hola ${name}`,
      thankYou: 'Gracias por ponerte en contacto con nosotros.',
      confirmation:
        'Hemos recibido exitosamente tu formulario de contacto y nuestro equipo ya está revisando tu caso.',
      responseTime:
        'Te responderemos lo antes posible, normalmente en un plazo de',
      responseTimeRange: '24 horas como máximo',
      messageReceived: 'Mensaje recibido:',
      contactInfo: 'Tus datos de contacto:',
      emergencyNote:
        'Para casos de urgencia, llama directamente a nuestro centro:',
      phone: 'Teléfonos',
      whatsapp: 'WhatsApp',
      address: 'Dirección',
      addressValue: Address.name,
      hours: 'Horario:',
      hoursValue: 'Lunes a viernes: 9:00 - 20:00',
      footer:
        'Este mensaje es una confirmación automática de tu formulario de contacto. No respondas directamente a este correo.',
      team: 'Laguntza Fisioterapia'
    }
  };

  const t = translations[lang];

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://laguntzafisioterapia.com/fonts/inter-latin-wght-normal.woff2',
            format: 'woff2'
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                'brand-primary': '#458295',
                'brand-secondary': '#e8944a',
                'brand-light': '#cbe0e8',
                'text-primary': '#1d1d1f',
                'text-secondary': '#86868b',
                'border-light': '#f5f5f7'
              }
            }
          }
        }}
      >
        <Body className="mx-auto my-auto bg-brand-light font-inter">
          <Preview>{t.previewText}</Preview>

          <Container className="mx-auto my-0 max-w-[600px] bg-white">
            <Section className="px-8 py-12 mx-auto">
              <Link href="https://laguntzafisioterapia.com">
                <Img
                  src="https://laguntzafisioterapia.com/main-logo-horizontal.png"
                  width="200"
                  height="71.86"
                  alt="Laguntza Fisioterapia Logo"
                  className="mx-auto my-0"
                />
              </Link>
            </Section>

            {/* Main Content */}
            <Section className="px-8 pb-8">
              {/* Success Icon */}
              <Section className="text-center mb-8">
                <Img
                  alt="Success Icon"
                  width="48"
                  height="48"
                  className="mx-auto"
                  src="https://laguntzafisioterapia.com/assets/icons/check-circle-primary.png"
                ></Img>
                <Heading className="text-text-primary text-2xl font-semibold m-0 mb-4">
                  {t.title}
                </Heading>
              </Section>

              <Text className="text-text-primary text-lg leading-7 mb-4">
                {t.greeting},
              </Text>

              <Text className="text-text-primary text-base leading-6 mb-4">
                {t.thankYou}
              </Text>

              <Text className="text-text-primary text-base leading-6 mb-6">
                {t.confirmation}
              </Text>

              {/* Response Time Box */}
              <Section className="bg-brand-light rounded-xl p-6 mb-8 border border-border-light border-solid border-1">
                <Text className="text-text-primary text-base leading-6 m-0">
                  <strong>{t.responseTime}</strong>{' '}
                  <span className="text-brand-primary font-semibold">
                    {t.responseTimeRange}
                  </span>
                  .
                </Text>
              </Section>

              <Section className="mb-8">
                <Text className="text-text-primary text-base font-semibold mb-3">
                  {t.messageReceived}
                </Text>
                <Section className="bg-gray-100 rounded-lg p-4 border-l-4 border-brand-primary border-solid whitespace-pre-line">
                  <Text className="text-text-primary text-sm leading-5 m-0 ">
                    "{message}"
                  </Text>
                </Section>
              </Section>

              {/* Contact Info */}
              <Section className="mb-8">
                <Text className="text-text-primary text-base font-semibold mb-3">
                  {t.contactInfo}
                </Text>
                <Section className="bg-white rounded-lg border border-border-light border-solid border-1 p-4">
                  <Text className="text-text-secondary text-sm leading-5 m-0 mb-2">
                    <strong>Email:</strong> {email}
                  </Text>
                  {phone && (
                    <Text className="text-text-secondary text-sm leading-5 m-0 mb-2">
                      <strong>{t.phone}</strong> {phone}
                    </Text>
                  )}
                  {attachmentNames && (
                    <Text className="text-text-secondary text-sm leading-5 m-0">
                      <strong>
                        {lang === 'eu'
                          ? 'Atxikitutako dokumentuak:'
                          : 'Documentos adjuntos:'}
                      </strong>{' '}
                      {attachmentNames}
                    </Text>
                  )}
                </Section>
              </Section>

              <Hr className="border-border-light my-8 border-solid border-b-2" />

              {/* Emergency Contact */}
              <Section className="bg-red-50 rounded-lg p-6 mb-8 border border-red-200 border-solid border-1">
                <Text className="text-red-800 text-sm font-semibold mb-2">
                  {t.emergencyNote}
                </Text>
                <Link
                  href={WhatsApp.urlCall}
                  className="text-red-700 text-base font-semibold underline "
                >
                  {WhatsApp.name}
                </Link>
              </Section>

              {/* Contact Information */}
              <Section className="grid-cols-2 mb-8">
                <Section className="bg-white rounded-lg border border-border-light border-solid border-1 p-6">
                  <Text className="text-text-primary text-base font-semibold mb-4">
                    Laguntza Fisioterapia
                  </Text>

                  <Text className="text-text-secondary text-sm leading-5 mb-2">
                    <strong>{t.phone}:</strong>{' '}
                    <Link
                      href={Phone.url}
                      className="text-brand-primary underline "
                    >
                      {Phone.name}
                    </Link>
                    {' | '}
                    <Link
                      href={WhatsApp.urlCall}
                      className="text-brand-primary underline"
                    >
                      {WhatsApp.name}
                    </Link>
                  </Text>

                  <Text className="text-text-secondary text-sm leading-5 mb-2 mt-0">
                    <strong>{t.whatsapp}:</strong>{' '}
                    <Link
                      href={WhatsApp.url}
                      className="text-green-600 underline"
                    >
                      {WhatsApp.name}
                    </Link>
                  </Text>
                  <Text className="text-text-secondary text-sm leading-5 mb-2 mt-0">
                    <strong>{t.address}:</strong>{' '}
                    <Link
                      href={Address.url}
                      className="text-brand-primary underline"
                    >
                      {t.addressValue}
                    </Link>
                  </Text>
                </Section>
              </Section>

              {/* CTA Button */}
              <Section className="text-center mb-8">
                <Button
                  href="https://laguntzafisioterapia.com"
                  className="bg-brand-primary text-white font-semibold py-4 px-8 rounded-full text-base no-underline inline-block transition-all duration-200"
                >
                  {lang === 'eu'
                    ? 'Bisitatu gure webgunea'
                    : 'Visitar nuestra web'}
                </Button>
              </Section>

              {/* Social Media Section */}
              <Section className="text-center mb-8 mx-auto">
                <Text className="text-text-primary text-base font-medium mb-1">
                  {lang === 'eu'
                    ? 'Jarrai iezaguzu sare sozialetan'
                    : 'Síguenos en redes sociales'}
                </Text>
                <Row className="mx-auto w-full">
                  <Link
                    href="https://instagram.com/laguntzafisioterapia"
                    className="inline-block bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-1 rounded-full mx-auto no-underline transition-opacity duration-200"
                  >
                    <Img
                      src="https://laguntzafisioterapia.com/assets/icons/instagram.png"
                      width="24"
                      height="24"
                      alt="Instagram"
                      className="mx-auto"
                    />
                  </Link>
                </Row>
                <Row className="mx-auto w-full">
                  <Link
                    className="text-sm no-underline text-brand-primary font-bold"
                    href="https://instagram.com/laguntzafisioterapia"
                  >
                    @laguntzafisioterapia
                  </Link>
                </Row>
              </Section>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-50 px-8 py-6 border-t border-border-light border-solid border-t-1">
              <Text className="text-text-secondary text-xs text-center leading-4 m-0">
                © 2025 {t.team}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

ContactConfirmationEmail.PreviewProps = {
  name: '{{name}}',
  email: '{{email}}',
  phone: '{{phone}}',
  message: '{{message}}',
  attachmentNames: '{{attachmentNames}}',
  lang: 'es'
} as ContactConfirmationEmailProps;

export default ContactConfirmationEmail;
