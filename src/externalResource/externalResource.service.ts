import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExternalResourceDto, EditExternalResourceDto } from './dto';

@Injectable()
export class ExternalResourceService {
  constructor(private prisma: PrismaService) {}

  //Get ExternalResource by TopicId
  async getExternalResourceByTopicId(topicId: number) {
    try {
      const allExternalResources = await this.prisma.externalResource.findMany({
        where: {
          isDeleted: false,
          topicId: topicId,
        },
      });

      return allExternalResources;
    } catch (error) {
      throw error;
    }
  }

  //Get ExternalResource by Id
  async getExternalResourceById(externalResourceId: number) {
    try {
      const externalResource = await this.prisma.externalResource.findUnique({
        where: {
          id: externalResourceId,
        },
      });

      return externalResource;
    } catch (error) {
      throw error;
    }
  }

  //Create ExternalResource
  async createExternalResource(
    dto: CreateExternalResourceDto,
    file: Express.Multer.File,
  ) {
    try {
      // Create new ExternalResource
      const newExternalResource = await this.prisma.externalResource.create({
        data: {
          topicId: dto.topicId,
          externalUrl: dto.externalUrl,
          name: dto.name,
          description: dto.description,
        },
      });

      const { originalname, mimetype, buffer } = file;
      console.log(originalname);

      if (!originalname || !mimetype || !buffer) {
        throw new Error('Invalid file data');
      }

      //Create Attachment
      const attachment = await this.prisma.attachment.create({
        data: {
          externalResourceId: newExternalResource.id,
          name: originalname,
          mimeType: mimetype,
          data: buffer,
        },
      });

      return { ...newExternalResource, attachment };
    } catch (error) {
      throw error;
    }
  }

  //Edit ExternalResource by Id
  async editExternalResourceById(
    externalResourceId: number,
    dto: EditExternalResourceDto,
  ) {
    try {
      //Update ExternalResource
      await this.prisma.externalResource.update({
        where: {
          id: externalResourceId,
        },
        data: {
          ...dto,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  //Delete ExternalResource By Id
  async deleteExternalResourceById(ExternalResourceId: number) {
    try {
      await this.prisma.externalResource.update({
        where: {
          id: ExternalResourceId,
        },
        data: {
          isDeleted: true,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
}
