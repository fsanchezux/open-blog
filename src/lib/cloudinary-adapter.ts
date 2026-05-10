import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary'

type Args = {
  cloudName: string
  apiKey: string
  apiSecret: string
  folder?: string
}

const stripExt = (filename: string) => filename.replace(/\.[^/.]+$/, '')

const buildPublicId = (folder: string, filename: string) =>
  `${folder}/${stripExt(filename)}`

export const cloudinaryAdapter = ({
  cloudName,
  apiKey,
  apiSecret,
  folder = 'media',
}: Args) => {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })

  // The plugin invokes this once per collection to obtain a configured adapter.
  return ({}: { collection: any; prefix?: string }) => ({
    name: 'cloudinary',

    handleUpload: async ({ file }: { file: { filename: string; buffer: Buffer } }) => {
      const publicId = buildPublicId(folder, file.filename)

      await new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            resource_type: 'image',
            overwrite: true,
            invalidate: true,
          },
          (err, result) => {
            if (err) return reject(err)
            if (!result) return reject(new Error('No result from Cloudinary'))
            resolve(result)
          },
        )
        stream.end(file.buffer)
      })
    },

    handleDelete: async ({ filename }: { filename: string }) => {
      const publicId = buildPublicId(folder, filename)
      try {
        await cloudinary.uploader.destroy(publicId, { invalidate: true })
      } catch (err) {
        console.warn('Cloudinary delete failed for', publicId, err)
      }
    },

    generateURL: ({ filename }: { filename: string }) => {
      const publicId = buildPublicId(folder, filename)
      return cloudinary.url(publicId, {
        secure: true,
        fetch_format: 'auto',
        quality: 'auto',
      })
    },

    staticHandler: async (
      _req: any,
      { params }: { params: { filename: string } },
    ) => {
      const publicId = buildPublicId(folder, params.filename)
      const url = cloudinary.url(publicId, { secure: true })
      return Response.redirect(url, 302)
    },
  })
}
