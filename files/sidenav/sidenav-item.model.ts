export interface SidenavItem {
    label?: string;
    icon?: string;
    path?: string;
    items?: SidenavSubmenu1[];
}
export interface SidenavSubmenu1 {
    label?: string;
    icon?: string;
    path?: string;
    items?: SidenavSubmenu2[];
}
export interface SidenavSubmenu2 {
    label?: string;
    icon?: string;
    path?: string;
    items?: SidenavSubmenu3[];
}
export interface SidenavSubmenu3 {
    label?: string;
    icon?: string;
    path?: string;
    items?: SidenavSubmenu4[];
}
export interface SidenavSubmenu4 {
    label?: string;
    icon?: string;
    path?: string;
    items?: SidenavSubmenu5[];
}
export interface SidenavSubmenu5 {
    label?: string;
    icon?: string;
    path?: string;
}
