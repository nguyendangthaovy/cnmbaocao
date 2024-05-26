import axios from './apiConfig';
export const apiRegister = {
    register: async({name,username,password}) => {
        return await axios.post('auth/registry',{name,username,password});
       
    },
    resetOtp: async({username})=>{
        return await axios.post('auth/reset-otp',{username});

    },
    confirm: async({username,otp})=>{
        return await axios.post('auth/confirm',{username,otp});
    },
}
