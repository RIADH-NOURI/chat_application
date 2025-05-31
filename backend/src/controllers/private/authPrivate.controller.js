



export const logout = async(req, res)=>{
    try {
         res.clearCookie("token");
        res.json({message:"Logged out successfully"});
    } catch (error) {
        res.status(500).json({message:"Something went wrong"});
    }
}
export const checkAuth = async(req, res)=>{
    try {
        const user = req.user;
        res.json(user);
    } catch (error) {
        res.status(500).json({message:"Something went wrong", error: error.message});
    }
}
  