export interface MenuItem {
    id: string;
    text: string;
    icon: string;
    route: string;
    active: boolean;
    roles: string[];
    type: string;
    groupBy?: string;
    function?: () => {};
    submenu: Array<MenuItem>;
}

