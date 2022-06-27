export interface Intercept {
    in?(...args: any[]): any[];
    out?(...args: any[]): any[];
}
