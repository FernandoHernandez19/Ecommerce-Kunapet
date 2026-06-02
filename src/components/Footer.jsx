import React from 'react'
import BrandImage from '../assets/Kunapet.png';
import '../index.css';

export default function footer() {
  return (
    <footer className="background-ftter">
        <div className="mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row gap-8 md:gap-0">
                <div className="w-full md:w-1/2 text-center md:text-left py-3 md:py-0">
                    <img src={BrandImage} alt="" style={{width: "12rem", height: "auto"}}/>
                    <p className="mb-0 text-gray-500 text-sm">© 2024 KunaPet Marketplace. All rights reserved.</p>
                </div>

                <div className="w-full md:w-1/2 flex justify-center md:justify-end gap-3 items-center flex-wrap">
                 <a href="#" className="no-underline text-gray-700 text-sm">About us</a>
                 <a href="#" className="no-underline text-gray-700 text-sm">Privacy Policy</a>
                 <a href="#" className="no-underline text-gray-700 text-sm">Terms of Services</a>

                </div>
            </div>
        </div>
    </footer>
  )
}
