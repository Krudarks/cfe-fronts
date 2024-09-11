import { Injectable } from '@angular/core';
import { Utils } from '../utils/Utils';
import { ADMIN, TEST, WORKER } from '../constants/Roles.constants';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    public storeToken(token: string): void {
        sessionStorage.setItem('token', token);
    }

    public getToken(): string | null {
        return sessionStorage.getItem('token');
    }

    public setSessionStorage(key: string, data: any): void {
        sessionStorage.setItem(key, JSON.stringify(data));
    }

    public getSessionStorage(key: string): any {
        let systemData: any = sessionStorage.getItem(key);
        return ( !Utils.isNullOrUndefined(systemData) ) ? JSON.parse(systemData):null;
    }

    public getSystem(): any[] | null {
        let systemData: any = sessionStorage.getItem('systemData');
        return ( !Utils.isNullOrUndefined(systemData) ) ? JSON.parse(systemData):null;
    }

    public get getUserData() {
        let userData: any = sessionStorage.getItem('user');

        return ( !Utils.isNullOrUndefined(userData) ) ? JSON.parse(userData):null;
    }

    get isAdmin(): boolean {
        return this.getUserData.role.code === ADMIN;
    }

    get isTest(): boolean {
        return this.getUserData.role.code === TEST;
    }

    get isWorker(): boolean {
        return this.getUserData.role.code === WORKER;
    }

    public clearSessionStorage(): void {
        sessionStorage.clear();
    }

    public get currentInstance(): string | null {
        return sessionStorage.getItem('instanceName');
    }

    public getAvatarInitials(string: string): string {
        let names = string.split(' '),
                initials = names[0].substring(0, 1).toUpperCase();

        if (names.length > 2) {
            initials += ' ' + names[names.length - 2].substring(0, 1).toUpperCase();
        } else {
            if (names.length > 1) {
                initials += ' ' + names[names.length - 1].substring(0, 1).toUpperCase();
            }
        }

        return initials;
    }
}
