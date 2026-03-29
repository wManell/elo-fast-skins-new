'use server'

import { getDb } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

// Buscar depoimentos aprovados para exibir no site
export async function getApprovedTestimonials() {
  try {
    const db = await getDb()
    const testimonials = await db
      .collection('testimonials')
      .find({ isApproved: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray()

    return {
      success: true,
      data: testimonials.map(t => ({
        ...t,
        _id: t._id.toString(),
      })),
    }
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return { success: false, error: error.message }
  }
}

// Enviar novo depoimento (precisa aprovação)
export async function submitTestimonial(data) {
  try {
    const db = await getDb()
    
    // Validação básica
    if (!data.clientName || !data.serviceType || !data.rating || !data.comment) {
      return { success: false, error: 'Todos os campos são obrigatórios' }
    }

    if (data.rating < 1 || data.rating > 5) {
      return { success: false, error: 'Avaliação deve ser entre 1 e 5 estrelas' }
    }

    const testimonial = {
      id: uuidv4(),
      clientName: data.clientName.trim(),
      avatarUrl: data.avatarUrl || null,
      serviceType: data.serviceType.trim(),
      rating: parseInt(data.rating),
      comment: data.comment.trim(),
      createdAt: new Date(),
      isApproved: false, // Precisa aprovação do admin
    }

    await db.collection('testimonials').insertOne(testimonial)

    return {
      success: true,
      message: 'Depoimento enviado com sucesso! Aguarde aprovação.',
    }
  } catch (error) {
    console.error('Error submitting testimonial:', error)
    return { success: false, error: 'Erro ao enviar depoimento' }
  }
}

// Buscar todos os depoimentos (para admin)
export async function getAllTestimonials() {
  try {
    const db = await getDb()
    const testimonials = await db
      .collection('testimonials')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return {
      success: true,
      data: testimonials.map(t => ({
        ...t,
        _id: t._id.toString(),
      })),
    }
  } catch (error) {
    console.error('Error fetching all testimonials:', error)
    return { success: false, error: error.message }
  }
}