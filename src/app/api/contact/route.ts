import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
})

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const data = ContactSchema.parse(json)

    // TODO: integrate with Resend/Formspree/Nodemailer
    console.log("Contact message:", data)

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    let msg = "Invalid payload"
    if (err instanceof z.ZodError) {
      msg = err.issues?.[0]?.message ?? msg
    } else if (err instanceof Error) {
      msg = err.message
    }
    return NextResponse.json({ ok: false, message: msg }, { status: 400 })
  }
}
