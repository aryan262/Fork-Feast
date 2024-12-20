import { z } from "zod";
export const userSignupSchema = z.object({
    fullName:z.string().min(1, "Full Name is required"),
    email:z.string().email("Invalid Email Address"),
    password:z.string().min(6, "Password must be atleast 6 characters"),
    contact:z.string().min(10, "Contact Number is Invalid")
})
export const userLoginSchema = z.object({
    email:z.string().email("Invalid Email Address"),
    password:z.string().min(6, "Password must be atleast 6 characters"),
})