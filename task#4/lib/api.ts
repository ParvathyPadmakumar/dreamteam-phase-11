const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export async function apicall(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: object,
    token?: string){
        const headers:Record<string,string> = {
            "Content-Type":"application/json",
        };
        if(token){
            headers["Authorization"]=`Bearer ${token}`;
        }
        const options:RequestInit = {
            method,
            headers,
        };
        if(body){
            options.body=JSON.stringify(body);
        }
        const response = await fetch(`${url}/${endpoint}`,options);
        const raw = await response.text();
        let data:any={};
        if (raw) {
            try {
                data = JSON.parse(raw);
            } catch {
                throw new Error(`Invalid JSON response from ${endpoint} (status ${response.status}). Check API URL and backend route.`);
            }
        }

        if(!response.ok){
            throw new Error(data.error || data.message || "API call failed");
        }
        return data;
    }


export async function login(email: string, password: string) {
    return apicall("api/auth/login","POST",{email,password});
}
export async function register(email: string, password: string) {
    return apicall("api/auth/register","POST",{email,password});
}
export async function getEvents(token: string) {
    return apicall("api/events","GET",undefined,token);
}
export async function createEvent(name: string, token: string) {
    return apicall("api/events","POST",{name},token);
}
export async function updateEvent(id: number, completedDates:string[], token:string) {
    return apicall(`api/events/${id}`,"PUT",{completedDates},token);
}
export async function deleteevent(id:number,token:string){
    return apicall(`api/events/${id}`,"DELETE",undefined,token);
}