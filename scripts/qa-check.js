(async () => {
  const base = 'http://127.0.0.1:3000';
  const results = [];
  try {
    // Check homepage
    const home = await fetch(`${base}/`);
    results.push({ name: '/', status: home.status, ok: home.ok });

    // Check admin (expect 401 when ADMIN_USER not set)
    const admin = await fetch(`${base}/admin`, { redirect: 'manual' });
    results.push({ name: '/admin', status: admin.status, ok: admin.ok });

    // Contact POST
    const contactResp = await fetch(`${base}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'QA Tester', email: 'qa@example.com', message: 'Automated QA test message' }),
    });
    let contactJson = null;
    try { contactJson = await contactResp.json(); } catch (e) { contactJson = { parseError: String(e) }; }
    results.push({ name: '/api/contact POST', status: contactResp.status, ok: contactResp.ok, body: contactJson });

    // Basic check for static sections presence in homepage HTML
    const homeText = await home.text();
    results.push({ name: 'homepage contains skills id', found: homeText.includes('id="skills"') });
    results.push({ name: 'homepage contains contact id', found: homeText.includes('id="contact"') });

    console.log(JSON.stringify({ success: true, results }, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(JSON.stringify({ success: false, error: String(err) }, null, 2));
    process.exit(2);
  }
})();
