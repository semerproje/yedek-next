import { SafeImage, NewsImage, AvatarImage } from '@/components/ui/SafeImage'

export default function ImageTestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Image Error Handling Test</h1>
      
      {/* Test broken Unsplash URL */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Broken Unsplash URL Test</h2>
        <SafeImage
          src="https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80"
          alt="Test broken image"
          width={150}
          height={150}
          className="rounded"
        />
      </div>

      {/* Test News Image with category fallback */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">News Image with Category Fallback</h2>
        <NewsImage
          src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop"
          alt="Test technology news"
          category="teknoloji"
          width={400}
          height={300}
          className="rounded"
        />
      </div>

      {/* Test Avatar Image */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Avatar Image Test</h2>
        <div className="space-y-4">
          <AvatarImage
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80"
            alt="Test user avatar"
            size={80}
          />
          <AvatarImage
            src="https://ui-avatars.com/api/?name=AK&background=3b82f6&color=ffffff&size=150"
            alt="Working avatar"
            size={80}
          />
        </div>
      </div>

      {/* Test with working Picsum images */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Working Picsum Images</h2>
        <div className="grid grid-cols-3 gap-4">
          <SafeImage
            src="https://picsum.photos/200/150?seed=test1"
            alt="Test picsum 1"
            width={200}
            height={150}
            className="rounded"
          />
          <SafeImage
            src="https://picsum.photos/200/150?seed=test2"
            alt="Test picsum 2"
            width={200}
            height={150}
            className="rounded"
          />
          <SafeImage
            src="https://picsum.photos/200/150?seed=test3"
            alt="Test picsum 3"
            width={200}
            height={150}
            className="rounded"
          />
        </div>
      </div>
    </div>
  )
}
