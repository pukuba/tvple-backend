// Other dependencies
import { createReadStream } from "fs"
import * as s3 from "aws-sdk/clients/s3"

// Local files
import { configService } from "./config.service"

export class AwsService {
    private s3Instance() {
        return new s3({
            accessKeyId: configService.getEnv("ACCESS_KEY"),
            secretAccessKey: configService.getEnv("SECRET_KEY"),
            region: configService.getEnv("REGION"),
        })
    }

    uploadFile(
        fileName: string,
        directory: "media" | "image",
        buffer: Buffer,
    ): string {
        this.s3Instance().upload(
            {
                Bucket: configService.getEnv("AWS_S3_BUCKET"),
                Key: `${directory}/${fileName}`,
                Body: buffer,
                ACL: "public-read",
            },
            (error, _data) => {
                if (error) throw Error
            },
        )
        return `${configService.getEnv("AWS_END_POINT")}/${configService.getEnv(
            "AWS_S3_BUCKET",
        )}/${directory}/${fileName},
        `
    }
}
