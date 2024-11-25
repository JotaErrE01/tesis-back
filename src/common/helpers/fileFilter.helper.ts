
interface FileFilterHelper {
  req: Express.Request;
  file: Omit<Express.Multer.File, 'stream'>;
  // file: Express.Multer.File;
  callback: (a: Error, b: boolean) => void;
  validExtensions?: string[];
  maxFileSize?: number;
}

export const fileFilter = (fileFilterHelperOpts: FileFilterHelper) => {
  const { file, callback, validExtensions = ['jpg', 'jpeg', 'png'], maxFileSize = 0 } = fileFilterHelperOpts;

  if (!file) return callback(new Error('File is empty'), false);

  const fileExptension = file.mimetype.split('/')[1];
  if (!validExtensions.includes(fileExptension)) return callback(null, false);

  console.log({ file, maxFileSize, size: file.size });
  if (file.size > maxFileSize) return callback(null, false);

  callback(null, false);
};

