import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail.js";
import { client, sender } from "./mailTrap.js";
export const sendVerificationEmail = async(email, verificationToken)=>{
    const recipient = [{email}];
    try {
        const res = await client.send({
            from:sender,
            to: recipient,
            subject:"Verify Your Email",
            html:htmlContent.replace("{verificationToken}", verificationToken),
            category:'Email Verification'
        })
    } catch (error) {
        console.log(error);
        throw new Error('Error sending verification email');
    }
}
export const sendWelcomeEmail = async(email, name)=>{
    const recipient = [{email}];
    const htmlContent = generateWelcomeEmailHtml(name)
    try {
        const res = await client.send({
            from:sender,
            to: recipient,
            subject:"Welcome to Fork&Feast",
            html:htmlContent,
            template_variables:{
                comapay_info_name:"Fork&Feast",
                name:name
            }
        })
    } catch (error) {
        console.log(error);
        throw new Error('Failed to send welcome email');
    }
}
export const sendPasswordResetEmail = async(email, resetUrl)=>{
    const recipient = [{email}];
    const htmlContent = generatePasswordResetEmailHtml(resetUrl)
    try {
        const res = await client.send({
            from:sender,
            to: recipient,
            subject:"Reset Your Password",
            html:htmlContent,
            category:"Reset Password"
        })
    } catch (error) {
        console.log(error);
        throw new Error('Failed to send reset password email');
    }
}
export const sendResetSuccessEmail = async(email)=>{
    const recipient = [{email}];
    const htmlContent = generateResetSuccessEmailHtml();
    try {
        const res = await client.send({
            from:sender,
            to: recipient,
            subject:"Password Reset Successful",
            html:htmlContent,
            category:"Password Reset"
        })
    } catch (error) {
        console.log(error);
        throw new Error('Failed to send passsword reset success email');
    }
}