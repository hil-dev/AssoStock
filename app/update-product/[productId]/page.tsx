// app/update-product/[productId]/page.tsx
import UpdateProductClient from './UpdateProductClient'

interface Params {
  productId: string
}

// Le composant page ici peut être async pour correspondre aux types Next.js
export default async function Page({ params }: { params: Params }) {
  // On passe simplement l'id au composant client
  return <UpdateProductClient productId={params.productId} />
}
