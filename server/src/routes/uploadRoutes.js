import { Router } from 'express';
import { upload } from '../middleware/upload.js';
import { protect, adminOnly } from '../middleware/auth.js';
import imagekit from '../config/imagekit.js';

const router = Router();

router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded' });
    }

    const fileBuffer = req.file.buffer;
    const fileName = `img_${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: '/draksha_uploads',
    });

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to ImageKit',
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (error) {
    console.error('ImageKit Upload Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload image to ImageKit',
    });
  }
});

export default router;
