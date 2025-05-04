import { toast } from "sonner"

/**
 * Fungsi untuk menampilkan toast sukses dengan format yang konsisten
 * @param title - Judul toast
 * @param message - Pesan detail opsional
 */
export function showSuccessToast(title: string, message?: string) {
  toast.success(title, {
    description: message,
    id: `success-${Date.now()}`
  })
}

/**
 * Fungsi untuk menampilkan toast error dengan format yang konsisten
 * @param title - Judul toast error
 * @param message - Pesan error detail opsional
 * @param error - Object error (opsional untuk logging)
 */
export function showErrorToast(title: string, message?: string, error?: unknown) {
  // Log error ke console jika ada
  if (error) {
    console.error("Error:", error)
  }
  
  toast.error(title, {
    description: message,
    id: `error-${Date.now()}`
  })
}

/**
 * Fungsi untuk menampilkan toast peringatan dengan format yang konsisten
 * @param title - Judul toast peringatan
 * @param message - Pesan peringatan detail opsional
 */
export function showWarningToast(title: string, message?: string) {
  toast.warning(title, {
    description: message,
    id: `warning-${Date.now()}`
  })
}

/**
 * Fungsi untuk menampilkan toast informasi dengan format yang konsisten
 * @param title - Judul toast informasi
 * @param message - Pesan informasi detail opsional
 */
export function showInfoToast(title: string, message?: string) {
  toast.info(title, {
    description: message,
    id: `info-${Date.now()}`
  })
}

/**
 * Fungsi untuk menampilkan toast loading dengan format yang konsisten
 * @param title - Judul toast loading
 * @param message - Pesan loading detail opsional
 * @returns Fungsi untuk memperbarui atau menghapus toast
 */
export function showLoadingToast(title: string, message?: string) {
  return toast.loading(title, {
    description: message,
    id: `loading-${Date.now()}`
  })
} 