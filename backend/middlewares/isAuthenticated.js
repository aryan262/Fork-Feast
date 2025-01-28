import jwt from "jsonwebtoken";
export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        // verify the toekn
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        // check is decoding was successfull
        if (!decode) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}