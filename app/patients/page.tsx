import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})

export default function Page() {
  return (
    <div className={`${poppins.className} flex ml-36 mb-10`}>
      <div className='flex flex-col text-center w-full items-center'>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Magni ipsa,
        officia corporis officiis quia ad, aliquid consectetur consequuntur sed
        debitis rerum, cum molestias deleniti error soluta dolore quaerat?
        Voluptate, illo.
      </div>
    </div>
  )
}
