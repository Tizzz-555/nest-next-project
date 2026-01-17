import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { importSPKI, jwtVerify } from "jose";

export interface JwtUserPayload {
  sub: string;
  email?: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx
      .switchToHttp()
      .getRequest<{ headers?: Record<string, unknown>; user?: unknown }>();
    const authHeader = getHeader(req.headers, "authorization");
    const token = extractBearerToken(authHeader);

    if (!token) {
      throw new UnauthorizedException({ message: "Missing Bearer token" });
    }

    const issuer = this.config.get<string>("jwt.issuer") ?? "";
    const audience = this.config.get<string>("jwt.audience") ?? "";
    if (!issuer) {
      throw new InternalServerErrorException({
        message: "JWT issuer not configured",
      });
    }
    if (!audience) {
      throw new InternalServerErrorException({
        message: "JWT audience not configured",
      });
    }
    const publicKeyPemB64 =
      this.config.get<string>("jwt.publicKeyBase64") ?? "";
    if (!publicKeyPemB64) {
      throw new InternalServerErrorException({
        message: "JWT public key not configured",
      });
    }

    let publicKey;
    try {
      const publicKeyPem = Buffer.from(publicKeyPemB64, "base64").toString(
        "utf8"
      );
      publicKey = await importSPKI(publicKeyPem, "RS256");
    } catch {
      throw new InternalServerErrorException({
        message: "Invalid JWT public key (jwt.publicKeyBase64)",
      });
    }

    try {
      const { payload } = await jwtVerify(token, publicKey, {
        issuer,
        audience,
      });

      req.user = payload as unknown as JwtUserPayload;
      return true;
    } catch {
      throw new UnauthorizedException({ message: "Invalid token" });
    }
  }
}

function getHeader(
  headers: Record<string, unknown> | undefined,
  key: string
): string | undefined {
  if (!headers) return undefined;
  const v = headers[key] ?? headers[key.toLowerCase()];
  return typeof v === "string" ? v : undefined;
}

function extractBearerToken(
  authHeader: string | undefined
): string | undefined {
  if (!authHeader) return undefined;
  const m = authHeader.match(/^Bearer\s+(.+)$/i);
  return m?.[1]?.trim();
}
