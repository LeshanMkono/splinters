import { Resend } from 'resend'

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
  return _resend
}

const FROM = 'Splinters Basketball <hello@splinters.co.ke>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://splinters.co.ke'
const PAYBILL = process.env.NEXT_PUBLIC_MPESA_PAYBILL || '880100'
const ACCOUNT = process.env.NEXT_PUBLIC_MPESA_ACCOUNT || 'payslinters25'
const FEE = process.env.NEXT_PUBLIC_MEMBERSHIP_FEE || '2000'
const WHATSAPP_LINK = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_LINK || ''

// ─────────────────────────────────────────────────────────────────────────────
// SHARED HTML HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function emailWrapper(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#F5F5F5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:#1B2B6B;padding:28px 32px;text-align:center;">
            <span style="font-family:Georgia,serif;font-size:28px;font-weight:bold;color:#FFFFFF;letter-spacing:4px;">SPLINTERS</span>
            <span style="display:block;color:#F4622A;font-size:11px;letter-spacing:3px;margin-top:4px;">BASKETBALL · NAIROBI</span>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:32px;">${body}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#F5F5F5;padding:20px 32px;text-align:center;border-top:1px solid #E5E7EB;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;">Splinters Basketball · Nairobi, Kenya</p>
            <p style="margin:4px 0 0;font-size:11px;color:#D1D5DB;">
              <a href="${APP_URL}" style="color:#F4622A;text-decoration:none;">splinters.co.ke</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function h1(text: string): string {
  return `<h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:28px;color:#1B2B6B;letter-spacing:1px;">${text}</h1>`
}

function p(text: string, style = ''): string {
  return `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#555555;${style}">${text}</p>`
}

function btn(text: string, href: string, color = '#F4622A'): string {
  return `<a href="${href}" style="display:inline-block;background:${color};color:#FFFFFF;padding:13px 28px;border-radius:6px;font-weight:bold;font-size:15px;text-decoration:none;letter-spacing:0.5px;">${text}</a>`
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid #E5E7EB;margin:24px 0;" />`
}

