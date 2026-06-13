import axios from 'axios'

class AuthService{
    async signup({username , email , password}){
        const res = await axios.post("http://localhost:8080/signup" , {username , email , password} , {withCredentials : true});
        return res.data
    }   
        async login({username , password}){
        const res = await axios.post("http://localhost:8080/login" , {username , password} , {withCredentials : true});
        return res.data;
    }
     async getCurrrentUser(){
        const res = await axios.get("http://localhost:8080/profile" ,{withCredentials : true});
        return res.data;
    }
    async logout(){
          const res = await axios.post("http://localhost:8080/logout" , {} , {withCredentials : true});
          return res.data;  
    }
    async generateId(){
        const res = await axios.get("http://localhost:8080/generateId");
       return res.data;
    }
}

const authService = new AuthService();
export default authService;