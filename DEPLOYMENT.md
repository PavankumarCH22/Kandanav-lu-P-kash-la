# Publish Kandanavolu Vata Website

This project is ready to publish as one Node.js web service.

## Best Option: Render

1. Create or open your Render account.
2. Upload this project to GitHub.
3. In Render, create a new **Web Service** from that GitHub repo.
4. Use these settings:
   - Build command: `npm install`
   - Start command: `npm start`
   - Runtime: Node
5. Add environment variables:
   - `ADMIN_PASSWORD`: choose your private admin password
   - `ADMIN_SECRET`: use a long random secret text
6. Deploy.

After deploy, Render gives a public URL like:

```text
https://kandanavolu-vata.onrender.com
```

Share that URL with customers. The admin page will be:

```text
https://your-public-url/admin.html
```

## Important

The current app stores bookings in `data/inquiries.json`. This works for testing and small demos, but production hosting can reset local files during redeploys. For long-term business use, connect MongoDB or another database for permanent booking storage.
