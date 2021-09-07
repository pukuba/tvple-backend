import fetch from "node-fetch"
import * as crypto from "crypto-js"
import { Injectable } from "@nestjs/common"
import { ISendVerificationMessage } from "./type/index"
import { configService } from "./config.service"

@Injectable()
export class MessageService {
    async sendVerificationMessage(bodyData: ISendVerificationMessage) {
        const { verificationCode, phoneNumber } = bodyData

        const timeStamp = Date.now().toString()
        const hmac = crypto.algo.HMAC.create(
            crypto.algo.SHA256,
            configService.getEnv("NCP_SECRET_KEY"),
        )
        hmac.update("POST")
        hmac.update(" ")
        hmac.update(
            `/sms/v2/services/${configService.getEnv("NCP_SMS_KEY")}/messages`,
        )
        hmac.update("\n")
        hmac.update(timeStamp)
        hmac.update("\n")
        hmac.update(configService.getEnv("NCP_ACCESS_KEY"))
        const hash = hmac.finalize().toString(crypto.enc.Base64)
        return await fetch(
            `https://sens.apigw.ntruss.com/sms/v2/services/${configService.getEnv(
                "NCP_SMS_KEY",
            )}/messages`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "x-ncp-iam-access-key":
                        configService.getEnv("NCP_ACCESS_KEY"),
                    "x-ncp-apigw-timestamp": timeStamp,
                    "x-ncp-apigw-signature-v2": hash,
                },
                body: JSON.stringify({
                    type: "SMS",
                    countryCode: "82",
                    from: configService.getEnv("PHONE_NUMBER"),
                    contentType: "COMM",
                    content: `[폼 클레이] 본인확인 인증번호 \n[${verificationCode}]를 화면에 입력해주세요`,
                    messages: [
                        {
                            to: phoneNumber,
                        },
                    ],
                }),
            },
        ).then((x) => x.json())
    }
}
