"use client"

import React, { useCallback, useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { readProductById, updateProduct } from "@/app/actions"
import Wrapper from "@/app/components/Wrapper"
import { Product, FormDataType } from "@/type"

interface Props {
  productId: string
}

export default function UpdateProductClient({ productId }: Props) {
  const { user } = useUser()
  const email = user?.primaryEmailAddress?.emailAddress
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<FormDataType>({
    id: "",
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    categoryName: "",
  })

  const fetchProduct = useCallback(async () => {
    if (!email) return
    try {
      const fetched = await readProductById(productId, email)
      if (fetched) {
        setProduct(fetched)
        setFormData({
          id: fetched.id,
          name: fetched.name,
          description: fetched.description,
          price: fetched.price,
          imageUrl: fetched.imageUrl,
          categoryName: fetched.categoryName,
        })
      }
    } catch (err) {
      console.error("Erreur fetchProduct:", err)
    }
  }, [email, productId])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null
    setFile(selectedFile)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      let imageUrl = formData.imageUrl

      if (file) {
        // Supprimer l’ancienne image
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: imageUrl }),
        })

        // Upload nouvelle image
        const imageData = new FormData()
        imageData.append("file", file)

        const res = await fetch("/api/upload", {
          method: "POST",
          body: imageData,
        })
        const data: { success: boolean; path: string } = await res.json()
        if (!data.success) throw new Error("Erreur lors de l’upload de l’image.")
        imageUrl = data.path
      }

      await updateProduct({ ...formData, imageUrl }, email)
      toast.success("Produit mis à jour avec succès !")
      router.push("/products")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue")
    }
  }

  return (
    <Wrapper>
      {product ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
          />
          <button className="btn btn-primary">Mettre à jour</button>
        </form>
      ) : (
        <span className="loading loading-spinner loading-xl"></span>
      )}
    </Wrapper>
  )
}
