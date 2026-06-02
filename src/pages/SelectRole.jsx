import React from 'react'
import { FiBriefcase, FiUsers, FiArrowRight } from "react-icons/fi";

export default function SelectRole() {
  return (
    <div className='flex justify-center items-center' style={{minHeight: '100vh'}}>
    <div className="shadow-sm border-0 rounded-3xl p-3" style={{ width: '50rem' }}>
      <div className="p-6">
        <div className="mb-4">
            <div className="text-center">
                <h1 className="font-bold text-2xl">
                    ¿Cómo quieres usar KunaPet?
                </h1>
            </div>
            </div>
        <p className="mb-4 text-gray-500 text-center text-sm">Elige el camino que mejor te represente. Nos encargaremos de personalizar la experiencia para ti.</p>

    {/*Card embebido para iniciar sesión como cliente*/}

        <div className='flex justify-center items-center mb-4'>
               <div className='shadow-sm rounded-3xl tarjeta-hover-rojo p-6' style={{  backgroundColor: 'rgba(228, 56, 38, 0.15)', width: '100%', maxWidth: '400px' }}>
      <div>
            <div
              className="mb-3 flex justify-center items-center rounded-full shadow-sm w-[4.5rem] h-[4.5rem] mx-auto"
              style={{ backgroundColor: 'rgb(255, 253, 245)' }}
            >
                <FiUsers style={{ width: '2.2rem', height: '2.2rem', color: '#e43826' }} />
            </div>
        <div>
          <h2 className="font-bold text-lg text-center">
                Busco servicios para mis mascotas
          </h2>

            </div>
        <p className="mb-2 text-gray-500 text-sm text-center">Descubre veterinarias, grooming, paseos y experiencias diseñadas para cuidar a tus peludos como se merecen</p>

        <a href="#" className='flex items-center gap-2 no-underline link-rojo text-center justify-center'>
          Iniciar sesión como cliente
          <FiArrowRight />
          </a>
      </div>
    </div>
        </div>

    {/*Card embebido de Ofrecer servicios para empresas o particualres*/}

        <div className='flex justify-center items-center'>
          <div className='shadow-sm rounded-3xl tarjeta-hover-amarillo p-6' style={{backgroundColor: 'rgba(224, 176, 32, 0.15)', width: '100%', maxWidth: '400px'}}>
            <div>
              <div
                className="mb-3 flex justify-center items-center rounded-full shadow-sm w-[4.5rem] h-[4.5rem] mx-auto"
                style={{ backgroundColor: 'rgb(255, 253, 245)' }}
              >
                <FiBriefcase style={{ width: '2.2rem', height: '2.2rem', color: '#e0b020' }} />
              </div>
              <div>
                <h2 className="font-bold text-lg text-center">
                  Quiero ofrecer mis servicios
                </h2>
            </div>
        <p className="mb-2 text-gray-500 text-sm text-center">Descubre veterinarias, grooming, paseos y experiencias diseñadas para cuidar a tus peludos como se merecen</p>

        <a href="#" className='flex items-center gap-2 no-underline link-amarillo text-center justify-center'>
          Empezar como proveedor
          <FiArrowRight /></a>
      </div>
    </div>
        </div>
      </div>
    </div>
    </div>
  )
}

