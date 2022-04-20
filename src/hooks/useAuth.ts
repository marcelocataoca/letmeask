import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

//Importamos duas func e transformamos em uma única
export function useAuth(){
    const value = useContext(AuthContext)
    return value
}

