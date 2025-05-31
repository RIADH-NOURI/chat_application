

export const checkPersonalUser = (req,id)=>{
    if(req.user.id === id) return true;
    return false;
}