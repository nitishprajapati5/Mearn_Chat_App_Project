import {create} from 'zustand'
import {persist} from 'zustand/middleware'
const useStore = create()(
    persist(
        (set) => ({
            authtoken:"",
            setauthToken:(token) => set({authtoken:token}),
            removeToken:() => set({authtoken:""})
        }),
        {
            name:'auth-storage'
        }
    )
)

export default useStore