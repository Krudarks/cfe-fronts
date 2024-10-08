import { Routes } from '@angular/router';
import { loggedGuard } from './_core/guards/logged.guard';
import { authGuard } from './_core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    {
        canActivate: [ loggedGuard ], path: 'auth', children: [
            {
                path: '',
                loadComponent: () => import('./auth/login/login.component')
                .then(m => m.LoginComponent)
            },
            {
                path: 'forgot-password',
                loadComponent: () => import('./auth/forgot-password/forgot-password.component')
                .then(m => m.ForgotPasswordComponent)
            },
            {
                path: 'reset-password/:token/:email',
                loadComponent: () => import('./auth/reset-password/reset-password.component')
                .then(m => m.ResetPasswordComponent)
            },
        ]
    },

    {
        path: 'layout', canActivate: [ authGuard ],
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./pages/layout/layout.component')
                .then(m => m.LayoutComponent),
            },
            {
                path: 'users',
                loadComponent: () => import('./pages/users/users.component')
                .then(m => m.UsersComponent)
            },
            {
                path: 'vehicles',
                loadComponent: () => import('./pages/vehicles/vehicles.component')
                .then(m => m.VehiclesComponent)
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/general-information/general-information.component')
                .then(m => m.GeneralInformationComponent),
            },
            {
                path: 'attendance-worker',
                loadComponent: () => import('./pages/attendances/attendances.component')
                .then(m => m.AttendancesComponent),
            },
            {
                path: 'attendance-car',
                loadComponent: () => import('./pages/attendance-vehicles/attendance-vehicles.component')
                .then(m => m.AttendanceVehiclesComponent),
            },

            {
                path: 'attendance/:id',
                loadComponent: () => import('./pages/attendances/detail-attendance/detail-attendance.component')
                .then(m => m.DetailAttendanceComponent),
            },
        ],
    },

    {
        path: 'attendance-day',
        loadComponent: () => import('./pages/attendances/action-attendance/action-attendance.component')
        .then(m => m.ActionAttendanceComponent),
    },

    {
        path: '**', loadComponent: () => import('./_view/not-found/not-found.component').then(m => m.NotFoundComponent)
    },
];
