// app/update-product/[productId]/page.tsx
import UpdateProductClient from './UpdateProductClient'

interface Params {
  productId: string
}

// Composant Server Component
export default async function Page({ params }: { params: Promise<Params> }) {
  // Attendre la résolution de la promise
  const resolvedParams = await params
  
  return <UpdateProductClient productId={resolvedParams.productId} />
}