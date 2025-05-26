import { Module } from '@nestjs/common';
import { RolModule } from './rol/rol.module';
import { RouterModule, Routes } from '@nestjs/core';
import { CandidatesModule } from './candidates/candidates.module';
import { ElectionsModule } from './elections/elections.module';
import { FacultyModule } from './faculty/faculty.module';
import { StudentModule } from './student/student.module';
import { VotesModule } from './votes/votes.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

const routes: Routes = [
  {
    path: 'private',
    children: [
        RolModule, CandidatesModule, ElectionsModule, FacultyModule, StudentModule, VotesModule, UserModule
    ]
  }
];

@Module({
  imports: [RolModule, CandidatesModule, ElectionsModule, FacultyModule, StudentModule, VotesModule, RouterModule.register(routes), UserModule],
  exports: [RouterModule],
  controllers: [UserController],
  providers: [UserService],
})
export class PrivateModule {}
