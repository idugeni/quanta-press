import { ArticleGenerator } from '@/components/article-generator/index';

/**
 * Komponen MainContent untuk menampilkan konten utama halaman.
 * @returns JSX.Element
 */
export function MainContent() {
  return (
    <div className="flex-1 w-full scale-in" style={{ animationDelay: '0.4s' }}>
      <ArticleGenerator />
    </div>
  );
}