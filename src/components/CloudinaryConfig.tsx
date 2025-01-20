'use client';

import { CldUploadWidget } from 'next-cloudinary';

export default function CloudinaryConfig() {
  return (
    <CldUploadWidget
      uploadPreset="casal-web"
      options={{
        sources: ['local'],
        multiple: true,
        maxFiles: 10,
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
        maxFileSize: 10000000,
      }}
    >
      {({ open }) => (
        <div className="hidden">
          <button onClick={() => open()}>Upload</button>
        </div>
      )}
    </CldUploadWidget>
  );
}
