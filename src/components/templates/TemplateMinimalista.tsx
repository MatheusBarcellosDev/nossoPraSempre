interface TemplateMinimalistaProps {
  coupleName: string;
  message: string;
  photos: string[];
  videos: string[];
}

export default function TemplateMinimalista({
  coupleName,
  message,
  photos,
  videos,
}: TemplateMinimalistaProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="py-16 text-center">
        <h1 className="text-4xl font-light mb-4">{coupleName}</h1>
        <div className="w-16 h-1 bg-black mx-auto" />
      </header>

      <main className="max-w-6xl mx-auto px-4">
        <section className="mb-16">
          <p className="text-xl text-center max-w-2xl mx-auto leading-relaxed">
            {message}
          </p>
        </section>

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((photo, index) => (
              <div key={index} className="aspect-square">
                <img
                  src={photo}
                  alt={`Foto ${index + 1} do casal`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>

        {videos.length > 0 && (
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videos.map((video, index) => (
                <div key={index} className="aspect-video">
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
