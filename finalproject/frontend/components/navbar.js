import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <div className=''>
      <Link href='/'>
        <Image
          src="/images/icon.png"
          height={48}
          width={48}
          alt="logo"
        />
      </Link>
    </div>
  )
}