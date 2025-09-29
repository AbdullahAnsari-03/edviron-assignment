// CREATE: src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../payments/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

 async register(email: string, password: string, name: string) {
  const existingUser = await this.userModel.findOne({ email });
  if (existingUser) {
    throw new ConflictException('User with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new this.userModel({
    email,
    password: hashedPassword,
    name,   // ✅ changed to name
  });

  await user.save();

  return {
    message: 'User registered successfully',
    user: {
      email: user.email,
      name: user.name,   // ✅ changed to name
    },
  };
}

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: { 
        email: user.email, 
        fullName: user.name 
      }
    };
  }
}