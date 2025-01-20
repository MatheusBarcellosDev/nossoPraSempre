'use client';

import { CldUploadWidget } from 'next-cloudinary';

export default function CloudinaryConfig() {
  return (
    <CldUploadWidget uploadPreset="casal-web">
      {({ open }) => (
        <div className="hidden">
          <button onClick={() => open()}>Upload</button>
        </div>
      )}
    </CldUploadWidget>
  );
}
