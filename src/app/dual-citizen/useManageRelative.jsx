import { useEffect, useState } from "react";
import Relative from "./Relative";


const useManageRelative = (action) => {
    const [relative, setRelative] = useState(new Relative())

    const addParent = () => {
        setRelative(prev => (prev.addParent()))
    }

    const addDependent = () => {

    }


    return {relative, addParent, addDependent}
    // return document
}

export default useManageRelative