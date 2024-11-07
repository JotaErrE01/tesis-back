
export const fileNamer = (_: Express.Request, file: Express.Multer.File, callback: (a: Error, b: any) => void) => {
  const getUuid = crypto.randomUUID.bind(crypto);

  if (!file) return callback(new Error('File is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];

  const fileName = `${getUuid()}.${fileExtension}`;

  callback(null, fileName);
};
