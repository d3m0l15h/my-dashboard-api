import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { SERVICES } from 'src/utils/constant';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/utils/mongoose/schemas/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    providers: [{
        provide: SERVICES.USER,
        useClass: UserService
    }],
    exports: [{
        provide: SERVICES.USER,
        useClass: UserService
    }]
})
export class UserModule { }
