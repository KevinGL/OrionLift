import crypto, { CipherKey } from "crypto";

const algorithm = "aes-256-gcm";

export function encrypt(text: string)
{
    const iv = crypto.randomBytes(12);

    const key = Buffer.from(process.env.NEXT_PUBLIC_CRYPT_KEY!, "hex");

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    const encrypted = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final()
    ]);

    const tag = cipher.getAuthTag();

    const data =
    {
        iv: iv.toString("hex"),
        content: encrypted.toString("hex"),
        tag: tag.toString("hex"),
    };

    return base64(JSON.stringify(data));
}

export function decrypt(data: any)
{
    const key = Buffer.from(process.env.NEXT_PUBLIC_CRYPT_KEY!, "hex");
    
    const decipher = crypto.createDecipheriv(
        algorithm,
        key,
        Buffer.from(data.iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(data.tag, "hex"));

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(data.content, "hex")),
        decipher.final()
    ]);

    return decrypted.toString("utf8");
}
