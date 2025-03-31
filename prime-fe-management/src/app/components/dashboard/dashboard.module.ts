import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule,
    DashboardComponent
  ],
  providers: [DatePipe],
  exports: [DashboardComponent]
})
export class DashboardModule { } 