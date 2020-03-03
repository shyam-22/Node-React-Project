exports.userSignupValidator = (req,res,next) => {

    req.check('name', 'name is required').notEmpty();

    req.check('email', "Email must be between 8 to 32 characters")
        .matches(/.+\@.+\../)
        .withMessage("Email must be contain @")
        .isLength({min:8,max:32});

    req.check('password', "password is requires").notEmpty()
        .matches(/\d/)
        .withMessage("password at least one number")
        .isLength({min:7,max:32})
        .withMessage("password at least contain 7 characters");

        const errors = req.validationErrors();
        if(errors)
        {
            const firstError = errors.map(error => error.msg)[0];
            return res.status(400).json({error:firstError});
        }

        next();
};