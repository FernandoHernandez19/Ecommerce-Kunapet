import React from 'react'
import NavbarHeader from '../components/NavbarHeader';
import CarouselBanner from '../components/Carousel';
import CardsHorizontal from '../components/CardsHorizontal';
import FooterBottom from '../components/Footer'

export default function Home() {
  return (
    <div>
      <NavbarHeader />
      <CarouselBanner />
      <CardsHorizontal />
      <FooterBottom />
    </div>
  )
}
