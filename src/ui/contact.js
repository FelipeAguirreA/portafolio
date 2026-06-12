// Formulario de contacto — UN solo handler de submit, hablando con /api/send-email.

export function initContact() {
  const form = document.getElementById('contact-form')
  const status = document.getElementById('form-status')
  const successDialog = document.getElementById('success-dialog')
  if (!form) return

  document.getElementById('success-close').addEventListener('click', () => successDialog.close())
  successDialog.addEventListener('click', (e) => {
    if (e.target === successDialog) successDialog.close()
  })

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    if (!form.reportValidity()) return

    const data = new FormData(form)
    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      subject: data.get('subject'),
      message: data.get('message'),
    }

    const btn = form.querySelector('.form__submit')
    const label = btn.querySelector('span')
    const original = label.textContent
    btn.disabled = true
    label.textContent = 'Transmitiendo…'
    status.textContent = ''
    status.classList.remove('form__status--error')

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const ct = res.headers.get('content-type') || ''
        const detail = ct.includes('application/json')
          ? (await res.json()).error
          : 'Error del servidor'
        throw new Error(detail || 'Error al enviar')
      }

      form.reset()
      successDialog.showModal()
    } catch (err) {
      console.error('Error enviando formulario:', err)
      status.textContent =
        '// ERROR DE CANAL — intenta de nuevo o escríbeme directo a felipeaguirreee@gmail.com'
      status.classList.add('form__status--error')
    } finally {
      btn.disabled = false
      label.textContent = original
    }
  })
}
