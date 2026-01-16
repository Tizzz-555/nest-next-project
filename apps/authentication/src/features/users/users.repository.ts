import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async createUser(params: { email: string; passwordHash: string }): Promise<UserDocument> {
    const created = new this.userModel({
      email: params.email.toLowerCase(),
      passwordHash: params.passwordHash,
    });
    return await created.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return await this.userModel.find({}).sort({ createdAt: -1 }).exec();
  }
}

