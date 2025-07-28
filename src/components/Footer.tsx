import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-blue-400 flex items-center gap-2">
              <Image src="/logo.png" alt="꾸미다필름 로고" width={32} height={32} className="object-cover rounded-full border border-gray-300" />
              꾸미다필름
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              공간을 만드는 손길, 필름 시공 전문가가 직접 상담부터 시공까지 책임집니다.
            </p>
            <div className="mt-6 space-y-2 text-gray-400">
              <p>📞 010-4781-8012</p>
              <p>📧 interior.film.yj@gmail.com</p>
              <p>📍 꾸미다필름 인테리어 전문</p>
              <p className="text-sm">사업자등록번호: 422401-01-177401</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">서비스</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#services" className="hover:text-white transition-colors">주거 공간 필름</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">상업 공간 필름</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">가구 리폼</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">A/S 서비스</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">바로가기</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#about" className="hover:text-white transition-colors">회사소개</Link></li>
              <li><Link href="#portfolio" className="hover:text-white transition-colors">포트폴리오</Link></li>
              <li><Link href="/booking" className="hover:text-white transition-colors">상담신청</Link></li>
              <li><Link href="/admin/schedule" className="hover:text-white transition-colors">관리자</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 꾸미다필름. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              이용약관
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}