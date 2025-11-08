import mongoose from "mongoose";
import bcrypt from 'bcrypt';

// userschema is the main schema where user datails managed
const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        // storing the refresh token so when acceas token expires it can be generated again
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

// pre hook runs to hash password on change of password
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
})

// this fucntion will check for passsword correctness while user loging in with hashed one
userSchema.method.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// fucntion togenerate acceas token
userSchema.methods.generateAcceasToken = async function () {
    return await jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOCKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOCKEN_EXPIRY
        }
    )
}

// fucntion to generate refreshtoken
userSchema.methods.generateRefreshToken = async function () {
    return await jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOCKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOCKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);