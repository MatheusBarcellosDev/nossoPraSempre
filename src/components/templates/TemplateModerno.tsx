interface TemplateModernoProps {
  coupleName: string;
  message: string;
  photos: string[];
  videos: string[];
}

export default function TemplateModerno({
  coupleName,
  message,
  photos,
  videos,
}: TemplateModernoProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="py-16 text-center">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
          {coupleName}
        </h1>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <section className="mb-16">
          <div className="bg-gray-800 p-8 rounded-2xl">
            <p className="text-2xl font-light text-center max-w-3xl mx-auto leading-relaxed">
              {message}
            </p>
          </div>
        </section>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-2xl"
              >
                <img
                  src={photo}
                  alt={`Foto ${index + 1} do casal`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
                  className="aspect-video bg-gray-800 rounded-2xl overflow-hidden"
                >
                  <video
                    src={video}
                    controls
                    disablePictureInPicture
                    playsInline
                    className="w-full h-full object-cover"
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
