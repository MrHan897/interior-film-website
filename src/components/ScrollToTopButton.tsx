'use client'

import { ChevronUpIcon } from '@heroicons/react/24/outline'

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40">
      <div className="relative group">
        <button
          onClick={scrollToTop}
          className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 bg-gray-600 hover:bg-gray-700 flex items-center justify-center text-white backdrop-blur-sm border-2 border-white/20"
          aria-label="페이지 상단으로 이동"
        >
          <ChevronUpIcon className="w-6 h-6 sm:w-8 sm:h-8 transition-transform duration-200" />
        </button>

        {/* 툴팁 */}
        <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            페이지 상단으로
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  )
}