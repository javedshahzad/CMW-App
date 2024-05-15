import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../guards/auth.guard';
import { DataResolverService } from '../services/data-resolver/data-resolver.service';
import { Role } from '../models/role-model';
import { AnnoucementComponent } from '../pages/annoucement/annoucement.component';
import { PendingRequestsPageModule } from '../pending-requests/pending-requests.module';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    // canActivate: [AuthGuard],
    children: [
      {
        path: 'available-requests',
        loadChildren: () => import('../available-requests/available-requests.module').then(m => m.AvailableRequestsPageModule),
      
      },
      {
        path: 'my-requests',
        data:{role  :[Role.user]},
        canActivate:[AuthGuard],
        loadChildren: () => import('../my-requests/my-requests.module').then(m => m.MyRequestsPageModule), 
      },
      {
        path: 'closed-requests',
        loadChildren: () => import('../closed-requests/closed-requests.module').then( m => m.ClosedRequestsPageModule)
      },
      {
        path: 'pending-requests',
        data:{role  :[Role.hrAdmin]},
        loadChildren: () => {return PendingRequestsPageModule},
      },
      {
        path: 'swap-requests',
        loadChildren: () => import('../pages/swap-requests/swap-requests.module').then( m => m.SwapRequestsPageModule),
      },
      {
        path: 'vto-requests',
        loadChildren: () => import('../pages/vto-requests/vto-requests.module').then( m => m.VtoRequestsPageModule),
      },
      {
        path: 'vot-requests',
        loadChildren: () => import('../pages/vot-requests/vot-requests.module').then( m => m.VotRequestsPageModule)
      },
      {
        path: 'call-in-requests',
        loadChildren: () => import('../pages/call-in-request/call-in-request.module').then( m => m.CallInRequestPageModule),
      },
      {
        path: 'early-go-requests',
        loadChildren: () => import('../pages/early-go-request/early-go-request.module').then( m => m.EarlyGoRequestPageModule),
      },
      {
        path: 'flex-work-requests',
        loadChildren: () => import('../pages/flex-work-request/flex-work-request.module').then( m => m.FlexWorkRequestPageModule)
      },
      {
        path: 'time-off-requests',
        loadChildren: () => import('../pages/time-off-request/time-off-request.module').then( m => m.TimeOffRequestPageModule)
      },
      {
        path: 'late-in-request',
        loadChildren: () => import('../pages/late-in-request/late-in-request.module').then( m => m.LateInRequestPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/my-requests',
        pathMatch: 'full',
        data: { role: [Role.user] },
        canActivate: [AuthGuard]
        
      },
      {
        path: 'swap-request-detail',
        resolve: {
          special: DataResolverService
        },
        loadChildren: () => import('../pages/swap-request-detail/swap-request-detail.module').then( m => m.SwapRequestDetailPageModule),
        
      },
      {
        path: 'vot-request-detail',
        loadChildren: () => import('../pages/vot-request-detail/vot-request-detail.module').then( m => m.VotRequestDetailPageModule)
      },
      {
        path: 'vto-request-detail',
        loadChildren: () => import('../pages/vto-request-detail/vto-request-detail.module').then( m => m.VtoRequestDetailPageModule)
      },
      {
        path: 'callin-request-detail',
        loadChildren: () => import('../pages/callin-request-detail/callin-request-detail.module').then( m => m.CallinRequestDetailPageModule)
      },
      {
        path: 'earlygo-request-detail',
        loadChildren: () => import('../pages/earlygo-request-detail/earlygo-request-detail.module').then( m => m.EarlygoRequestDetailPageModule)
      },
      {
        path: 'flexwork-request-detail',
        loadChildren: () => import('../pages/flexwork-request-detail/flexwork-request-detail.module').then( m => m.FlexworkRequestDetailPageModule)
      },
      {
        path: 'timeoff-request-detail',
        loadChildren: () => import('../pages/timeoff-request-detail/timeoff-request-detail.module').then( m => m.TimeoffRequestDetailPageModule)
      },
      {
        path: 'timeoff-bank',
        loadChildren: () => import('../pages/time-off-bank-page/time-off-bank-page.module').then( m => m.TimeOffBankPagePageModule)
      },
      {
        path: 'time-off-bank-calendar',
        loadChildren: () => import('../pages/time-off-bank-calendar/time-off-bank-calendar.module').then( m => m.TimeOffBankCalendarPageModule)
      },
      {
        path: 'add-edit-call-in-request',
        loadChildren: () => import('../pages/add-edit-call-in-request/add-edit-call-in-request.module').then(m => m.AddEditCallInRequestPageModule)
      },
      {
        path: 'add-edit-early-go-request',
        loadChildren: () => import('../pages/add-edit-early-go-request/add-edit-early-go-request.module').then(m => m.AddEditEarlyGoRequestPageModule)
      },
      {
        path: 'add-timeoff-request',
        loadChildren: () => import('../pages/add-timeoff-request/add-timeoff-request.module').then( m => m.AddTimeoffRequestPageModule)
      },
      {
        path: 'add-swap-request',
        loadChildren: () => import('../pages/add-request-swap/add-request-swap.module').then( m => m.AddRequestSwapPageModule)
      },
      {
        path: 'add-vot-request',
        loadChildren: () => import('../pages/add-vot-request/add-vot-request.module').then( m => m.AddVotRequestPageModule)
      },
      {
        path: 'add-vto-request',
        loadChildren: () => import('../pages/add-vto-request/add-vto-request.module').then(m => m.AddVtoRequestPageModule)
      },
      {
        path: 'add-vot-request',
        loadChildren: () => import('../pages/add-vot-request/add-vot-request.module').then(m => m.AddVotRequestPageModule)
      },
      {
        path: 'clock-in-out',
        loadChildren: () => import('../pages/clock-in-out/clock-in-out.module').then( m => m.ClockInOutPageModule)
      },
      
      {
        path: 'clock-in-out-request',
        loadChildren: () => import('../pages/clock-in-out-request/clock-in-out-request.module').then( m => m.ClockInOutRequestPageModule)
      },
    
      // {
      //   path: 'late-in-request',
      //   loadChildren: () => import('../pages/late-in-request/late-in-request.module').then( m => m.LateInRequestPageModule)
      // },
      {
        path: 'add-edit-late-in-request',
        loadChildren: () => import('../pages/add-edit-late-in-request/add-edit-late-in-request.module').then( m => m.AddEditLateInRequestPageModule)
      },
      {
        path: 'latein-request-detail',
        loadChildren: () => import('../pages/latein-request-detail/latein-request-detail.module').then( m => m.LateinRequestDetailPageModule)
      },
      {
        path: 'clock-in-out-filter',
        loadChildren: () => import('../pages/clock-in-out-filter/clock-in-out-filter.module').then( m => m.ClockInOutFilterPageModule)
      },
      {
        path: 'announcement',
        component: AnnoucementComponent,
      },
      {
        path: 'add-time-punch',
        loadChildren: () => import('../pages/add-time-punch/add-time-punch.module').then( m => m.AddTimePunchPageModule)
      },
      {
        path: 'edited-time-punch',
        loadChildren: () => import('../pages/edited-time-punch/edited-time-punch.module').then( m => m.EditedTimePunchPageModule)
      },
      {
        path: 'time-punch-detail',
        loadChildren: () => import('../pages/time-punch-detail/time-punch-detail.module').then( m => m.TimePunchDetailPageModule)
      },
      {
        path: 'clock-in-out-detail',
        loadChildren: () => import('../pages/clock-in-out-detail/clock-in-out-detail.module').then( m => m.ClockInOutDetailPageModule)
      },
      {
        path: 'user-work-hours',
        loadChildren: () => import('../pages/user-work-hours/user-work-hours.module').then( m => m.UserWorkHoursPageModule)
      },
      {
        path: 'feedback-request',
        loadChildren: () => import('../pages/feedback-request/feedback-request.module').then( m => m.FeedbackRequestPageModule)
      },
    ]
  },
  {
    path: '',
    loadChildren: () => import('../my-requests/my-requests.module').then(m => m.MyRequestsPageModule), 
    data: { role: [Role.user] },
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => {return PendingRequestsPageModule},
    data: { role: [Role.hrAdmin] },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
