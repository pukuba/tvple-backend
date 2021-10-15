// Other dependencies
import { createReadStream } from "fs"
import * as s3 from "aws-sdk/clients/s3"
import * as aws from "aws-sdk"

// Local files
import { configService } from "./config.service"

export class AwsService {
    private s3Instance() {
        return new s3({
            endpoint: new aws.Endpoint(
                configService.getEnv("AWS_END_POINT") as string,
            ),
            region: configService.getEnv("REGION"),
            credentials: {
                accessKeyId: configService.getEnv("NCP_ACCESS_KEY"),
                secretAccessKey: configService.getEnv("NCP_SECRET_KEY"),
            },
        })
    }

    uploadFile(
        fileName: string,
        directory: "media" | "image",
        buffer: Buffer,
    ): string {
        this.s3Instance().upload(
            {
                Bucket: configService.getEnv("AWS_BUCKET"),
                Key: `${directory}/${fileName}`,
                Body: buffer,
                ACL: "public-read",
            },
            (error, _data) => {
                if (error) {
                    console.log(error)
                    throw Error
                }
            },
        )
        return `${configService.getEnv("AWS_END_POINT")}/${configService.getEnv(
            "AWS_BUCKET",
        )}/${directory}/${fileName},
        `
    }
}
