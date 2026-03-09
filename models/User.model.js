import Mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false,
    },
    avatar: {
        url: {
            type: String,
            trim: true,
        },
        public_id: {
            type: String,
            trim: true,
        },
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    deletedAt: {
        type: Date,
        default: null,
        index: true,
    },
}, { timestamps: true });

// userSchema.pre("save", async function () {
//     console.log(this.password)
//     if (!this.isModified("password")) {
//         return;
//     }
//     this.password = await bcrypt.hash(this.password, 10);
    
// });

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = Mongoose.models.User || Mongoose.model("User", userSchema, "users");

export default User;