import { Module } from '@nestjs/common';
import { RolModule } from './rol/rol.module';
import { RouterModule, Routes } from '@nestjs/core';
import { CandidatesModule } from './candidates/candidates.module';
import { ElectionsModule } from './elections/elections.module';
import { FacultyModule } from './faculty/faculty.module';
import { StudentModule } from './student/student.module';
import { VotesModule } from './votes/votes.module';

const routes: Routes = [
  {
    path: 'private',
    children: [
        RolModule, CandidatesModule, ElectionsModule, FacultyModule, StudentModule, VotesModule,
    ]
  }
];

@Module({
  imports: [RolModule,CandidatesModule, ElectionsModule, FacultyModule, StudentModule, VotesModule,  RouterModule.register(routes)],
  exports: [RouterModule],
  controllers: [],
  providers: [],
})
export class PrivateModule {}