function infoBox(rows: [string, string][]): string {
  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:10px 14px;font-size:13px;color:#6B7280;width:40%;border-bottom:1px solid #F3F4F6;">${label}</td>
          <td style="padding:10px 14px;font-size:14px;font-weight:600;color:#1B2B6B;border-bottom:1px solid #F3F4F6;">${value}</td>
        </tr>`
    )
    .join('')
  return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;border-radius:8px;border:1px solid #E5E7EB;margin:16px 0;">${rowsHtml}</table>`
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. WELCOME EMAIL — sent after registration
// ─────────────────────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const body = `
    ${h1('Welcome to Splinters! 🏀')}
    ${p(`Hi ${name || 'there'},`)}
    ${p("You've created your Splinters Basketball account. You're one step away from joining Nairobi's most active basketball community.")}
    ${divider()}
    <h3 style="margin:0 0 12px;font-size:16px;color:#1B2B6B;">Activate your membership</h3>
    ${p('Pay the annual membership fee via M-Pesa:')}
    ${infoBox([
      ['Paybill Number', PAYBILL],
      ['Account Number', ACCOUNT],
      ['Amount', `KES ${FEE}`],
    ])}
    ${p('Once you\'ve paid, upload your M-Pesa screenshot from your dashboard and we\'ll confirm within 24 hours.', 'font-size:13px;color:#6B7280;')}
    <div style="margin:24px 0;">
      ${btn('Go to Dashboard →', `${APP_URL}/dashboard`)}
    </div>
    ${divider()}
    ${p('See you on the court!', 'color:#9CA3AF;font-size:13px;')}
    ${p('<strong style="color:#1B2B6B;">The Splinters Team</strong>', 'font-size:13px;')}
  `
  await getResend().emails.send({
    from: FROM,
    to,
    subject: 'Welcome to Splinters Basketball 🏀',
    html: emailWrapper('Welcome to Splinters', body),
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. PAYMENT CONFIRMED — membership activated
// ─────────────────────────────────────────────────────────────────────────────

export async function sendPaymentConfirmedEmail(
  to: string,
  name: string,
  mpesaRef: string,
  month: string
): Promise<void> {
  const body = `
    ${h1('Payment Confirmed ✅')}
    ${p(`Hi ${name || 'there'},`)}
    ${p('Your Splinters Basketball membership has been activated! You now have full access to weekend polls, court directions, and the community.')}
    ${infoBox([
      ['M-Pesa Reference', mpesaRef],
      ['Month', month],
      ['Status', '✅ Active'],
    ])}
    ${divider()}
    <h3 style="margin:0 0 12px;font-size:16px;color:#1B2B6B;">Join the WhatsApp Group</h3>
    ${p("Get real-time updates on game times, venue changes, and community announcements:")}
    <div style="margin:16px 0 24px;">
      ${btn('Join WhatsApp Group →', WHATSAPP_LINK, '#25D366')}
    </div>
    ${divider()}
    ${p('See you on the court this weekend! 🏀', 'font-size:13px;color:#6B7280;')}
    ${p('<strong style="color:#1B2B6B;">The Splinters Team</strong>', 'font-size:13px;')}
  `
  await getResend().emails.send({
    from: FROM,
    to,
    subject: '✅ Your Splinters membership is active!',
    html: emailWrapper('Payment Confirmed', body),
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PAYMENT REMINDER — sent on the 28th of each month
// ─────────────────────────────────────────────────────────────────────────────

export async function sendPaymentReminderEmail(
  to: string,
  name: string,
  daysLeft: number
): Promise<void> {
  const urgency = daysLeft <= 3
    ? `<div style="background:#FEF3C7;border:1px solid #FCD34D;border-radius:8px;padding:14px 16px;margin:16px 0;">
        <strong style="color:#B45309;">⚠️ ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left</strong> — renew now to avoid losing access.
      </div>`
    : ''

  const body = `
    ${h1('Membership Renewal Reminder')}
    ${p(`Hi ${name || 'there'},`)}
    ${p(`Your Splinters Basketball membership for this month is due for renewal. Don't miss out on weekend games!`)}
    ${urgency}
    ${infoBox([
      ['Paybill Number', PAYBILL],
      ['Account Number', ACCOUNT],
      ['Amount', `KES ${FEE}`],
    ])}
    ${p('After paying, upload your M-Pesa screenshot from your dashboard:', 'font-size:13px;color:#6B7280;')}
    <div style="margin:20px 0;">
      ${btn('Renew Membership →', `${APP_URL}/auth/payment`)}
    </div>
    ${divider()}
    ${p('Questions? Reply to this email or message us on WhatsApp.', 'font-size:13px;color:#9CA3AF;')}
  `
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `🏀 Your Splinters membership renewal is due`,
    html: emailWrapper('Membership Renewal', body),
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. POLL LIVE — Saturday morning, links to both SAT + SUN polls
// ─────────────────────────────────────────────────────────────────────────────

export async function sendPollLiveEmail(
  to: string,
  name: string,
  satWeekId: string,
  sunWeekId: string,
  satVenue: string,
  sunVenue: string,
  satTime: string,
  sunTime: string
): Promise<void> {
  const body = `
    ${h1("This Weekend's Polls Are Live! 🏀")}
    ${p(`Hi ${name || 'there'}, the weekend is almost here. Vote now to let the crew know you're in.`)}
    ${divider()}
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="48%" style="background:#1B2B6B;border-radius:10px;padding:20px;text-align:center;vertical-align:top;">
          <div style="color:#F4622A;font-size:11px;letter-spacing:2px;margin-bottom:8px;">SATURDAY</div>
          <div style="color:#FFFFFF;font-size:18px;font-weight:bold;margin-bottom:6px;">${satTime}</div>
          <div style="color:#94A3B8;font-size:13px;margin-bottom:16px;">${satVenue}</div>
          <a href="${APP_URL}/poll/${satWeekId}" style="background:#F4622A;color:#FFFFFF;padding:10px 20px;border-radius:6px;font-size:13px;font-weight:bold;text-decoration:none;display:inline-block;">Vote Saturday →</a>
        </td>
        <td width="4%"></td>
        <td width="48%" style="background:#1B2B6B;border-radius:10px;padding:20px;text-align:center;vertical-align:top;">
          <div style="color:#F4622A;font-size:11px;letter-spacing:2px;margin-bottom:8px;">SUNDAY</div>
          <div style="color:#FFFFFF;font-size:18px;font-weight:bold;margin-bottom:6px;">${sunTime}</div>
          <div style="color:#94A3B8;font-size:13px;margin-bottom:16px;">${sunVenue}</div>
          <a href="${APP_URL}/poll/${sunWeekId}" style="background:#F4622A;color:#FFFFFF;padding:10px 20px;border-radius:6px;font-size:13px;font-weight:bold;text-decoration:none;display:inline-block;">Vote Sunday →</a>
        </td>
      </tr>
    </table>
    ${divider()}
    ${p('See you on the court! 🏀', 'font-size:13px;color:#6B7280;')}
  `
  await getResend().emails.send({
    from: FROM,
    to,
    subject: `🏀 Weekend polls are live — vote now!`,
    html: emailWrapper('Weekend Poll', body),
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ACCOUNT SUSPENDED — membership lapsed
// ─────────────────────────────────────────────────────────────────────────────

export async function sendAccountSuspendedEmail(
  to: string,
  name: string
): Promise<void> {
  const body = `
    ${h1('Membership Lapsed')}
    ${p(`Hi ${name || 'there'},`)}
    ${p("Your Splinters Basketball membership has lapsed due to non-payment. Your account access has been suspended.")}
    ${p("You can reactivate immediately by renewing your membership:")}
    ${infoBox([
      ['Paybill Number', PAYBILL],
      ['Account Number', ACCOUNT],
      ['Amount', `KES ${FEE}`],
    ])}
    <div style="margin:20px 0;">
      ${btn('Reactivate Membership →', `${APP_URL}/auth/payment`)}
    </div>
    ${divider()}
    ${p("Once your payment is confirmed, your account will be fully restored within 24 hours.", 'font-size:13px;color:#6B7280;')}
    ${p('<strong style="color:#1B2B6B;">The Splinters Team</strong>', 'font-size:13px;')}
  `
  await getResend().emails.send({
    from: FROM,
    to,
    subject: 'Your Splinters membership has lapsed',
    html: emailWrapper('Membership Lapsed', body),
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. SECURITY ALERT — brute force / honeypot
// ─────────────────────────────────────────────────────────────────────────────

export async function sendSecurityAlertEmail(opts: {
  alertType: 'brute_force' | 'honeypot' | 'rate_limit'
  ipHash: string
  detail: string
  timestamp: string
  metadata?: Record<string, unknown>
}): Promise<void> {
  const adminEmail = process.env.ADMIN_SECURITY_EMAIL || 'mkonodigital@gmail.com'
  const typeLabel = {
    brute_force: '🔴 Brute Force Attack',
    honeypot: '🟡 Honeypot Triggered',
    rate_limit: '🟠 Rate Limit Exceeded',
  }[opts.alertType]

  const rows: [string, string][] = [
    ['Alert Type', typeLabel],
    ['IP Hash', opts.ipHash],
    ['Detail', opts.detail],
    ['Timestamp', opts.timestamp],
  ]

  if (opts.metadata) {
    for (const [key, val] of Object.entries(opts.metadata)) {
      rows.push([key, String(val)])
    }
  }

  const body = `
    ${h1(`Security Alert: ${typeLabel}`)}
    ${p('An automated security event has been detected on <strong>splinters.co.ke</strong>.')}
    ${infoBox(rows)}
    ${divider()}
    <div style="margin:16px 0;">
      ${btn('View SOC Monitor →', `${APP_URL}/admin`)}
    </div>
    ${p('This is an automated alert. Do not reply to this email.', 'font-size:12px;color:#9CA3AF;')}
  `
  await getResend().emails.send({
    from: FROM,
    to: adminEmail,
    subject: `[ALERT] ${typeLabel} — splinters.co.ke`,
    html: emailWrapper('Security Alert', body),
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PAYMENT REJECTED — notification to member
// ─────────────────────────────────────────────────────────────────────────────

export async function sendPaymentRejectedEmail(
  to: string,
  name: string,
  reason?: string
): Promise<void> {
  const body = `
    ${h1('Payment Not Confirmed')}
    ${p(`Hi ${name || 'there'},`)}
    ${p("Unfortunately, we couldn't confirm your recent M-Pesa payment.")}
    ${reason ? `<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:14px 16px;margin:16px 0;color:#991B1B;font-size:14px;">${reason}</div>` : ''}
    ${p("Common reasons:")}
    <ul style="color:#555555;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 16px;">
      <li>Wrong paybill or account number</li>
      <li>Screenshot unclear or cropped</li>
      <li>Transaction already used for another month</li>
    </ul>
    ${infoBox([
      ['Paybill Number', PAYBILL],
      ['Account Number', ACCOUNT],
      ['Amount', `KES ${FEE}`],
    ])}
    <div style="margin:20px 0;">
      ${btn('Resubmit Payment →', `${APP_URL}/auth/payment`)}
    </div>
    ${p('If you believe this is an error, reply to this email with your M-Pesa confirmation SMS.', 'font-size:13px;color:#6B7280;')}
  `
  await getResend().emails.send({
    from: FROM,
    to,
    subject: 'Action needed: Splinters payment not confirmed',
    html: emailWrapper('Payment Not Confirmed', body),
  })
}
