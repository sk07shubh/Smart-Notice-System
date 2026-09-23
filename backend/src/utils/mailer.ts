import nodemailer from "nodemailer";
import prisma from "../config/db";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendNoticeNotification(notice: any) {
  try {
    const subscribers = await prisma.subscriber.findMany({ select: { email: true } });
    if (subscribers.length === 0) return;

    const bccList = subscribers.map((sub: { email: string }) => sub.email).join(",");
    const appUrl = process.env.APP_URL || "http://localhost:5173";
    const noticeUrl = `${appUrl}/#/notice/${notice.id}`;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #00275a;">New Notice: ${notice.title}</h2>
        <p><strong>Category:</strong> ${notice.category?.name || "General"}</p>
        <p>${notice.description}</p>
        <br />
        <a href="${noticeUrl}" style="display: inline-block; padding: 10px 15px; background-color: #003c84; color: #fff; text-decoration: none; border-radius: 5px;">View Notice</a>
      </div>
    `;

    await transporter.sendMail({
      from: `"ICEM Notice Portal" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Required 'to' field, using sender's email
      bcc: bccList,
      subject: `New Notice: ${notice.title}`,
      html,
    });
    console.log(`Successfully sent email notification to ${subscribers.length} subscribers.`);
  } catch (error) {
    console.error("Failed to send notice notification emails:", error);
  }
}
