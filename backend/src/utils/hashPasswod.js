import bcrypt from "bcrypt";

class HashPassword {
    static async hashPassword(password) { // Removed arrow function
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}

export default HashPassword; // Export the class directly
