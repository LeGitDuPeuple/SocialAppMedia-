const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       const userId = decodedToken.userId;
       const userRole = decodedToken.userRole;
      req.auth = {
        // permet de rajouter l'id dans le token (req.auth.userId)
      userId: userId,
    //   permet de rajouter le role dans le token (req.auth.role)
      role: userRole  
    };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};