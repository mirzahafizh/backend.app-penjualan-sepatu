const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    // If token is not provided, return 401 Unauthorized
    if (token == null) return res.status(401).json({ message: "Token required" });
    
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        
        // If token is valid, save user info to request object for use in other routes
        req.user = user;
        next();
    });
};

// Export the middleware function directly
module.exports = authenticateToken;
