interface TemplateRomanticoProps {
  coupleName: string;
  message: string;
  photos: string[];
  videos: string[];
}

export default function TemplateRomantico({
  coupleName,
  message,
  photos,
  videos,
}: TemplateRomanticoProps) {
  return (
    <div className="min-h-screen bg-pink-50">
      <header className="py-16 text-center relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-32 h-32 rotate-45 border-4 border-pink-300" />
        </div>
        <h1 className="text-4xl font-serif text-pink-800 mb-4">{coupleName}</h1>
        <div className="flex items-center justify-center gap-4">
          <div className="w-8 h-px bg-pink-300" />
          <div className="text-pink-600">♥</div>
          <div className="w-8 h-px bg-pink-300" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">
        <section className="mb-16">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-xl text-center font-serif text-pink-900 max-w-2xl mx-auto leading-relaxed italic">
              {message}
            </p>
          </div>
        </section>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="aspect-square bg-white p-4 rounded-lg shadow-lg transform hover:scale-105 transition-transform"
              >
                <img
                  src={photo}
                  alt={`Foto ${index + 1} do casal`}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))}
          </div>
        </section>

        {videos.length > 0 && (
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="aspect-video bg-white p-4 rounded-lg shadow-lg"
                >
                  <video
                    src={video}
                    controls
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
