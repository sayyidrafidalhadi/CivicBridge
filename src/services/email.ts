import { emailJsonUrl, isEmailJsonConfigured } from '../lib/supabase'

interface EmailPayload {
  to: string
  subject: string
  body: string
}

export async function sendEmail(payload: EmailPayload) {
  if (!isEmailJsonConfigured || !emailJsonUrl) {
    console.warn('EmailJSON not configured, skipping email')
    return
  }

  try {
    const response = await fetch(emailJsonUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error('EmailJSON send failed:', await response.text())
    }
  } catch (err) {
    console.error('EmailJSON error:', err)
  }
}

export async function sendComplaintNotification(
  toEmail: string,
  authorityName: string,
  caseNumber: string,
  title: string,
  description: string
) {
  await sendEmail({
    to: toEmail,
    subject: `[${caseNumber}] New Civic Complaint: ${title}`,
    body: `
      <h2>New Complaint Filed</h2>
      <p><strong>Case Number:</strong> ${caseNumber}</p>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Assigned To:</strong> ${authorityName}</p>
      <hr/>
      <p><small>Nammude Shabdham - Participatory Governance Platform</small></p>
    `,
  })
}
