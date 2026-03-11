export function savetoken(token:string){
    localStorage.setItem("authtoken",token);
}
export function gettoken():string|null{
    return localStorage.getItem("authtoken");
}
export function removetoken(){
    localStorage.removeItem("authtoken");
}
export function isAuthenticated():boolean{
    return !!gettoken();
}