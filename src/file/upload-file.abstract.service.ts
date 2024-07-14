export abstract class UploadFileServiceAbstract {
  abstract uploadFileToPublicBucket(
    path: string,
    { file, file_name }: { file: Express.Multer.File; file_name: string },
  ): Promise<string>;
  //   : Promise<{ url: string; key: string }>;
}
