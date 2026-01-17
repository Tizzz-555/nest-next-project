import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { importPKCS8, SignJWT } from "jose";

@Injectable()
export class TokenService {
  constructor(private readonly config: ConfigService) {}

  async signAccessToken(params: {
    userId: string;
    email: string;
  }): Promise<string> {
    const issuer = this.config.get<string>("jwt.issuer") ?? "";
    const audience = this.config.get<string>("jwt.audience") ?? "";
    const ttlSeconds = this.config.get<number>("jwt.accessTokenTtlSeconds");

    if (!issuer) throw new Error("Missing JWT issuer (jwt.issuer)");
    if (!audience) throw new Error("Missing JWT audience (jwt.audience)");
    if (!ttlSeconds || ttlSeconds <= 0) {
      throw new Error(
        "Missing/invalid JWT access token TTL (jwt.accessTokenTtlSeconds)"
      );
    }

    const privateKeyPemB64 =
      this.config.get<string>("jwt.privateKeyBase64") ?? "";
    if (!privateKeyPemB64) {
      throw new Error("Missing JWT private key (jwt.privateKeyBase64)");
    }

    const privateKeyPem = Buffer.from(privateKeyPemB64, "base64").toString(
      "utf8"
    );
    let privateKey;
    try {
      privateKey = await importPKCS8(privateKeyPem, "RS256");
    } catch {
      throw new Error("Invalid JWT private key (jwt.privateKeyBase64)");
    }

    return await new SignJWT({ email: params.email })
      .setProtectedHeader({ alg: "RS256" })
      .setSubject(params.userId)
      .setIssuedAt()
      .setIssuer(issuer)
      .setAudience(audience)
      .setExpirationTime(`${ttlSeconds}s`)
      .sign(privateKey);
  }
}
