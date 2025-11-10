import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// userschema is the main schema where user datails managed
const vendorSchema = new mongoose.Schema(
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
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ],
        orders:[
             {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Order"
            }
        ]
    },
    {
        timestamps: true
    }
)

// pre hook runs to hash password on change of password
vendorSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
    }
    next();
})

// this fucntion will check for passsword correctness while user loging in with hashed one
vendorSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// fucntion togenerate acceas token
vendorSchema.methods.generateAcceasToken = async function () {
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
vendorSchema.methods.generateRefreshToken = async function () {
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

export const Vendor = mongoose.model("Vendor", vendorSchema);