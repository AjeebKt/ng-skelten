import { SUB_ADMIN, UVT_ADMIN } from './../../app.constants';
import { ConfirmModalService } from './../confirm-modal/confirm-modal.service';
import { MenuItem } from 'src/app/model/menu-item';
import { SUPER_USER } from 'src/app/app.constants';
import { Router } from '@angular/router';
import { GlobalDataService } from '../services/global-data.service';
import { NavigationService } from './navigation.service';

export interface INavigation {
    menus: Array<MenuItem>;
}
export class NavigationModel implements INavigation {
    menus: Array<MenuItem>;
    constructor(private router: Router,
        private confirmDialogService: ConfirmModalService,
        private globalDataService: GlobalDataService,
        private navbarService: NavigationService,
    ) {
        this.menus = [
            // {
            //     id: 'home',
            //     text: 'Home',
            //     icon: 'assets/images/home.svg',
            //     route: '',
            //     type: 'collapse',
            //     active: false,
            //     roles: [...SUB_OP_ROLES, ],
            //     submenu: null,
            //     function: () => {
            //         this.router.navigate(['/app/home']);

            //         return {};
            //     }
            // },
            {
                id: 'dashboard',
                text: 'Dashboard',
                icon: 'assets/images/management.svg',
                route: null,
                active: false,
                roles: [...SUPER_USER, ...SUB_ADMIN],
                type: 'collapse',
                submenu: [
                    {
                        id: 'user-management',
                        text: 'User',
                        icon: 'assets/images/man-user.svg',
                        route: 'dashboard/user-management',
                        type: 'item',
                        active: false,
                        groupBy: 'dashboard',
                        roles: [...SUPER_USER, ...SUB_ADMIN],
                        submenu: null
                    },
                    {
                        id: 'group-management',
                        text: 'Group',
                        icon: 'assets/images/group management.svg',
                        route: 'dashboard/group-management',
                        type: 'item',
                        active: false,
                        groupBy: 'dashboard',
                        roles: [...SUPER_USER, ...SUB_ADMIN],
                        submenu: null
                    },
                    {
                        id: 'admin-management',
                        text: 'Admin',
                        icon: 'assets/images/admin management.svg',
                        route: 'dashboard/admin-management',
                        type: 'item',
                        active: false,
                        groupBy: 'dashboard',
                        roles: [...SUPER_USER],
                        submenu: null
                    },

                ]
            },
            {
                id: 'accounts',
                text: 'My account',
                icon: 'assets/images/account.svg',
                route: 'accounts',
                type: 'collapse',
                active: false,
                roles: [...SUPER_USER, ...SUB_ADMIN],
                submenu: null,
            },
            {
                id: 'package',
                text: 'My package',
                icon: 'assets/images/bill.svg',
                route: 'package',
                type: 'collapse',
                active: false,
                roles: [...SUPER_USER, ...SUB_ADMIN],
                submenu: null,
            },
            {
                id: 'config',
                text: 'Configuration',
                icon: 'assets/images/bill.svg',
                route: 'configuration',
                type: 'collapse',
                active: false,
                roles: [...UVT_ADMIN],
                submenu: null,
                function: () => {
                    this.router.navigate(['configuration']);
                    return {};
                }
            },
            {
                id: 'logout',
                text: 'Logout',
                icon: 'assets/images/logout.svg',
                route: null,
                type: 'collapse',
                active: false,
                roles: [...SUPER_USER, ...SUB_ADMIN, ...UVT_ADMIN],
                submenu: null,
                function: () => {
                    const dialogOpts = { title: 'Confirm Dialog', message: 'Are you sure you want to logout ?' };
                    this.confirmDialogService.openDialogModal(dialogOpts)
                        .subscribe(res => {
                            if (res) {
                                const requestBody = JSON.stringify({
                                    username: this.globalDataService.currentUser.username
                                });
                                this.navbarService.logout(requestBody)
                                    .subscribe(result => {
                                        if (result.projectStatusCode === 'S1026') {
                                            this.globalDataService.currentUser.token = '';
                                            sessionStorage.clear();
                                            this.globalDataService.reset();
                                            this.router.navigate(['/login']);
                                        } else {
                                        }
                                    });
                            }
                        });
                    return {};
                },
            },
        ];
    }
}
