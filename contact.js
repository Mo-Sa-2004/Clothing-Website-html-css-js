// Contact form submit handling (contact.html only)
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const status = document.getElementById('form-status');
    const nameField = document.getElementById('contact-name');
    const emailField = document.getElementById('contact-email');
    const messageField = document.getElementById('contact-message');
    const submitBtn = form.querySelector('button[type="submit"]');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setStatus(message, type) {
        status.textContent = message;
        status.classList.remove('success', 'error');
        if (type) status.classList.add(type);
    }

    form.addEventListener('submit', e => {
        e.preventDefault();

        const name = nameField.value.trim();
        const email = emailField.value.trim();
        const message = messageField.value.trim();

        if (!name || !email || !message) {
            setStatus('Please fill in every field before sending.', 'error');
            return;
        }

        if (!emailPattern.test(email)) {
            setStatus('Please enter a valid email address.', 'error');
            emailField.focus();
            return;
        }

        const originalLabel = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        setStatus('', null);

        // No backend is wired up yet, so this simulates a send the same
        // way the checkout form simulates placing an order.
        setTimeout(() => {
            setStatus(`Thanks, ${name}! Your message has been sent -- we'll get back to you soon.`, 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
        }, 1200);
    });
});
