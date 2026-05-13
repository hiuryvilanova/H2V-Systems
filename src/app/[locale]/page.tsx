import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import Stats from '@/components/sections/Stats'
import Services from '@/components/sections/Services'
import GlowDivider from '@/components/ui/GlowDivider'
import ProgressBar from '@/components/ui/ProgressBar'
import BackToTop from '@/components/ui/BackToTop'
import WhatsAppFloat from '@/components/ui/WhatsAppFloat'

// Seções abaixo da fold: carregadas sob demanda para reduzir First Load JS.
const Cases        = dynamic(() => import('@/components/sections/Cases'))
const About        = dynamic(() => import('@/components/sections/About'))
const Process      = dynamic(() => import('@/components/sections/Process'))
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'))
const Faq          = dynamic(() => import('@/components/sections/Faq'))
const Contact      = dynamic(() => import('@/components/sections/Contact'))

// UI utilitário não-crítico: defer pra depois da hidratação inicial.
const CookieBanner = dynamic(() => import('@/components/ui/CookieBanner'))

export default function Home() {
  return (
    <>
      <ProgressBar />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Stats />
        <GlowDivider />
        <Services />
        <GlowDivider />
        <Cases />
        <GlowDivider />
        <About />
        <GlowDivider />
        <Process />
        <GlowDivider />
        <Testimonials />
        <GlowDivider />
        <Faq />
        <GlowDivider />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppFloat />
      <CookieBanner />
    </>
  )
}
