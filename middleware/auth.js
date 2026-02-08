import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  try {
    // ✅ Get token from Authorization header OR cookies
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies?.token;

    // ❌ No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token not found!",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user payload to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    // ✅ Token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again!",
      });
    }

    // ✅ Invalid token
    return res.status(401).json({
      success: false,
      message: "Invalid token!",
    });
  }
};

export default userAuth;
