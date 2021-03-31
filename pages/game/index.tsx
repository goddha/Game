import dynamic from 'next/dynamic'

const Prototype01 = dynamic(
  () => {
    return import('./prototype01')
  },
  { ssr: false }
)

export default function Phaser() {
  return <Prototype01 />
}
