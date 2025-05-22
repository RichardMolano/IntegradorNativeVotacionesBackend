import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { RouterModule, Routes } from '@nestjs/core';

const routes: Routes = [
  {
    path: 'public',
    children: [AuthenticationModule],
  },
];

@Module({
  imports: [AuthenticationModule, RouterModule.register(routes)],
  exports: [RouterModule],
})
export class PublicModule {}
